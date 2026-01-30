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
});
