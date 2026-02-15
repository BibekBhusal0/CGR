import { useSettingsState } from "@/Logic/state/settings";
import { Chess, Move, Square, DEFAULT_POSITION, Color } from "chess.js";
import { getOpeningName, openingDatabase } from "@/api/opening";
import { MT } from "@/components/moveTypes/types";
import { evaluationType, StockfishOutput } from "@/Logic/stockfish";
import StockfishManager from "@/Logic/stockfish";
import {
  allPinnedPiecesType,
  getAllHangingPieces,
  getOpp,
  pieceNames,
  getHighestValueHangingPiece,
  colorNames,
  pieceValues,
} from "@/Logic/pieces";

export interface openingType {
  name: string;
  winRate?: { white: number; black: number; draws: number };
}

export const moveAcc: Record<MT, number> = {
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

export type analysisType = StockfishOutput & {
  moveType: MT;
  accuracy: number;
  opening?: openingType;
  fenLines: string[];
  bestMoveComment?: string;
  moveComment?: string;
  pinnedPieces?: allPinnedPiecesType;
  hangingPieces?: Record<Color, Square[]>;
}

function capEval(e: evaluationType, cap: number = 50): number {
  if (e.type === "mate") return e.value > 0 ? cap : -cap;
  if (e.value > cap * 100) return cap;
  if (e.value < -cap * 100) return -cap;
  return e.value / 100;
}

export function convertToSAN(SF: StockfishOutput, fen: string) {
  let { bestMove } = SF;
  const chess = new Chess(fen);
  const fenLines: string[] = [];
  const lines = [];

  try {
    const bestMoveAtFirst = SF.lines[0] === bestMove;
    const moveOutput = chess.move(SF.bestMove);
    bestMove = moveOutput.san;

    if (!bestMoveAtFirst) {
      lines.push(bestMove);
      fenLines.push(moveOutput.after);
    } else chess.undo();

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
  positionDetails: Move;
  prevAnalysis?: analysisType;
  moveIndex?: number;
}

export async function analyzeMove({
  stockfishAnalysis,
  prevAnalysis,
  positionDetails,
  moveIndex,
}: analyzePropsType): Promise<analysisType> {
  let lichessResponse: openingType | undefined;
  const fen = positionDetails[moveIndex === -1 ? "before" : "after"];
  let inBook = false;
  let opName, moveComment, bestMoveComment;

  const SFanalysis = convertToSAN(stockfishAnalysis, fen);
  if (moveIndex && moveIndex < 20) {
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

  let moveType: MT;
  let accuracy: number = 100;
  const chess = new Chess(fen);
  const color = positionDetails.color;
  const isWhiteTurn = color === "w";

  const prevEval = prevAnalysis?.eval || { type: "cp", value: 0 };
  const crrEval = stockfishAnalysis.eval;
  const cappedEval = capEval(crrEval);
  const prevCappedEval = capEval(prevEval);

  // If best move had been found eval diff should be 0.
  const evalDiff = cappedEval - prevCappedEval;
  const gotAdvantage = isWhiteTurn ? evalDiff >= 0 : evalDiff <= 0;
  const opp = getOpp(color);
  const opponentsHangingPieces = fen === DEFAULT_POSITION ? [] : getAllHangingPieces(chess, opp);
  const hangingPieces = fen === DEFAULT_POSITION ? [] : getAllHangingPieces(chess, color);
  const prevHangingPieceOpps = prevAnalysis?.hangingPieces?.[opp];
  const prevHangingPiece = prevAnalysis?.hangingPieces?.[color];
  const allPinnedPieces = {};
  const colorName = colorNames[color];
  // const oppColorName = colorNames[opp];

  // Theory
  if (inBook) moveType = "book";
  // Only possible move forcing.
  else if (prevAnalysis?.secondBest?.lines?.length === 0) moveType = "forcing";
  // If it's best move by engine, it's either `Best` or `Great` or `Brilliant`
  else if (prevAnalysis?.bestMove === positionDetails.san) {
    const secondBestEval = SFanalysis.secondBest?.eval;
    if (secondBestEval) {
      const cappedSecondBestEval = capEval(secondBestEval);
      // since this is second best move eval can't be higher,
      // so we don't need to consider negitive value
      const onlyWinning = Math.abs(cappedSecondBestEval - cappedEval) > 6;
      if (onlyWinning) {
        const isUnderPromosion =
          positionDetails.isPromotion() && !SFanalysis.bestMove.endsWith("=Q");
        const isSacrifice = hangingPieces.length > 0;
        if (isSacrifice) {
          moveType = "brilliant";
          const sacrificedPiece = getHighestValueHangingPiece(chess, hangingPieces);
          if (sacrificedPiece) {
            moveComment = `${colorName} sacrificed ${pieceNames[sacrificedPiece]}`;
          }
        } else if (isUnderPromosion) moveType = "brilliant";
        // Great move should be only winning move or only not loosing move.
        else moveType = "great";
      } else moveType = "best";
    } else moveType = "best";
  }
  // Even though it's not best move by engine if it is still getting advantage
  // then it's `Good` or `Excellent`. (determined based on eval difference)
  else if (gotAdvantage) {
    if (evalDiff > 3) moveType = "excellent";
    else moveType = "good";
  } else {
    const absDiff = Math.abs(evalDiff);
    if (absDiff > 4) {
      // If check mate is not found it's miss.
      // If free piece is not taken it's miss.
      let isMiss = false;

      // Check if mate was missed
      if (prevAnalysis?.eval?.type === "mate") {
        const prevMateValue = prevAnalysis.eval.value;
        const hadMateForCurrentPlayer = isWhiteTurn ? prevMateValue > 0 : prevMateValue < 0;

        if (hadMateForCurrentPlayer) {
          isMiss = true;
          const mateIn = Math.abs(prevMateValue);
          moveComment = `${colorName} missed mate in ${mateIn}`;
        }
      }

      // Check if free piece was not taken
      if (!isMiss && !positionDetails.isCapture() && prevHangingPiece && prevHangingPieceOpps) {
        let ourHangingMaterial = 0;
        let theirHangingMaterial = 0;
        const theirBestHangingPiece = getHighestValueHangingPiece(chess, prevHangingPieceOpps);

        // Calculate our hanging material
        prevHangingPiece.forEach((square) => {
          const piece = chess.get(square);
          if (piece) ourHangingMaterial += pieceValues[piece.type];
        });

        // Calculate their hanging material
        prevHangingPieceOpps.forEach((square) => {
          const piece = chess.get(square);
          if (piece) theirHangingMaterial += pieceValues[piece.type];
        });

        if (theirHangingMaterial > ourHangingMaterial) isMiss = true;
        if (theirBestHangingPiece) {
          moveComment = `${colorName} did not take free ${pieceNames[theirBestHangingPiece]}`;
        }
      }

      // If Check Mate it allowed it's blunder.
      // If free piece is given it's blunder.
      moveType = isMiss ? "miss" : "blunder";

      if (!isMiss && hangingPieces) {
        const ourWorstHangingPiece = getHighestValueHangingPiece(chess, hangingPieces);

        if (ourWorstHangingPiece) {
          moveComment = `${colorName} left ${pieceNames[ourWorstHangingPiece]} hanging`;
        }
      }
    }
    // In other cases it's `inaccuracy` or `mistake` based on eval diff
    else if (absDiff > 2) moveType = "mistake";
    else if (absDiff < 0.5) moveType = "good";
    else moveType = "inaccuracy";
  }

  // @ts-expect-error both color are added shut up typescript
  const allHangingPieces: Record<Color, Square[]> = {
    [opp]: opponentsHangingPieces,
    [color]: hangingPieces,
  };

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
    hangingPieces: allHangingPieces,
    pinnedPieces: allPinnedPieces,
  };
}

export const analyzePosition = async (
  fen: string,
  moveIndex: number,
  move: Move,
  stockfish: StockfishManager,
  prevAnalysis?: analysisType
) => {
  const { depth } = useSettingsState.getState();
  const SFresult = await stockfish.analyzePosition(fen, depth);
  const analysis = await analyzeMove({
    stockfishAnalysis: SFresult,
    prevAnalysis,
    positionDetails: move,
    moveIndex,
  });
  return analysis;
};

export async function analyzeGame(Game: Chess, setProgress?: (progress: number) => void) {
  const stockfish = new StockfishManager();
  const history = Game.history({ verbose: true });
  let completed = 0;
  const analysisResult = [];
  let prevAnalysis: analysisType | undefined = undefined;

  const initialMove = await analyzePosition(
    history[0].before,
    -1,
    history[0],
    stockfish,
    prevAnalysis
  );
  analysisResult.push(initialMove);
  prevAnalysis = initialMove;

  for (let i = 0; i < history.length; i++) {
    const fen = history[i].after;

    const a = await analyzePosition(fen, i, history[i], stockfish, prevAnalysis);
    analysisResult.push(a);
    prevAnalysis = a;

    completed++;
    if (setProgress) {
      setProgress(completed / history.length);
    }
  }
  stockfish.terminate();
  return analysisResult;
}
