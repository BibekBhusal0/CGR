import { expect, test, describe } from "bun:test";
import { rephraseEvaluation } from "@/Logic/rephraseEvaluation";

describe("rephraseEvaluation", () => {
  test("positive centipawns show plus and two decimals", () => {
    expect(rephraseEvaluation({ type: "cp", value: 2345 })).toBe("+23.45");
    expect(rephraseEvaluation({ type: "cp", value: 150 })).toBe("+1.50");
    expect(rephraseEvaluation({ type: "cp", value: 100 })).toBe("+1.00");
    expect(rephraseEvaluation({ type: "cp", value: 1 })).toBe("+0.01");
  });

  test("zero centipawns show plus zero", () => {
    expect(rephraseEvaluation({ type: "cp", value: 0 })).toBe("+0.00");
  });

  test("negative centipawns show minus and two decimals", () => {
    expect(rephraseEvaluation({ type: "cp", value: -1 })).toBe("-0.01");
    expect(rephraseEvaluation({ type: "cp", value: -45 })).toBe("-0.45");
    expect(rephraseEvaluation({ type: "cp", value: -1250 })).toBe("-12.50");
  });

  test("centipawns always show two decimals with explicit sign", () => {
    expect(rephraseEvaluation({ type: "cp", value: 5 })).toMatch(/^[+-]\d+\.\d{2}$/);
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
    expect(rephraseEvaluation({ type: "cp", value: "100" as unknown as number })).toBe("+1.00");
    expect(rephraseEvaluation({ type: "mate", value: "4" as unknown as number })).toBe("+M4");
  });
});
