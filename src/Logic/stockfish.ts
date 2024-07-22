interface StockfishOutput {
  bestMove?: string;
  eval?: string;
  lines?: string[];
}

class StockfishManager {
  private stockfish: Worker | null = null;
  private output: StockfishOutput = {};
  private resolveCallback: ((output: StockfishOutput) => void) | null = null;

  constructor() {
    console.log("stockfish");
    this.initializeStockfish();
  }

  private initializeStockfish() {
    const wasmSupported =
      typeof WebAssembly === "object" &&
      WebAssembly.validate(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
      );

    const stockfishPath = wasmSupported ? "stockfish.wasm.js" : "stockfish.js";

    this.stockfish = new Worker(stockfishPath);

    this.stockfish.addEventListener("message", (e) => {
      const data = e.data;
      if (typeof data === "string") {
        console.log(data);
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
          const evalValue = parts[evalIndex];
          const pvIndex = parts.indexOf("pv") + 1;
          const lines = parts.slice(pvIndex);
          this.output.eval = evalValue;
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
    console.log("analyzing position");
    return new Promise((resolve) => {
      this.resolveCallback = resolve;
      this.output = {}; // Reset output
      this.sendCommand(`position fen ${fen}`);
      this.sendCommand(`go depth ${depth}`);
    });
  }
}

export default StockfishManager;
