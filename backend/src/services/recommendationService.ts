import User, { IUser } from "../models/User";
import { countSharedHobbies } from "../utils/helpers";
import { semanticSimilarity, buildVocabulary } from "./embeddingService";

interface Recommendation {
  userId?: string;
  username?: string;
  hobby?: string;
  score: number;
  reason: string;
  sourceSignals: string[];
}

export const getFriendRecommendations = async (
  userId: string
): Promise<Recommendation[]> => {
  const user = await User.findOne({ id: userId });
  if (!user) return [];

  const allUsers = await User.find({ id: { $ne: userId } });
  const allHobbies = allUsers.flatMap((u) => u.hobbies).concat(user.hobbies);
  const vocabulary = buildVocabulary(allHobbies);

  const rejected = user.feedbackData?.rejected || [];
  const accepted = user.feedbackData?.accepted || [];

  const candidates = allUsers.filter(
    (u) =>
      !user.friends.includes(u.id) &&
      !rejected.includes(u.id)
  );

  const scored = candidates.map((candidate) => {
    // Mutual friends signal
    const mutualFriends = user.friends.filter((fid) =>
      candidate.friends.includes(fid)
    ).length;

    // Shared hobbies signal
    const sharedHobbies = countSharedHobbies(user.hobbies, candidate.hobbies);

    // Semantic similarity signal
    const semantic = semanticSimilarity(
      user.hobbies,
      candidate.hobbies,
      vocabulary
    );

    // Feedback boost
    const feedbackBoost = accepted.includes(candidate.id) ? 1.5 : 1;

    const score =
      (mutualFriends * 2 + sharedHobbies * 1.5 + semantic * 3) * feedbackBoost;

    const signals: string[] = [];
    if (mutualFriends > 0) signals.push(`${mutualFriends} mutual friend(s)`);
    if (sharedHobbies > 0) signals.push(`${sharedHobbies} shared hobby(s)`);
    if (semantic > 0.2) signals.push(`semantic hobby similarity: ${semantic.toFixed(2)}`);
    if (feedbackBoost > 1) signals.push("previously accepted recommendation");

    return {
      userId: candidate.id,
      username: candidate.username,
      score: parseFloat(score.toFixed(3)),
      reason: signals.length
        ? `Recommended because: ${signals.join(", ")}`
        : "Potential new connection",
      sourceSignals: signals,
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 5);
};

export const getHobbyRecommendations = async (
  userId: string
): Promise<Recommendation[]> => {
  const user = await User.findOne({ id: userId });
  if (!user) return [];

  const friends = await User.find({ id: { $in: user.friends } });

  const hobbyFrequency: Record<string, number> = {};

  for (const friend of friends) {
    for (const hobby of friend.hobbies) {
      if (!user.hobbies.includes(hobby)) {
        hobbyFrequency[hobby] = (hobbyFrequency[hobby] || 0) + 1;
      }
    }
  }

  const rejectedHobbies = user.feedbackData?.rejected || [];

  const recommendations = Object.entries(hobbyFrequency)
    .filter(([hobby]) => !rejectedHobbies.includes(hobby))
    .map(([hobby, count]) => ({
      hobby,
      score: parseFloat((count * 1.5).toFixed(3)),
      reason: `${count} of your friend(s) have this hobby`,
      sourceSignals: [`friend frequency: ${count}`],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return recommendations;
};