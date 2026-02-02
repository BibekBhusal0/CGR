import { DEFAULT_POSITION } from "chess.js";
import { availableStockfish, useSettingsState } from "./state/settings";
import { isMultiThreadSupported } from "@/utils/sf";

export interface evaluationType {
  type: string;
  value: number;
}
export interface stockfishPvOutput {
  lines: string[];
  eval: evaluationType;
}
export interface StockfishOutput extends stockfishPvOutput {
  bestMove: string;
  eval: evaluationType;
  lines: string[];
  secondBest?: stockfishPvOutput;
}
const initialPvVal: stockfishPvOutput = { lines: [], eval: { type: "cp", value: 0 } };
const EmptyValue: StockfishOutput = {
  bestMove: "",
  ...initialPvVal,
  secondBest: { ...initialPvVal },
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
          const idIndex = parts.indexOf("multipv") + 1;
          const index = parts[idIndex];
          let evalValue: number = parseInt(parts[evalIndex]);
          const pvIndex = parts.indexOf("pv") + 1;
          const lines = parts.slice(pvIndex);
          evalValue = this.blackToMove ? evalValue * -1 : evalValue;
          const pvOutput: stockfishPvOutput = {
            lines,
            eval: { type: evalType, value: evalValue },
          };

          if (index === "2") this.output.secondBest = pvOutput;
          else this.output = { ...this.output, ...pvOutput };
        }
      }
    });

    this.sendCommand("uci");
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
    this.blackToMove = fen.includes(" b ");
    return new Promise((resolve) => {
      if (fen === DEFAULT_POSITION) {
        this.output = {
          bestMove: "e2e4",
          lines: [
            "e2e4",
            "e7e6",
            "d2d4",
            "d7d5",
            "b1d2",
            "c7c5",
            "g1f3",
            "a7a6",
            "e4d5",
            "e6d5",
            "c2c4",
            "c5d4",
            "c4d5",
            "d8d5",
          ],
          eval: { type: "cp", value: 34 },
          secondBest: {
            lines: [
              "d2d4",
              "d7d5",
              "c2c4",
              "e7e6",
              "g1f3",
              "g8f6",
              "g2g3",
              "c7c5",
              "c4d5",
              "f6d5",
              "f1g2",
              "f8e7",
              "b1c3",
              "e8g8",
              "e1g1",
            ],
            eval: { type: "cp", value: 34 },
          },
        };

        resolve(this.output);
      } else {
        this.resolveCallback = resolve;
        this.output = { ...EmptyValue };
        this.sendCommand(`position fen ${fen}`);
        this.sendCommand("setoption name MultiPV value 2");
        this.sendCommand(`go depth ${depth}`);
      }
    });
  }
}

export default StockfishManager;
