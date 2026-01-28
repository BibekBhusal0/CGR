import { getStockfishAPI, postChessApi } from "@/api/stockfishAPI";
import { availableStockfish, useSettingsState } from "./state/settings";
import { isMultiThreadSupported } from "@/utils/sf";

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

const enginePath: Record<availableStockfish, { multi: string; single: string }> = {
  "stockfish-17": {
    multi: "engines/stockfish-17/stockfish-17.js",
    single: "engines/stockfish-17/stockfish-17-single.js",
  },
  "stockfish-17-lite": {
    multi: "engines/stockfish-17/stockfish-17-light.js",
    single: "engines/stockfish-17/stockfish-17-light-single.js",
  },
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
    const stockfish = useSettingsState.getState().stockfish;
    const multi = isMultiThreadSupported();
    const stockfish_path = multi ? enginePath[stockfish].multi : enginePath[stockfish].single;
    this.stockfish = new Worker("CGR/" + stockfish_path);

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

  async analyzePosition(
    fen: string,
    depth: number,
    local: boolean = true
  ): Promise<StockfishOutput> {
    if (!local) {
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
