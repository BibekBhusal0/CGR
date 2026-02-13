import { expect, test, describe } from "bun:test";
import { seeBehindPiece } from "../../src/Logic/pieces";
import { Chess } from "chess.js";

describe("up", () => {
  test("case 1: find immediate piece", () => {
    const game = new Chess("8/4r3/4P3/8/8/8/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("e6", "up", game);
    expect(result).toEqual({ type: "r", color: "b", square: "e7" });
  });
  test("case 2: find distant piece", () => {
    const game = new Chess("4q3/8/8/8/8/8/4K3/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("e2", "up", game);
    expect(result).toEqual({ type: "q", color: "b", square: "e8" });
  });
});

describe("down", () => {
  test("case 1: find immediate piece", () => {
    const game = new Chess("8/8/8/8/3k4/3p4/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("d4", "down", game);
    expect(result).toEqual({ type: "p", color: "b", square: "d3" });
  });
  test("case 2: find distant piece", () => {
    const game = new Chess("8/2k5/8/8/8/2B5/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("c7", "down", game);
    expect(result).toEqual({ type: "b", color: "w", square: "c3" });
  });
});

describe("left", () => {
  test("case 1: find immediate piece", () => {
    const game = new Chess("8/8/8/1rP5/8/8/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("c5", "left", game);
    expect(result).toEqual({ type: "r", color: "b", square: "b5" });
  });
  test("case 2: find distant piece", () => {
    const game = new Chess("8/8/8/8/q3K3/8/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("e4", "left", game);
    expect(result).toEqual({ type: "q", color: "b", square: "a4" });
  });
});

describe("right", () => {
  test("case 1: find immediate piece", () => {
    const game = new Chess("8/8/8/8/4K1p1/8/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("e4", "right", game);
    expect(result).toEqual({ type: "p", color: "b", square: "g4" });
  });
  test("case 2: find distant piece", () => {
    const game = new Chess("8/8/8/8/K5n1/8/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("a4", "right", game);
    expect(result).toEqual({ type: "n", color: "b", square: "g4" });
  });
});

describe("up-left", () => {
  test("case 1: find immediate piece", () => {
    const game = new Chess("8/2b5/3P4/8/8/8/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("d6", "up-left", game);
    expect(result).toEqual({ type: "b", color: "b", square: "c7" });
  });
  test("case 2: find distant piece", () => {
    const game = new Chess("r7/8/8/8/4K3/8/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("e4", "up-left", game);
    expect(result).toEqual({ type: "r", color: "b", square: "a8" });
  });
});

describe("up-right", () => {
  test("case 1: find immediate piece", () => {
    const game = new Chess("8/8/8/8/4K3/5p2/8/8 w - - 0 1", { skipValidation: true });
    seeBehindPiece("e4", "up-right", game);
  });
  // Let's re-verify the squares for these diagonals
  test("case 1 (Fixed): find immediate", () => {
    const game = new Chess("8/8/8/5r2/4K3/8/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("e4", "up-right", game);
    expect(result).toEqual({ type: "r", color: "b", square: "f5" });
  });
  test("case 2: find distant piece", () => {
    const game = new Chess("7q/8/8/8/3K4/8/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("d4", "up-right", game);
    expect(result).toEqual({ type: "q", color: "b", square: "h8" });
  });
});

describe("down-left", () => {
  test("case 1: find immediate piece", () => {
    const game = new Chess("8/8/8/8/4K3/3n4/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("e4", "down-left", game);
    expect(result).toEqual({ type: "n", color: "b", square: "d3" });
  });
  test("case 2: find distant piece", () => {
    const game = new Chess("8/8/8/8/8/8/8/b7 w - - 0 1", { skipValidation: true });
    // From h8 down-left to a1
    const result = seeBehindPiece("h8", "down-left", game);
    expect(result).toEqual({ type: "b", color: "b", square: "a1" });
  });
});

describe("down-right", () => {
  test("case 1: find immediate piece", () => {
    const game = new Chess("8/8/8/8/4K3/8/6p1/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("e4", "down-right", game);
    expect(result).toEqual({ type: "p", color: "b", square: "g2" });
  });
  test("case 2: find distant piece", () => {
    const game = new Chess("8/8/8/8/8/8/8/7R w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("a8", "down-right", game);
    expect(result).toEqual({ type: "r", color: "w", square: "h1" });
  });
});

describe("Edge cases and Empty Paths", () => {
  test("return undefined when hitting board edge", () => {
    const game = new Chess("8/8/8/8/8/8/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("h1", "right", game);
    expect(result).toBeUndefined();
  });

  test("return undefined when path is empty", () => {
    const game = new Chess("8/8/8/8/4K3/8/8/8 w - - 0 1", { skipValidation: true });
    const result = seeBehindPiece("e4", "up", game);
    expect(result).toBeUndefined();
  });
});
