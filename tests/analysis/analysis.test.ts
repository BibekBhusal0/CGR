import { expect, test, describe } from "bun:test";
import { analyzeMove } from "../../src/Logic/analyze";
import { SerializableMove } from "../../src/app/right_panel/perMoveAnalysis";
import { Move } from "chess.js";

export function toMove(data: SerializableMove): Move {
  return {
    ...data,
    isBigPawn: () => data.isBigPawn,
    isCapture: () => data.isCapture,
    isEnPassant: () => data.isEnPassant,
    isKingsideCastle: () => data.isKingsideCastle,
    isPromotion: () => data.isPromotion,
    isQueensideCastle: () => data.isQueensideCastle,
  } as Move;
}

describe("Blunders From My Games", () => {
  test("case:1 hung a knight", async () => {
    const result = await analyzeMove({
      positionDetails: toMove({
        color: "b",
        from: "d6",
        to: "a3",
        piece: "b",
        flags: "n",
        san: "Ba3",
        lan: "d6a3",
        before: "1kr4r/1p3ppp/pqnb1n2/3pP3/5B2/2PB1Q1P/PP2NPP1/1K1R3R b - - 0 16",
        after: "1kr4r/1p3ppp/pqn2n2/3pP3/5B2/b1PB1Q1P/PP2NPP1/1K1R3R w - - 1 17",
        isBigPawn: false,
        isCapture: false,
        isEnPassant: false,
        isKingsideCastle: false,
        isPromotion: false,
        isQueensideCastle: false,
      }),
      stockfishAnalysis: {
        bestMove: "exf6+",
        eval: {
          type: "cp",
          value: 436,
        },
        lines: ["exf6+", "Ka8", "Rd2", "g5", "Bg3", "d4", "Be4"],
        secondBest: {
          lines: [
            "d1d2",
            "f6e4",
            "d3e4",
            "d5e4",
            "f3e4",
            "c6a5",
            "b1a1",
            "a5c4",
            "b2a3",
            "c4d2",
            "f4d2",
            "b6f2",
            "h1b1",
          ],
          eval: {
            type: "cp",
            value: 301,
          },
        },
      },
      prevAnalysis: {
        bestMove: "Nxe5",
        lines: [
          "Nxe5",
          "Qg3",
          "Rhe8",
          "Be3",
          "Nxd3",
          "Bxb6",
          "Bxg3",
          "Nxg3",
          "Nc5",
          "Nf5",
          "Re6",
          "Bxc5",
          "Rxc5",
          "Nxg7",
          "Re2",
        ],
        eval: { type: "cp", value: 50 },
        secondBest: {
          lines: [
            "d6e5",
            "f4e3",
            "b6c7",
            "g2g4",
            "h7h6",
            "h3h4",
            "c8d8",
            "d3c2",
            "h6h5",
            "g4g5",
            "f6g4",
            "d1d5",
            "d8d5",
            "f3d5",
          ],
          eval: { type: "cp", value: 116 },
        },
        fenLines: [
          "1kr4r/1p3ppp/pq1b1n2/3pn3/5B2/2PB1Q1P/PP2NPP1/1K1R3R w - - 0 17",
          "1kr4r/1p3ppp/pq1b1n2/3pn3/5B2/2PB2QP/PP2NPP1/1K1R3R b - - 1 17",
          "1kr1r3/1p3ppp/pq1b1n2/3pn3/5B2/2PB2QP/PP2NPP1/1K1R3R w - - 2 18",
          "1kr1r3/1p3ppp/pq1b1n2/3pn3/8/2PBB1QP/PP2NPP1/1K1R3R b - - 3 18",
          "1kr1r3/1p3ppp/pq1b1n2/3p4/8/2PnB1QP/PP2NPP1/1K1R3R w - - 0 19",
          "1kr1r3/1p3ppp/pB1b1n2/3p4/8/2Pn2QP/PP2NPP1/1K1R3R b - - 0 19",
          "1kr1r3/1p3ppp/pB3n2/3p4/8/2Pn2bP/PP2NPP1/1K1R3R w - - 0 20",
          "1kr1r3/1p3ppp/pB3n2/3p4/8/2Pn2NP/PP3PP1/1K1R3R b - - 0 20",
          "1kr1r3/1p3ppp/pB3n2/2np4/8/2P3NP/PP3PP1/1K1R3R w - - 1 21",
          "1kr1r3/1p3ppp/pB3n2/2np1N2/8/2P4P/PP3PP1/1K1R3R b - - 2 21",
          "1kr5/1p3ppp/pB2rn2/2np1N2/8/2P4P/PP3PP1/1K1R3R w - - 3 22",
          "1kr5/1p3ppp/p3rn2/2Bp1N2/8/2P4P/PP3PP1/1K1R3R b - - 0 22",
          "1k6/1p3ppp/p3rn2/2rp1N2/8/2P4P/PP3PP1/1K1R3R w - - 0 23",
          "1k6/1p3pNp/p3rn2/2rp4/8/2P4P/PP3PP1/1K1R3R b - - 0 23",
          "1k6/1p3pNp/p4n2/2rp4/8/2P4P/PP2rPP1/1K1R3R w - - 1 24",
        ],
        accuracy: 100,
        moveType: "best",
        hangingPieces: { b: [], w: ["e5"] },
        pinnedPieces: {},
      },
      moveIndex: 31,
    });
    expect(result).toBeObject();
    expect(result.moveType).toBe("blunder");
  });
  test("case:2 hung a queen", async () => {
    const result = await analyzeMove({
      stockfishAnalysis: {
        bestMove: "Nxf7",
        eval: { type: "cp", value: -589 },
        lines: ["Nxf7", "Rg3", "Qd8", "Re3", "Rxe3", "fxe3", "Nd6", "Ka1"],
        secondBest: {
          lines: ["e8e2", "d4e2", "d6f7", "e2f4", "b6f6", "f4d5", "f6g6", "h1e1", "a8a7", "d5f4"],
          eval: { type: "cp", value: -460 },
        },
      },
      positionDetails: toMove({
        color: "w",
        from: "f4",
        to: "f7",
        piece: "q",
        captured: "p",
        flags: "c",
        san: "Qxf7",
        lan: "f4f7",
        before: "k1r1r3/1p3ppp/pq1n4/3p4/3N1Q2/2PR3P/PP3PP1/1K5R w - - 0 24",
        after: "k1r1r3/1p3Qpp/pq1n4/3p4/3N4/2PR3P/PP3PP1/1K5R b - - 0 24",
        isBigPawn: false,
        isCapture: true,
        isEnPassant: false,
        isKingsideCastle: false,
        isPromotion: false,
        isQueensideCastle: false,
      }),
      prevAnalysis: {
        bestMove: "Rc1",
        lines: ["Rc1", "h6", "Rdd1", "Re4", "Qg3", "g6", "f3", "Ree8", "Qf2"],
        eval: { type: "cp", value: 18 },
        secondBest: {
          lines: ["h1d1", "f7f6", "f4c1", "e8e7", "d3e3", "e7e4", "d1e1"],
          eval: { type: "cp", value: 15 },
        },
        fenLines: [
          "k1r1r3/1p3ppp/pq1n4/3p4/3N1Q2/2PR3P/PP3PP1/1KR5 b - - 1 24",
          "k1r1r3/1p3pp1/pq1n3p/3p4/3N1Q2/2PR3P/PP3PP1/1KR5 w - - 0 25",
          "k1r1r3/1p3pp1/pq1n3p/3p4/3N1Q2/2P4P/PP3PP1/1KRR4 b - - 1 25",
          "k1r5/1p3pp1/pq1n3p/3p4/3NrQ2/2P4P/PP3PP1/1KRR4 w - - 2 26",
          "k1r5/1p3pp1/pq1n3p/3p4/3Nr3/2P3QP/PP3PP1/1KRR4 b - - 3 26",
          "k1r5/1p3p2/pq1n2pp/3p4/3Nr3/2P3QP/PP3PP1/1KRR4 w - - 0 27",
          "k1r5/1p3p2/pq1n2pp/3p4/3Nr3/2P2PQP/PP4P1/1KRR4 b - - 0 27",
          "k1r1r3/1p3p2/pq1n2pp/3p4/3N4/2P2PQP/PP4P1/1KRR4 w - - 1 28",
          "k1r1r3/1p3p2/pq1n2pp/3p4/3N4/2P2P1P/PP3QP1/1KRR4 b - - 2 28",
        ],
        accuracy: 100,
        moveType: "best",
        hangingPieces: { w: [], b: [] },
        pinnedPieces: {},
      },
      moveIndex: 46,
    });
    expect(result).toBeObject();
    expect(result.moveType).toBe("blunder");
  });
});

describe("Blunders From Other Games", () => {});
describe("Blunders from Lichess Puzzels", () => {});

describe("Brilliancies From My Games", () => {});
describe("Brilliancies From Other Games", () => {});
describe("Brilliancies from Lichess Puzzels", () => {});
