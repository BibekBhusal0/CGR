import { expect, test, describe } from "bun:test";
import { isPinned } from "../../src/Logic/pieces";

describe("Absolute Pins", () => {
  test("Rook Pinned By Bishop", () => {
    const result = isPinned("r2q1k2/pp1bb1rp/2ppp2B/4N2Q/8/8/PPP2PPP/RN4K1 w - - 0 1", "g7");
    expect(result).toEqual({
      type: "absolute",
      targetPiece: { type: "k", color: "b", square: "f8" },
    });
  });
  test("Rook Pinned By Queen", () => {
    const result = isPinned("7k/1q2nprp/p3pQ2/5p2/2P5/1P3brP/P3B1P1/3R1RK1 w - - 0 1", "g7");
    expect(result).toEqual({
      type: "absolute",
      targetPiece: { type: "k", color: "b", square: "h8" },
    });
  });
  test("Knight Pinned By Queen", () => {
    const result = isPinned("2rr2k1/p5b1/2q1P1Q1/1p5p/5P1P/1Pp2NP1/PB4K1/4R3 b - - 0 1", "f3");
    expect(result).toEqual({
      type: "absolute",
      targetPiece: { type: "k", color: "w", square: "g2" },
    });
  });
  test("Queen Pinned By Bishp", () => {
    const result = isPinned("1rn3k1/pP4pp/1b1pq1r1/3Bp3/QP3p2/P2P2P1/4PP1P/5RK1 b - - 0 1", "e6");
    expect(result).toEqual({
      type: "absolute",
      targetPiece: { type: "k", color: "b", square: "g8" },
    });
  });
  test("Pawn Pinned By Queen", () => {
    const result = isPinned("3r1r1k/ppp3pp/4P3/5p2/7q/1QN3b1/PP2B2P/R4R1K w - - 0 1", "h2");
    expect(result).toEqual({
      type: "absolute",
      targetPiece: { type: "k", color: "w", square: "h1" },
    });
  });
  test("Queen Pinned By Rook", () => {
    const result = isPinned("8/p1p3pk/1pn3r1/8/6Q1/2P1Pq1P/PP3P2/3R1RK1 w - - 0 1", "g4");
    expect(result).toEqual({
      type: "absolute",
      targetPiece: { type: "k", color: "w", square: "g1" },
    });
  });
});

describe("Relative Pins", () => {
  test("Pawn pinned by Bishop to queen", () => {
    const result = isPinned(
      "r2q1rk1/ppp3pp/2nbbp2/3n2B1/3P4/2N2N2/PP2BPPP/R2Q1RK1 w - - 0 1",
      "f6"
    );
    expect(result).toEqual({
      type: "relative",
      targetPiece: { type: "q", color: "b", square: "d8" },
    });
  });
  test("Pawn pinned by Rook to Rook", () => {
    const result = isPinned(
      "3r1r1k/ppp3pp/3bP3/5p2/3q4/1QN5/PP2B1PP/R4R1K b - - 0 1",
      "f5"
    );
    expect(result).toEqual({
      type: "relative",
      targetPiece: { type: "r", color: "b", square: "f8" },
    });
  });
});


describe("Not Pinned", () => {
  test("Pin Blocked by own piece", () => {
    const result = isPinned( "2rr2k1/p5b1/2q1P1Q1/1p5p/4B11P/1Pp2NP1/PB4K1/4R3 b - - 0 1", "f3");
    expect(result).toBeUndefined();
  });

  test("Lower Value Piece", () => {
    const result = isPinned( "3p4/8/3r4/8/8/8/8/3R4 w - - 0 1", "d6");
    expect(result).toBeUndefined();
  });

  test("Equal value piece", () => {
    const result = isPinned( "4r3/8/8/8/4N3/8/8/4N3 w - - 0 1", "e4");
    expect(result).toBeUndefined();
  });

  test("Same Color Piece Pin", () => {
    const result = isPinned( "5k2/8/8/8/8/8/5P2/5R2 w - - 0 1", "f2");
    expect(result).toBeUndefined();
  });

  test("Piece not lined up", () => {
    const result = isPinned( "r7/8/8/8/8/2N5/8/1Q6 w - - 0 1", "c3");
    expect(result).toBeUndefined();
  });

  test("Just Check", () => {
    const result = isPinned( "r3k3/8/8/8/8/8/8/4R3 w - - 0 1", "e8");
    expect(result).toBeUndefined();
  });

  test("Just fork", () => {
    // A Knight is 'forking' a Pawn the King.
    const result = isPinned( "4k3/8/3n4/8/4P3/8/8/8 w - - 0 1", "e4");
    expect(result).toBeUndefined();
  });
});
