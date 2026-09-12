import { expect, test, describe } from "bun:test";
import { rephraseEvaluation } from "@/Logic/rephraseEvaluation";

describe("rephraseEvaluation", () => {
  test("positive centipawns show plus and one decimal", () => {
    expect(rephraseEvaluation({ type: "cp", value: 2346 })).toBe("+23.5");
    expect(rephraseEvaluation({ type: "cp", value: 150 })).toBe("+1.5");
    expect(rephraseEvaluation({ type: "cp", value: 100 })).toBe("+1.0");
    expect(rephraseEvaluation({ type: "cp", value: 34 })).toBe("+0.3");
  });

  test("zero centipawns show plain zero", () => {
    expect(rephraseEvaluation({ type: "cp", value: 0 })).toBe("0");
  });

  test("near-zero centipawns round to zero", () => {
    expect(rephraseEvaluation({ type: "cp", value: 1 })).toBe("0");
    expect(rephraseEvaluation({ type: "cp", value: -1 })).toBe("0");
    expect(rephraseEvaluation({ type: "cp", value: 4 })).toBe("0");
  });

  test("negative centipawns show minus and one decimal", () => {
    expect(rephraseEvaluation({ type: "cp", value: -50 })).toBe("-0.5");
    expect(rephraseEvaluation({ type: "cp", value: -1250 })).toBe("-12.5");
  });

  test("non-zero evals show sign and one decimal", () => {
    expect(rephraseEvaluation({ type: "cp", value: 2346 })).toMatch(/^[+-]\d+\.\d$/);
  });

  test("mate distance shows side sign and magnitude", () => {
    expect(rephraseEvaluation({ type: "mate", value: 5 })).toBe("+M5");
    expect(rephraseEvaluation({ type: "mate", value: -5 })).toBe("-M5");
    expect(rephraseEvaluation({ type: "mate", value: 3 })).toBe("+M3");
    expect(rephraseEvaluation({ type: "mate", value: -2 })).toBe("-M2");
  });

  test("mate in 1 or mated is a result, not a score", () => {
    expect(rephraseEvaluation({ type: "mate", value: 1 })).toBe("1-0");
    expect(rephraseEvaluation({ type: "mate", value: -1 })).toBe("0-1");
    expect(rephraseEvaluation({ type: "mate", value: 0 })).toBe("0-1");
  });

  test("numeric-string values are coerced", () => {
    expect(rephraseEvaluation({ type: "cp", value: "100" as unknown as number })).toBe("+1.0");
    expect(rephraseEvaluation({ type: "mate", value: "4" as unknown as number })).toBe("+M4");
  });
});
