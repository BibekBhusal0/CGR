import { test, expect, describe } from "bun:test";
import { getXrayAttackers } from "../../src/Logic/pieces";
import { Chess } from "chess.js";

describe("X-ray Attacks from Real Games", () => {
  test("Queen attacking through Bishop", () => {
    const attackers = getXrayAttackers(
      new Chess("1br2rk1/pp2np1p/2n1pBp1/3p4/3P1q1Q/2PB1N1P/PP3PP1/R4RK1 w - - 0 1", {
        skipValidation: true,
      }),
      "e7",
      "w"
    );
    expect(attackers).toBe(["h4"]);
  });
  test("Rook Attacking through Rook", () => {
    const attackers = getXrayAttackers(
      new Chess("5rk1/pp3Rp1/3p2Qp/2b5/8/3p4/PP2q1PP/5R1K b - - 0 1", {
        skipValidation: true,
      }),
      "f1",
      "b"
    );
    expect(attackers).toBe(["f8"]);
  });
  test("Rook Attacking through Rook, 2", () => {
    const attackers = getXrayAttackers(
      new Chess("3r1rk1/5ppp/Q7/1pp5/4N1q1/8/PPPR1PPP/3R2K1 b - - 0 1", {
        skipValidation: true,
      }),
      "d1",
      "b"
    );
    expect(attackers).toBe(["d8"]);
  });
  test("Rook Attacking through Rook, 3", () => {
    const attackers = getXrayAttackers(
      new Chess("3k4/pp1b2pp/1p3p2/1P1Q4/8/P7/5PPP/2rRr1K1 w - - 0 1", {
        skipValidation: true,
      }),
      "c1",
      "b"
    );
    expect(attackers).toBe(["e1"]);
  });
  test("Bishop attacked by Queen through Opponent's Queen", () => {
    const attackers = getXrayAttackers(
      new Chess("r4r1k/pp4pp/2p5/2bpP3/5P2/1BP1BQ1q/P7/R4RK1 b - - 0 1", {
        skipValidation: true,
      }),
      "e3",
      "b"
    );
    expect(attackers).toBe(["h3"]);
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
    expect(attackers).toBe(["c6", "b7", "a8"]);
  });
  test("Many rooks attacking through queen", () => {
    const attackers = getXrayAttackers(
      new Chess("3r4/3r4/3r4/3q4/8/8/8/8 w - - 0 1", {
        skipValidation: true,
      }),
      "d1",
      "b"
    );
    expect(attackers).toBe(["d6", "d7", "d8"]);
  });
  test("Many rooks attacking through opponent's rook", () => {
    const attackers = getXrayAttackers(
      new Chess("3r4/3r4/3r4/3q4/3R4/8/8/8 w - - 0 1", {
        skipValidation: true,
      }),
      "d1",
      "b"
    );
    expect(attackers).toBe(["d5", "d6", "d7", "d8"]);
  });
  test("Rooks attacking through opponent's rook (2 Opponent's rook in between)", () => {
    const attackers = getXrayAttackers(
      new Chess("3r4/3r4/3r4/3q4/3R4/3R4/8/8 w - - 0 1", {
        skipValidation: true,
      }),
      "d1",
      "b"
    );
    expect(attackers).toBe([]);
  });
});

describe("Not Xray Attack", () => {
  test("Starting position", () => {
    const attackers = getXrayAttackers(
      new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1", { skipValidation: true }),
      "f5",
      "b"
    );
    expect(attackers).toBe([]);
  });
  test("Attacking through Opponent's Pawn", () => {
    const attackers = getXrayAttackers(
      new Chess("r1bqkbnr/ppp2ppp/2n5/3pp3/2Q1P3/1B6/PPPP1PPP/RNB1K1NR w KQkq - 0 1", { skipValidation: true }),
      "f7",
      "w"
    );
    expect(attackers).toBe([]);
  });
  test("Attacking through Own Pawn", () => {
    const attackers = getXrayAttackers(
      new Chess("r1bqkbnr/ppp2ppp/2n5/3Pp3/2Q5/1B6/PPPP1PPP/RNB1K1NR b KQkq - 0 1", { skipValidation: true }),
      "f7",
      "w"
    );
    expect(attackers).toBe([]);
  });
});
