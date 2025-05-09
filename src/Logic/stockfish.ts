import { getStockfishAPI, postChessApi } from "../api/stockfishAPI";

export interface evaluationType {
  type: string;
  value: number;
}
export interface StockfishOutput {
  bestMove: string;
  eval: evaluationType;
  lines: string[];
}
const EmptyValue: StockfishOutput = {
  bestMove: "",
  eval: { type: "cp", value: 0 },
  lines: [],
};

class StockfishManager {
  private stockfish: Worker | null = null;
  private output: StockfishOutput = { ...EmptyValue };
  private resolveCallback: ((output: StockfishOutput) => void) | null = null;
  private blackToMove = false;

  constructor() {
    this.initializeStockfish();
  }

  private initializeStockfish() {
    const wasmSupported =
      typeof WebAssembly === "object" &&
      WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
    this.stockfish = new Worker(wasmSupported ? "stockfish.wasm.js" : "stockfish.js");

    this.stockfish.addEventListener("message", (e) => {
      const data = e.data;
      if (typeof data === "string") {
        if (data.includes("bestmove")) {
          const bestMove = data.split(" ")[1];
          this.output.bestMove = bestMove;
          if (this.resolveCallback) {
            this.resolveCallback(this.output);
            this.resolveCallback = null;
          }
        } else if (data.includes("info depth")) {
          const parts = data.split(" ");
          const evalIndex = parts.indexOf("score") + 2;
          const evalType = parts[evalIndex - 1];
          let evalValue: number = parseInt(parts[evalIndex]);
          const pvIndex = parts.indexOf("pv") + 1;
          const lines = parts.slice(pvIndex);
          evalValue = this.blackToMove ? evalValue * -1 : evalValue;
          this.output.eval = { type: evalType, value: evalValue };
          this.output.lines = lines;
        }
      }
    });

    this.stockfish.postMessage("uci");
  }

  sendCommand(command: string) {
    if (this.stockfish) {
      this.stockfish.postMessage(command);
    }
  }

  getOutput(): StockfishOutput {
    return this.output;
  }

  terminate() {
    if (this.stockfish) {
      this.stockfish.terminate();
      this.stockfish = null;
    }
  }

  async analyzePosition(fen: string, depth: number): Promise<StockfishOutput> {
    if (depth < 19) {
      try {
        const response = await postChessApi(fen);
        return response;
      } catch (error) {
        console.log("postChessApi failed", error);
      }
    }
    if (depth < 16) {
      console.log("using stockfish API");
      try {
        const response = await getStockfishAPI(fen);
        return response;
      } catch (error) {
        console.log("stockfishAPI failed", error);
      }
    }

    console.log("Using Local Stockfish");
    this.blackToMove = fen.includes(" b ");
    return new Promise((resolve) => {
      this.resolveCallback = resolve;
      this.output = { ...EmptyValue };
      this.sendCommand(`position fen ${fen}`);
      this.sendCommand(`go depth ${depth}`);
    });
  }
}

export default StockfishManager;
