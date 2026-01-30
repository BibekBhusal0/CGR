import { expect, test, describe } from "bun:test";
import { isPinned, notPinned } from "../../src/Logic/pieces";

describe("Simple Rook Pin", () => {
  test("case 0", () => {
    const result = isPinned("4r3/8/8/8/4B3/8/8/4Q3 w - - 0 1", "e4");
    expect(result).toEqual({ pinned: true, type: "relative" });
  });

  test("case 1", () => {
    const result = isPinned("4r3/8/8/8/4B3/4Q3/8/8 w - - 0 1", "e4");
    expect(result).toEqual({ pinned: true, type: "relative" });
  });

  test("case 2", () => {
    const result = isPinned("4r3/8/8/8/4B3/4K3/8/8 w - - 0 1", "e4");
    expect(result).toEqual({ pinned: true, type: "absolute" });
  });
});

describe("Nonsense Positions", () => {
  test("case 1", () => {
    const result = isPinned("hello mr", "f3");
    expect(result).toEqual(notPinned);
  });

  test("case 2", () => {
    const result = isPinned("4r3/8/8/8/4B3/4Q3/8/8", "f3");
    expect(result).toEqual(notPinned);
  });
});
