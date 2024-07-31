import { Chess, Move } from "chess.js";
import { getOpeningName, openingDatabase } from "../api/opening";
import { MT } from "../components/moveTypes";
import { evaluationType, StockfishOutput } from "./stockfish";

export interface openingType {
  name: string;
  winRate?: { white: number; black: number; draws: number };
}

export interface analysisType extends StockfishOutput {
  moveType: MT;
  accuracy: number;
  opening?: openingType;
  fenLines: string[];
}

export function convertToSAN(SF: StockfishOutput, fen: string) {
  var { bestMove, lines } = SF;
  const chess = new Chess(fen);
  const fenLines: string[] = [];
  try {
    chess.move(SF.bestMove);
    bestMove = chess.history()[0];
    lines = [];

    SF.lines.forEach((move) => {
      chess.move(move);
      fenLines.push(chess.fen());
      const history = chess.history();
      lines.push(history[history.length - 1]);
    });
  } catch (error) {
    console.log(`Couldn't phrase moves ${error}`);
  }

  return { ...SF, fenLines, lines, bestMove };
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
  var lichessResponse: openingType | undefined;
  var inBook = false;
  var opName;

  const SFanalysis = convertToSAN(
    stockfishAnalysis,
    moveIndex === 0 ? positionDetails.before : positionDetails.after
  );
  if (moveIndex) {
    if (moveIndex < 20) {
      opName = getOpeningName(positionDetails.after);
      inBook = opName !== undefined;
      try {
        const openingData = await openingDatabase(
          positionDetails.after,
          "lichess"
        );
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
    }
  }

  var moveType: MT;
  var accuracy: number;
  const crrEval = stockfishAnalysis.eval;

  if (inBook) {
    moveType = "book";
    accuracy = 100;
    if (!lichessResponse) {
      if (opName) {
        lichessResponse = { name: opName.name };
      }
    }
  } else if (SFanalysis.bestMove.trim() === positionDetails.san.trim()) {
    moveType = "best";
    accuracy = 100;
  } else if (prevEval.type === "cp" && crrEval.type === "mate") {
    moveType = "blunder";
    accuracy = 0;
  } else if (prevEval.type === "mate" && crrEval.type === "mate") {
    moveType = "best";
    accuracy = 100;
  } else if (prevEval.type === "cp" && crrEval.type === "cp") {
    moveType = "excellent";
    accuracy = 80;
  } else if (prevEval.type === "mate" && crrEval.type === "cp") {
    moveType = "brilliant";
    accuracy = 100;
  } else {
    moveType = "great";
    accuracy = 100;
  }

  return {
    ...SFanalysis,
    accuracy,
    moveType,
    opening: lichessResponse,
  };
}
