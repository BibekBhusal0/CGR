import { test, expect, describe } from "bun:test";
import { getXrayAttackers } from "../../src/Logic/pieces";
import { Chess } from "chess.js";

describe("X-ray Attacks Simple", () => {
  test("Queen attacking through Bishop", () => {
    const attackers = getXrayAttackers(
      new Chess("1br2rk1/pp2np1p/2n1pBp1/3p4/3P1q1Q/2PB1N1P/PP3PP1/R4RK1 w - - 0 1", {
        skipValidation: true,
      }),
      "e7",
      "w"
    );
    expect(attackers).toEqual(["h4"]);
  });
  test("Rook Attacking through Rook", () => {
    const attackers = getXrayAttackers(
      new Chess("5rk1/pp3Rp1/3p2Qp/2b5/8/3p4/PP2q1PP/5R1K b - - 0 1", {
        skipValidation: true,
      }),
      "f1",
      "b"
    );
    expect(attackers).toEqual(["f8"]);
  });
  test("Rook Attacking through Rook, 2", () => {
    const attackers = getXrayAttackers(
      new Chess("3r1rk1/5ppp/Q7/1pp5/4N1q1/8/PPPR1PPP/3R2K1 b - - 0 1", {
        skipValidation: true,
      }),
      "d1",
      "b"
    );
    expect(attackers).toEqual(["d8"]);
  });
  test("Rook Attacking through Rook, 3", () => {
    const attackers = getXrayAttackers(
      new Chess("3k4/pp1b2pp/1p3p2/1P1Q4/8/P7/5PPP/2rRr1K1 w - - 0 1", {
        skipValidation: true,
      }),
      "c1",
      "b"
    );
    expect(attackers).toEqual(["e1"]);
  });
  test("Bishop attacked by Queen through Opponent's Queen", () => {
    const attackers = getXrayAttackers(
      new Chess("r4r1k/pp4pp/2p5/2bpP3/5P2/1BP1BQ1q/P7/R4RK1 b - - 0 1", {
        skipValidation: true,
      }),
      "e3",
      "b"
    );
    expect(attackers).toEqual(["h3"]);
  });
  test("Queen attacking through Opponent's Knight", () => {
    const attackers = getXrayAttackers(
      new Chess("5rk1/pp2Q2p/2p3p1/8/2P5/2N4b/PP5P/2q1RNKR b - - 0 1", {
        skipValidation: true,
      }),
      "f1",
      "b"
    );
    expect(attackers).toEqual(["c1"]);
  });
  test("Queen attacking through Opponent's Queen", () => {
    const attackers = getXrayAttackers(
      new Chess("5r1k/1p3p2/pP1R3p/6q1/6P1/4Q2P/1Pr5/3R2K1 w - - 0 1", {
        skipValidation: true,
      }),
      "h6",
      "w"
    );
    expect(attackers).toEqual(["e3"]);
  });
});

describe("X-ray Through Pawn", () => {
  test("Queen Attacking through pawn", () => {
    const attackers = getXrayAttackers(
      new Chess("1k2r2Q/1pp3P1/8/5N2/8/8/5PK1/q7 w - - 0 1", { skipValidation: true }),
      "h8",
      "b"
    );
    expect(attackers).toEqual(["a1"]);
  });
  test("Bishop Attacking through pawn", () => {
    const attackers = getXrayAttackers(
      new Chess("8/8/8/4P3/3R4/6B1/8/8 w - - 0 1", { skipValidation: true }),
      "d6",
      "w"
    );
    expect(attackers).toEqual(["g3"]);
  });
  test("Bishop Attacking through pawn", () => {
    const attackers = getXrayAttackers(
      new Chess("8/8/8/4P3/3B4/6B1/4R3/8 w - - 0 1", { skipValidation: true }),
      "d6",
      "w"
    );
    expect(attackers).toEqual(["g3"]);
  });
  test("Bishop and Queen Attacking through pawn", () => {
    const attackers = getXrayAttackers(
      new Chess("8/8/8/4P3/5B2/6B1/7Q/8 w - - 0 1", { skipValidation: true }),
      "d6",
      "w"
    );
    expect(attackers).toEqual(["f4", "g3", "h2"]);
  });
  test("Bishop and Queen Attacking through Opponent's pawn", () => {
    const attackers = getXrayAttackers(
      new Chess("8/8/8/4p3/5B2/6B1/7Q/8 w - - 0 1", { skipValidation: true }),
      "d6",
      "w"
    );
    expect(attackers).toEqual([]);
  });
  test("Bishop and Queen Attacking through pawn - Interrupted", () => {
    const attackers = getXrayAttackers(
      new Chess("8/8/8/4P3/5R2/6B1/7Q/8 w - - 0 1", { skipValidation: true }),
      "d6",
      "w"
    );
    expect(attackers).toEqual([]);
  });
  test("Bishop and Attacking through pawn - 1", () => {
    const attackers = getXrayAttackers(
      new Chess("8/1P6/2b5/4P3/4p3/2B5/1p6/8 w - - 0 1", { skipValidation: true }),
      "f6",
      "w"
    );
    expect(attackers).toEqual(["c3"]);
  });
  test("Bishop and Attacking through pawn - 2", () => {
    const attackers = getXrayAttackers(
      new Chess("8/1P6/2b5/4P3/4p3/2B5/1p6/8 w - - 0 1", { skipValidation: true }),
      "f3",
      "b"
    );
    expect(attackers).toEqual(["c6"]);
  });
  test("Bishop and Attacking through pawn - 3", () => {
    const attackers = getXrayAttackers(
      new Chess("8/1P6/2b5/4P3/4p3/2B5/1p6/8 w - - 0 1", { skipValidation: true }),
      "a8",
      "b"
    );
    expect(attackers).toEqual(["c6"]);
  });
  test("Bishop and Attacking through pawn - 4", () => {
    const attackers = getXrayAttackers(
      new Chess("8/1P6/2b5/4P3/4p3/2B5/1p6/8 w - - 0 1", { skipValidation: true }),
      "a1",
      "w"
    );
    expect(attackers).toEqual(["c3"]);
  });
});

describe("Custom position (X-ray)", () => {
  test("Many bishops attacking through queen", () => {
    const attackers = getXrayAttackers(
      new Chess("b7/1b6/2b5/3q4/8/8/8/8 w - - 0 1", {
        skipValidation: true,
      }),
      "h1",
      "b"
    );
    expect(attackers).toEqual(["c6", "b7", "a8"]);
  });
  test("Many rooks attacking through queen", () => {
    const attackers = getXrayAttackers(
      new Chess("3r4/3r4/3r4/3q4/8/8/8/8 w - - 0 1", {
        skipValidation: true,
      }),
      "d1",
      "b"
    );
    expect(attackers).toEqual(["d6", "d7", "d8"]);
  });
  test("Many rooks attacking through opponent's rook", () => {
    const attackers = getXrayAttackers(
      new Chess("3r4/3r4/3r4/3q4/3R4/8/8/8 w - - 0 1", {
        skipValidation: true,
      }),
      "d1",
      "b"
    );
    expect(attackers).toEqual(["d5", "d6", "d7", "d8"]);
  });
  test("Rooks attacking through opponent's rook (2 Opponent's rook in between)", () => {
    const attackers = getXrayAttackers(
      new Chess("3r4/3r4/3r4/3q4/3R4/3R4/8/8 w - - 0 1", {
        skipValidation: true,
      }),
      "d1",
      "b"
    );
    expect(attackers).toEqual([]);
  });
});

describe("Not Xray Attack", () => {
  test("Starting position", () => {
    const attackers = getXrayAttackers(
      new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1", { skipValidation: true }),
      "f5",
      "b"
    );
    expect(attackers).toEqual([]);
  });
  test("Attacking through Opponent's Pawn", () => {
    const attackers = getXrayAttackers(
      new Chess("r1bqkbnr/ppp2ppp/2n5/3pp3/2Q1P3/1B6/PPPP1PPP/RNB1K1NR w KQkq - 0 1", {
        skipValidation: true,
      }),
      "f7",
      "w"
    );
    expect(attackers).toEqual([]);
  });
  test("Attacking through Own Pawn", () => {
    const attackers = getXrayAttackers(
      new Chess("r1bqkbnr/ppp2ppp/2n5/3Pp3/2Q5/1B6/PPPP1PPP/RNB1K1NR b KQkq - 0 1", {
        skipValidation: true,
      }),
      "f7",
      "w"
    );
    expect(attackers).toEqual([]);
  });
});
