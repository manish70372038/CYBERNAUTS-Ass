// Lightweight TF-IDF style hobby embedding (no external AI API needed)
export const buildVocabulary = (allHobbies: string[]): string[] => {
  return [...new Set(allHobbies.map((h) => h.toLowerCase().trim()))];
};

export const hobbyToVector = (
  hobbies: string[],
  vocabulary: string[]
): number[] => {
  return vocabulary.map((word) =>
    hobbies.map((h) => h.toLowerCase()).includes(word) ? 1 : 0
  );
};

export const semanticSimilarity = (
  hobbiesA: string[],
  hobbiesB: string[],
  vocabulary: string[]
): number => {
  const vecA = hobbyToVector(hobbiesA, vocabulary);
  const vecB = hobbyToVector(hobbiesB, vocabulary);

  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(vecB.reduce((s, v) => s + v * v, 0));

  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
};