import { computePopularityScore, countSharedHobbies } from "../src/utils/helpers";

describe("Popularity Score Logic", () => {
  test("score = friends + sharedHobbies * 0.5", () => {
    expect(computePopularityScore(4, 6)).toBe(7);
  });

  test("score is 0 when no friends and no hobbies", () => {
    expect(computePopularityScore(0, 0)).toBe(0);
  });

  test("counts shared hobbies correctly", () => {
    const a = ["chess", "reading", "gaming"];
    const b = ["chess", "cooking", "gaming"];
    expect(countSharedHobbies(a, b)).toBe(2);
  });
});