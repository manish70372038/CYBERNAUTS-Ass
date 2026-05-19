import User from "../models/User";
import { computePopularityScore, countSharedHobbies } from "../utils/helpers";

export const recomputePopularity = async (userId: string): Promise<number> => {
  const user = await User.findOne({ id: userId });
  if (!user) return 0;

  let totalSharedHobbies = 0;

  for (const friendId of user.friends) {
    const friend = await User.findOne({ id: friendId });
    if (friend) {
      totalSharedHobbies += countSharedHobbies(user.hobbies, friend.hobbies);
    }
  }

  const score = computePopularityScore(user.friends.length, totalSharedHobbies);

  await User.updateOne({ id: userId }, { popularityScore: score });

  return score;
};

export const recomputeAllFriendsPopularity = async (
  friendIds: string[]
): Promise<void> => {
  for (const fid of friendIds) {
    await recomputePopularity(fid);
  }
};