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
      stockfishAnalysis: {
        bestMove: "Nxe5",
        eval: { type: "cp", value: 50 },
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
      },
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
      prevAnalysis: {
        bestMove: "dxe5",
        lines: [
          "dxe5",
          "Nxe5",
          "Qg3",
          "Nh5",
          "Qe3",
          "d4",
          "Qxd4",
          "Qxd4",
          "cxd4",
          "Nxf4",
          "Nxf4",
          "Nxd3",
          "Nxd3",
          "Rc4",
          "Ne5",
          "Bxe5",
          "dxe5",
          "Rf4",
          "Rd2",
        ],
        eval: { type: "cp", value: 61 },
        secondBest: {
          lines: [
            "f4e5",
            "d6e5",
            "d4e5",
            "c6e5",
            "f3f4",
            "h8e8",
            "d3c2",
            "c8c7",
            "f4d4",
            "b6d4",
            "e2d4",
            "e5c4",
            "b1c1",
            "g7g6",
            "c2a4",
          ],
          eval: { type: "cp", value: 23 },
        },
        fenLines: [
          "1kr4r/1p3ppp/pqnb1n2/3pP3/5B2/2PB1Q1P/PP2NPP1/1K1R3R b - - 0 16",
          "1kr4r/1p3ppp/pq1b1n2/3pn3/5B2/2PB1Q1P/PP2NPP1/1K1R3R w - - 0 17",
          "1kr4r/1p3ppp/pq1b1n2/3pn3/5B2/2PB2QP/PP2NPP1/1K1R3R b - - 1 17",
          "1kr4r/1p3ppp/pq1b4/3pn2n/5B2/2PB2QP/PP2NPP1/1K1R3R w - - 2 18",
          "1kr4r/1p3ppp/pq1b4/3pn2n/5B2/2PBQ2P/PP2NPP1/1K1R3R b - - 3 18",
          "1kr4r/1p3ppp/pq1b4/4n2n/3p1B2/2PBQ2P/PP2NPP1/1K1R3R w - - 0 19",
          "1kr4r/1p3ppp/pq1b4/4n2n/3Q1B2/2PB3P/PP2NPP1/1K1R3R b - - 0 19",
          "1kr4r/1p3ppp/p2b4/4n2n/3q1B2/2PB3P/PP2NPP1/1K1R3R w - - 0 20",
          "1kr4r/1p3ppp/p2b4/4n2n/3P1B2/3B3P/PP2NPP1/1K1R3R b - - 0 20",
          "1kr4r/1p3ppp/p2b4/4n3/3P1n2/3B3P/PP2NPP1/1K1R3R w - - 0 21",
          "1kr4r/1p3ppp/p2b4/4n3/3P1N2/3B3P/PP3PP1/1K1R3R b - - 0 21",
          "1kr4r/1p3ppp/p2b4/8/3P1N2/3n3P/PP3PP1/1K1R3R w - - 0 22",
          "1kr4r/1p3ppp/p2b4/8/3P4/3N3P/PP3PP1/1K1R3R b - - 0 22",
          "1k5r/1p3ppp/p2b4/8/2rP4/3N3P/PP3PP1/1K1R3R w - - 1 23",
          "1k5r/1p3ppp/p2b4/4N3/2rP4/7P/PP3PP1/1K1R3R b - - 2 23",
          "1k5r/1p3ppp/p7/4b3/2rP4/7P/PP3PP1/1K1R3R w - - 0 24",
          "1k5r/1p3ppp/p7/4P3/2r5/7P/PP3PP1/1K1R3R b - - 0 24",
          "1k5r/1p3ppp/p7/4P3/5r2/7P/PP3PP1/1K1R3R w - - 1 25",
          "1k5r/1p3ppp/p7/4P3/5r2/7P/PP1R1PP1/1K5R b - - 2 25",
        ],
        accuracy: 40,
        moveType: "inaccuracy",
        hangingPieces: { w: [], b: [] },
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

describe("Blunders From Other Games", () => { });
describe("Blunders from Lichess Puzzels", () => { });

describe("Brilliancies From My Games", () => { });
describe("Brilliancies From Other Games", () => { });
describe("Brilliancies from Lichess Puzzels", () => { });
