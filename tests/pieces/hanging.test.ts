import { expect, test, describe } from "bun:test";
import { isPieceHanging } from "../../src/Logic/pieces";

describe("Simple captures (No defenders)", () => {
  test("1", () => {
    const result = isPieceHanging("1kbR2Q1/p7/1p5K/5p2/P5q1/6P1/5r1P/4R3 b - - 0 1", "h2");
    expect(result).toBe(true);
  });
  test("2", () => {
    const result = isPieceHanging("2r1r1k1/1R3p1n/R1p5/3p4/3P1Q2/1PP3Pq/1P3P2/6K1 w - - 0 1", "f7");
    expect(result).toBe(true);
  });
  test("3", () => {
    const result = isPieceHanging("3r3r/b1k2ppp/2pq1n2/8/2BQ4/7P/1PPnNPP1/5RK1 w - - 0 1", "a7");
    expect(result).toBe(true);
  });
  test("4", () => {
    const result = isPieceHanging(
      "r4rk1/pp1b1pbp/4q1p1/2B5/2Q5/P3PB1P/1PP2PP1/R4RK1 w - - 0 1",
      "c4"
    );
    expect(result).toBe(true);
  });
});

describe("Simple defended (More defenders)", () => {
  test("1", () => {
    const result = isPieceHanging("3r3r/b1k2ppp/2pq1n2/8/2BQ4/7P/1PPnNPP1/5RK1 w - - 0 1", "d6");
    expect(result).toBe(false);
  });
  test("2", () => {
    const result = isPieceHanging("1k5r/ppp5/8/3nQp2/4pP1q/1P1pn2P/P2R2P1/2R3K1 b - - 0 1", "d5");
    expect(result).toBe(false);
  });
  test("3", () => {
    const result = isPieceHanging("1k5r/ppp5/8/3nQp2/4pP1q/1P1pn2P/P2R2P1/2R3K1 b - - 0 1", "c7");
    expect(result).toBe(false);
  });
  test("4", () => {
    const result = isPieceHanging("1r3k1r/5ppp/8/pp6/2b4Q/2Pq4/P5PP/4RRK1 w - - 0 1", "c4");
    expect(result).toBe(false);
  });
  test("5", () => {
    const result = isPieceHanging("1r3k1r/5ppp/8/pp6/2b4Q/2Pq4/P5PP/4RRK1 w - - 0 1", "f7");
    expect(result).toBe(false);
  });
  test("5", () => {
    const result = isPieceHanging("r5k1/5ppp/2q1pb2/1bPp4/3P4/4B3/1Q2NPPP/4R1K1 b - - 0 1", "d4");
    expect(result).toBe(false);
  });
  test("6", () => {
    const result = isPieceHanging(
      "3r1rk1/1b2qpbp/6p1/1N6/Ppp5/4PB1P/3Q1PP1/2RR2K1 w - - 0 1",
      "d8"
    );
    expect(result).toBe(false);
  });
});

describe("Equal exchange", () => {
  test("1", () => {
    const result = isPieceHanging("6rr/p4p2/1ppbpk2/8/2PPpP2/2P3P1/P5K1/1R5R w - - 0 1", "h8");
    expect(result).toBe(false);
  });
  test("2", () => {
    const result = isPieceHanging(
      "r3kb1r/pppbpp1p/6p1/1B2n2n/8/5N1P/PPP2PP1/RNBKR3 w kq - 0 1",
      "d7"
    );
    expect(result).toBe(false);
  });
});

describe("Getting Material Advantate", () => {
  test("1", () => {
    const result = isPieceHanging(
      "r4rk1/pp1b1pbp/4q1p1/2B5/2Q5/P3PB1P/1PP2PP1/R4RK1 w - - 0 1",
      "f8"
    );
    expect(result).toBe(true);
  });
  test("2", () => {
    const result = isPieceHanging("2kr4/1pp5/p3N3/4p3/2P3p1/PnP1P1Pp/1P5P/5RK1 w - - 0 1", "d8");
    expect(result).toBe(true);
  });
  test("3", () => {
    const result = isPieceHanging(
      "5rk1/2r1q1p1/1p3p1p/1B1pP3/P1pPb1Q1/2R1P3/P5PP/2R3K1 w - - 0 1",
      "e5"
    );
    expect(result).toBe(true);
  });
  test("4", () => {
    const result = isPieceHanging("8/4R1b1/1P3rp1/7k/3p2NP/8/4p1K1/8 w - - 0 1", "f6");
    expect(result).toBe(true);
  });
});

describe("Losing material", () => {
  test("1", () => {
    const result = isPieceHanging(
      "5rk1/2r1q1p1/1p3p1p/1B1pP3/P1pPb1Q1/2R1P3/P5PP/2R3K1 w - - 0 1",
      "c4"
    );
    expect(result).toBe(false);
  });
  test("2", () => {
    const result = isPieceHanging("5rk1/5p1p/4p1p1/R3Q2n/4P3/3q1N1P/1r3PP1/5RK1 w - - 0 1", "h5");
    expect(result).toBe(false);
  });
  test("3", () => {
    const result = isPieceHanging(
      "r2qkb1r/1pp2ppp/p1np1n2/4p2N/2P3b1/4PQ2/PP1PBPPP/RNB1K2R b KQkq - 1 1",
      "g4"
    );
    expect(result).toBe(false);
  });
});

describe("Complex (X-ray/pins)", () => {
  test("1", () => {
    const result = isPieceHanging(
      "1br2rk1/pp2np1p/2n1pBp1/3p4/3P1q1Q/2PB1N1P/PP3PP1/R4RK1 w - - 0 1",
      "e7"
    );
    expect(result).toBe(true);
  });
  test("2", () => {
    const result = isPieceHanging("6rr/p4p2/1ppbpk2/8/2PPpP2/2P3P1/P5K1/1R5R w - - 0 1", "f4");
    expect(result).toBe(true);
  });
  test("3", () => {
    const result = isPieceHanging(
      "5rk1/2r1q1p1/1p3p1p/1B1pP3/P1pPb1Q1/2R1P3/P5PP/2R3K1 w - - 0 1",
      "f6"
    );
    expect(result).toBe(false);
  });
  test("4 (X-ray defender through pinned piece)", () => {
    const result = isPieceHanging("r5k1/5ppp/2q1pb2/1bPp4/3P4/4B3/1Q2NPPP/4R1K1 b - - 0 1", "c5");
    expect(result).toBe(true);
  });
  test("5 (Complex pin - pawn pinned to hanging rook)", () => {
    const result = isPieceHanging(
      "r3r2k/pp5p/2pb2p1/P2p2R1/1P1NqP2/2P1P3/3Q2PP/4R1K1 b - - 0 1",
      "f4"
    );
    expect(result).toBe(true);
  });
  test("6 (X-ray defence through attacking piece)", () => {
    const result = isPieceHanging("r6k/p5p1/1pQ4p/3r4/1P6/P1q5/5PPP/R1R3K1 b - - 0 1", "c6");
    expect(result).toBe(false);
  });
  test("7 (Another x-ray)", () => {
    const result = isPieceHanging("1kr4r/1p3ppp/pq1b1n2/3p4/5B2/2Pn2QP/PP2NPP1/1K1R3R w - - 0 1", "d6");
    expect(result).toBe(true);
  });
});
