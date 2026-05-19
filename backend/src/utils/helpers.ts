import { v4 as uuidv4 } from "uuid";

export const generateId = (): string => uuidv4();

export const computePopularityScore = (
  friendCount: number,
  sharedHobbiesTotal: number
): number => {
  return friendCount + sharedHobbiesTotal * 0.5;
};

export const countSharedHobbies = (
  userHobbies: string[],
  friendHobbies: string[]
): number => {
  return userHobbies.filter((h) => friendHobbies.includes(h)).length;
};

export const cosineSimilarity = (a: number[], b: number[]): number => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
};