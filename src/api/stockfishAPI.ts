import { StockfishOutput } from "../Logic/stockfish";

export interface ChessApiResponse {
  text: string;
  eval: number;
  move: string;
  fen: string;
  depth: number;
  winChance: number;
  continuationArr: string[];
  mate: number;
  centipawns: string;

  san: string;
  lan: string;
  turn: "w" | "b";
  color: "w" | "b";
  piece: string;
  flags: string;
  isCapture: boolean;
  isCastling: boolean;
  isPromotion: boolean;

  from: string;
  to: string;
  fromNumeric: string;
  toNumeric: string;

  taskId: string;
  time: number;
  type: string;
}
export interface StockfishAPIResponse {
  success: boolean;
  evaluation: number;
  mate: number;
  // "bestmove":"bestmove b7b6 ponder f3e5",
  // "continuation":"b7b6 f3e5 h7h6 g5f6 f8f6 d2f3"}
  bestmove: string;
  continuation: string;
}

export async function postChessApi(fen: string): Promise<StockfishOutput> {
  const response = await fetch("https://chess-api.com/v1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fen: fen, depth: 18 }),
  });

  if (!response.ok) {
    throw new Error(`Http Error from chess api ${response.status}`);
  }

  const data: ChessApiResponse = await response.json();
  if (data.type === "error") {
    throw new Error(`Chess Api Error`);
  }
  const mate = data.mate !== null;
  const e = mate ? data.mate : data.eval * 100;

  const out: StockfishOutput = {
    bestMove: data.san,
    eval: {
      type: mate ? "mate" : "cp",
      value: e,
    },
    lines: data.continuationArr,
  };
  return out;
}

export async function getStockfishAPI(fen: string): Promise<StockfishOutput> {
  const BaseURL = "https://stockfish.online/api/s/v2.php?";
  const URL = `${BaseURL}fen=${fen}&depth=15`;
  const response = await fetch(URL);
  if (!response.ok) {
    throw new Error(`Http Error from stockfish online api ${response.status}`);
  }
  const data: StockfishAPIResponse = await response.json();
  if (!data.success) {
    throw new Error(`Stockfish api failed ${data}`);
  }
  const mate = data.mate !== null;
  const e = mate ? data.mate : data.evaluation * 100;
  // if (fen.includes(" b ")) {
  //   e *= 1;
  // }

  const out: StockfishOutput = {
    bestMove: data.bestmove.split(" ")[1],
    eval: {
      type: mate ? "mate" : "cp",
      value: e,
    },
    lines: data.continuation.split(" "),
  };

  return out;
}
