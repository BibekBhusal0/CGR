import { expect, test, describe } from "bun:test";
import { getOpp, isLightSquare } from "@/Logic/pieces";

describe("getOpp", () => {
  test("white to black", () => {
    expect(getOpp("w")).toBe("b");
  });

  test("black to white", () => {
    expect(getOpp("b")).toBe("w");
  });

  test("double application returns the input", () => {
    expect(getOpp(getOpp("w"))).toBe("w");
    expect(getOpp(getOpp("b"))).toBe("b");
  });
});

describe("isLightSquare", () => {
  test("a1 is dark", () => {
    expect(isLightSquare("a1")).toBe(false);
  });

  test("h1 is light", () => {
    expect(isLightSquare("h1")).toBe(true);
  });

  test("a8 is light", () => {
    expect(isLightSquare("a8")).toBe(true);
  });

  test("h8 is dark", () => {
    expect(isLightSquare("h8")).toBe(false);
  });

  test("e4 is light", () => {
    expect(isLightSquare("e4")).toBe(true);
  });

  test("d4 is dark", () => {
    expect(isLightSquare("d4")).toBe(false);
  });

  test("e5 is dark", () => {
    expect(isLightSquare("e5")).toBe(false);
  });

  test("d5 is light", () => {
    expect(isLightSquare("d5")).toBe(true);
  });

  test("adjacent squares alternate", () => {
    expect(isLightSquare("c3")).not.toBe(isLightSquare("c4"));
    expect(isLightSquare("c3")).not.toBe(isLightSquare("d3"));
  });
});
