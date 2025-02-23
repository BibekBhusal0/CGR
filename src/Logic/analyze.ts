import { Chess, Move } from "chess.js";
import { getOpeningName, openingDatabase } from "../api/opening";
import { MT } from "../components/moveTypes";
import { evaluationType, StockfishOutput } from "./stockfish";

export interface openingType {
  name: string;
  winRate?: { white: number; black: number; draws: number };
}

export const moveAcc: { [key in MT]: number } = {
  blunder: 0,
  miss: 0,
  mistake: 20,
  inaccuracy: 40,
  good: 65,
  excellent: 90,
  best: 100,
  great: 100,
  brilliant: 100,
  book: 100,
  forcing: 100,
};

export interface analysisType extends StockfishOutput {
  moveType: MT;
  accuracy: number;
  opening?: openingType;
  fenLines: string[];
  bestMoveComment?: string;
  moveComment?: string;
}

export function convertToSAN(SF: StockfishOutput, fen: string) {
  var { bestMove, lines } = SF;
  const chess = new Chess(fen);
  const fenLines: string[] = [];

  try {
    const moveOutput = chess.move(reformatMove(SF.bestMove));
    bestMove = moveOutput.san;

    lines = [];
    lines.push(bestMove);
    fenLines.push(moveOutput.after);

    SF.lines.forEach((move) => {
      const moveOutput = chess.move(reformatMove(move));
      fenLines.push(moveOutput.after);
      lines.push(moveOutput.san);
    });
  } catch (error) {
    console.log(`Couldn't phrase moves ${error}`);
  }

  return { ...SF, fenLines, lines, bestMove };
}

function reformatMove(move: string) {
  const uciRegex = /^[a-h][1-8][a-h][1-8](?:[qrbn])?$/i;

  if (uciRegex.test(move)) {
    const from = move.slice(0, 2);
    const to = move.slice(2, 4);
    const promotion = move.length > 4 ? move[4] : undefined;

    return { from, to, promotion };
  }
  return move;
}

export interface analyzePropsType {
  stockfishAnalysis: StockfishOutput;
  prevEval: evaluationType;
  positionDetails: Move;
  moveIndex?: number;
}

export async function analyze({
  stockfishAnalysis,
  prevEval,
  positionDetails,
  moveIndex,
}: analyzePropsType): Promise<analysisType> {
  //
  var lichessResponse: openingType | undefined;
  const fen = positionDetails[moveIndex === -1 ? "before" : "after"];
  var inBook = false;
  var opName, moveComment, bestMoveComment;

  const SFanalysis = convertToSAN(stockfishAnalysis, fen);
  if (moveIndex) {
    if (moveIndex < 20) {
      opName = getOpeningName(fen);
      inBook = opName !== undefined;
      try {
        const openingData = await openingDatabase(fen, "lichess");
        const {
          opening: { name },
          black,
          white,
          draws,
        } = openingData;
        lichessResponse = { name, winRate: { black, draws, white } };
      } catch (error) {
        console.log(`Can't get opening data from lichess ${error}`);
      }
      if (!lichessResponse && opName) {
        lichessResponse = { name: opName.name };
      }
    }
  }

  var moveType: MT;
  var accuracy: number = 100;
  const chess = new Chess(fen);
  const legalMoves = chess.moves();
  const isWhiteTurn = chess.turn() === "w";

  const crrEval = stockfishAnalysis.eval;
  const evalDifference = crrEval.value - prevEval.value;
  const effectiveEvalDiff = isWhiteTurn ? evalDifference : -evalDifference;
  const absEvaluation = stockfishAnalysis.eval.value * (isWhiteTurn ? 1 : -1);
  const absPrevEvaluation = prevEval.value * (isWhiteTurn ? -1 : 1);

  if (inBook) {
    moveType = "book";
  } else if (legalMoves.length === 1) {
    // only possible move
    moveType = "forcing";
  } else if (SFanalysis.bestMove.trim() === positionDetails.san.trim()) {
    // best move according to engine
    moveType = "best";
  } else if (prevEval.type === "cp" && crrEval.type === "mate") {
    //  mate in evaluation when previous evaluation don't have mate
    if (absEvaluation > 0) {
      //  opponent getting mated
      moveType = "best";
    } else if (absEvaluation >= -3) {
      moveType = "blunder";
    } else if (absEvaluation >= -7) {
      moveType = "mistake";
    } else moveType = "inaccuracy";
  } else if (prevEval.type === "mate" && crrEval.type === "mate") {
    if (absPrevEvaluation > 0) {
      if (absEvaluation <= -4) {
        moveType = "mistake";
      } else if (absEvaluation < 0) {
        moveType = "blunder";
      } else if (absEvaluation < absPrevEvaluation) {
        moveType = "best";
      } else if (absEvaluation <= absPrevEvaluation + 2) {
        moveType = "excellent";
      } else {
        moveType = "good";
      }
    } else {
      if (absEvaluation === absPrevEvaluation) {
        moveType = "best";
      } else {
        moveType = "good";
      }
    }
  } else if (prevEval.type === "cp" && crrEval.type === "cp") {
    if (effectiveEvalDiff > 0) {
      accuracy = Math.min(100, 100 - Math.abs(effectiveEvalDiff) / 10);
    } else {
      accuracy = Math.max(0, 100 - Math.abs(effectiveEvalDiff) / 5);
    }
    if (accuracy > 95) {
      moveType = "best";
    } else if (accuracy > 85) {
      moveType = "excellent";
    } else if (accuracy > 70) {
      moveType = "good";
    } else if (accuracy > 50) {
      moveType = "inaccuracy";
    } else if (accuracy > 30) {
      moveType = "mistake";
    } else {
      moveType = "blunder";
    }
  } else if (prevEval.type === "mate" && crrEval.type === "cp") {
    // mate in previous move no mate now (escaped the mate)
    if (absPrevEvaluation < 0 && absEvaluation < 0) {
      moveType = "best";
    } else if (absEvaluation >= 400) {
      moveType = "good";
    } else if (absEvaluation >= 150) {
      moveType = "inaccuracy";
    } else if (absEvaluation >= -100) {
      moveType = "mistake";
    } else {
      moveType = "blunder";
    }
  } else moveType = "great";

  if (accuracy === 100) {
    accuracy = moveAcc[moveType];
  }

  return {
    ...SFanalysis,
    accuracy,
    moveType,
    opening: lichessResponse,
    moveComment,
    bestMoveComment,
  };
}
