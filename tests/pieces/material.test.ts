import { expect, test, describe } from "bun:test";
import { DEFAULT_POSITION } from "chess.js";
import { getMaterial, getMaterialDiff, getMaterialSurplus, pieceValues } from "@/Logic/pieces";

describe("getMaterial", () => {
  test("starting position 39 each (kings excluded)", () => {
    expect(getMaterial(DEFAULT_POSITION, "w")).toBe(8 + 6 + 6 + 10 + 9);
    expect(getMaterial(DEFAULT_POSITION, "b")).toBe(39);
  });

  test("kings never counted", () => {
    expect(getMaterial("4k3/8/8/8/8/8/8/4K3 w - - 0 1", "w")).toBe(0);
    expect(getMaterial("4k3/8/8/8/8/8/8/4K3 w - - 0 1", "b")).toBe(0);
  });

  test("single pieces scored per side", () => {
    expect(getMaterial("4k3/8/8/8/8/8/8/3Q3K w - - 0 1", "w")).toBe(9);
    expect(getMaterial("4k3/8/8/8/8/8/8/3q3K w - - 0 1", "w")).toBe(0);
    expect(getMaterial("4k3/8/8/8/8/8/8/3q3K w - - 0 1", "b")).toBe(9);
    expect(getMaterial("4k3/8/8/8/8/8/8/3R3K w - - 0 1", "w")).toBe(5);
    expect(getMaterial("4k3/8/8/8/8/8/8/3N3K w - - 0 1", "w")).toBe(3);
  });

  test("white intact (39), black down a pawn (38)", () => {
    const fen = "r2qkb1r/pp2nppp/2n1p3/2PpP3/6b1/2PQBN2/PP3PPP/RN2KB1R b KQkq - 0 8";
    expect(getMaterial(fen, "w")).toBe(39);
    expect(getMaterial(fen, "b")).toBe(38);
  });

  test("rook endgame with pawns", () => {
    const fen = "2r4k/5pp1/p3p3/3p4/2rP2b1/4K3/PP3PPP/R6R w - - 2 26";
    expect(getMaterial(fen, "w")).toBe(16);
    expect(getMaterial(fen, "b")).toBe(18);
  });

  test("white 34, black 33", () => {
    const fen = "rn1q1r1k/ppp2Bpp/1bn5/8/3P4/1QP2RB1/PP2N1PP/R5K1 w - - 1 17";
    expect(getMaterial(fen, "w")).toBe(34);
    expect(getMaterial(fen, "b")).toBe(33);
  });

  test("promoted extra queen counts", () => {
    expect(getMaterial("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQQBNR w KQkq - 0 1", "w")).toBe(48);
  });

  test("empty and malformed placement", () => {
    expect(getMaterial("", "w")).toBe(0);
    expect(getMaterial("8/8/8/8/8/8/8/8 w - - 0 1", "b")).toBe(0);
  });
});

describe("getMaterialDiff", () => {
  test("equal is zero", () => {
    expect(getMaterialDiff(DEFAULT_POSITION)).toEqual({ white: 39, black: 39, diff: 0 });
  });

  test("lone queen is 9 either way", () => {
    expect(getMaterialDiff("rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")).toEqual({
      white: 39,
      black: 30,
      diff: 9,
    });
    expect(getMaterialDiff("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1").diff).toBe(
      -9
    );
  });

  test("middlegame diffs", () => {
    expect(
      getMaterialDiff("r2qkb1r/pp2nppp/2n1p3/2PpP3/6b1/2PQBN2/PP3PPP/RN2KB1R b KQkq - 0 8").diff
    ).toBe(1);
    expect(getMaterialDiff("2r4k/5pp1/p3p3/3p4/2rP2b1/4K3/PP3PPP/R6R w - - 2 26").diff).toBe(-2);
    expect(
      getMaterialDiff("rn1q1r1k/ppp2Bpp/1bn5/8/3P4/1QP2RB1/PP2N1PP/R5K1 w - - 1 17").diff
    ).toBe(1);
  });

  test("diff always equals white minus black", () => {
    const d = getMaterialDiff("r4rk1/pp1b1pbp/4q1p1/2B5/2Q5/P3PB1P/1PP2PP1/R4RK1 w - - 0 1");
    expect(d.diff).toBe(d.white - d.black);
  });
});

describe("getMaterialSurplus", () => {
  test("equal position", () => {
    expect(getMaterialSurplus(DEFAULT_POSITION)).toEqual({ w: [], b: [], diff: 0 });
  });

  test("lone extra queen attributed to the right side", () => {
    const whiteUp = getMaterialSurplus("rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    expect(whiteUp.w).toEqual(["q"]);
    expect(whiteUp.b).toEqual([]);
    const blackUp = getMaterialSurplus("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1");
    expect(blackUp.w).toEqual([]);
    expect(blackUp.b).toEqual(["q"]);
  });

  test("exchange swap: white rook against black knight", () => {
    const s = getMaterialSurplus("1nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKB1R w KQkq - 0 1");
    expect(s.w).toEqual(["r"]);
    expect(s.b).toEqual(["n"]);
    expect(s.diff).toBe(2);
  });

  test("several missing pawns listed individually, queen first", () => {
    const s = getMaterialSurplus("rnb1kbnr/ppp1pppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    expect(s.w).toEqual(["q", "p"]);
    expect(s.diff).toBe(10);
  });

  test("white up a single pawn", () => {
    const s = getMaterialSurplus(
      "r2qkb1r/pp2nppp/2n1p3/2PpP3/6b1/2PQBN2/PP3PPP/RN2KB1R b KQkq - 0 8"
    );
    expect(s.w).toEqual(["p"]);
    expect(s.b).toEqual([]);
    expect(s.diff).toBe(1);
  });

  test("bishop and pawn against knight", () => {
    const s = getMaterialSurplus("rn1q1r1k/ppp2Bpp/1bn5/8/3P4/1QP2RB1/PP2N1PP/R5K1 w - - 1 17");
    expect(s.w).toEqual(["b", "p"]);
    expect(s.b).toEqual(["n"]);
    expect(s.diff).toBe(1);
  });

  test("surplus piece values always reconcile with diff", () => {
    const check = (fen: string) => {
      const s = getMaterialSurplus(fen);
      const wValue = s.w.reduce((sum, t) => sum + pieceValues[t], 0);
      const bValue = s.b.reduce((sum, t) => sum + pieceValues[t], 0);
      expect(wValue - bValue).toBe(s.diff);
    };
    check(DEFAULT_POSITION);
    check("r2qkb1r/pp2nppp/2n1p3/2PpP3/6b1/2PQBN2/PP3PPP/RN2KB1R b KQkq - 0 8");
    check("2r4k/5pp1/p3p3/3p4/2rP2b1/4K3/PP3PPP/R6R w - - 2 26");
    check("1nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKB1R w KQkq - 0 1");
  });
});
