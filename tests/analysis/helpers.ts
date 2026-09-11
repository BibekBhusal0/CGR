import { expect } from "bun:test";
import { analyzeMove, moveAcc } from "@/Logic/analyze";
import type { analysisType } from "@/Logic/analyze";
import type { StockfishOutput } from "@/Logic/stockfish";
import type { MT } from "@/components/moveTypes/types";
import { Color, Move, Square } from "chess.js";

export interface CaseMove {
  color: "w" | "b";
  san: string;
  before: string;
  after: string;
  from: string;
  to: string;
  piece: string;
  flags: string;
  lan: string;
  isBigPawn: boolean;
  isCapture: boolean;
  isEnPassant: boolean;
  isKingsideCastle: boolean;
  isPromotion: boolean;
  isQueensideCastle: boolean;
}

export function toMove(data: CaseMove): Move {
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

export interface CasePrev {
  eval: { type: string; value: number };
  bestMove: string;
  secondBest?: { lines: string[]; eval: { type: string; value: number } };
  hangingPieces: Record<Color, Square[]>;
}

export function toPrev(data: CasePrev): analysisType {
  return { ...data, lines: [], fenLines: [], accuracy: 0, moveType: "best" as MT };
}

export interface GameMove {
  analyzerMoveType: MT;
  expectedMoveType: MT;
  expectedComment: string | null;
  moveIndex: number;
  position: CaseMove;
  stockfish: StockfishOutput;
  prev: CasePrev;
}

export async function check(move: GameMove) {
  const result = await analyzeMove({
    stockfishAnalysis: move.stockfish,
    positionDetails: toMove(move.position),
    prevAnalysis: toPrev(move.prev),
    moveIndex: move.moveIndex,
    fetchOpening: false,
  });
  expect(result.moveType).toBe(move.expectedMoveType);
  expect(result.accuracy).toBe(moveAcc[move.expectedMoveType]);
  expect(result.moveComment ?? null).toBe(move.expectedComment);
}
