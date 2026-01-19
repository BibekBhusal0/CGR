import { create } from "zustand";
import { Chess, DEFAULT_POSITION } from "chess.js";
import { evaluationType } from "@/Logic/stockfish";
import { analysisType } from "@/Logic/analyze";
import { GOT } from "@/components/moveTypes/types";

type stage = "first" | "second" | "third";
type Boardstage = "normal" | "bestMove" | "interact" | "practice";

export interface terminationType {
  winner: "b" | "w" | undefined;
  overBy: GOT;
}

export interface GameType {
  bottom: "white" | "black";
  allowMoves: boolean;
  whitePlayer: string;
  stage: stage;
  boardStage: Boardstage;
  blackPlayer: string;
  fen: string;
  moveIndex: number;
  index2: number;
  evaluation: evaluationType;
  Game?: Chess;
  analysis?: analysisType[];
  termination?: terminationType;
}

export interface loadType {
  bottom: "white" | "black";
  whitePlayer: string;
  blackPlayer: string;
  analysis: analysisType[];
  termination?: terminationType;
}
interface GameActions {
  flipBoard: () => void;
  setFen: (fen: string) => void;
  setIndex2: (index2: number) => void;
  setAnalysis: (analysis: analysisType[]) => void;
  setTermination: (termination: terminationType | undefined) => void;
  changeState: (stage: stage) => void;
  setIndex: (index: number) => void;
  setBoardStage: (boardStage: Boardstage) => void;
  setGame: (Game: Chess) => void;
  loadGame: (load: loadType) => void;
}
export type saveType = loadType & { pgn: string; name: string; id: string };

const s = ["bottom", "whitePlayer", "blackPlayer", "analysis", "termination"] as const;
export type saveKeys = (typeof s)[number];
export const allSaveKeys: saveKeys[] = [...s];
export type GameState = GameType & GameActions;

const initialState: GameType = {
  bottom: "white",
  allowMoves: false,
  whitePlayer: "White Player",
  blackPlayer: "Black Player",
  evaluation: { type: "cp", value: 0 },
  stage: "first",
  boardStage: "normal",
  index2: 0,
  moveIndex: -1,
  fen: DEFAULT_POSITION,
  termination: undefined,
  Game: undefined,
  analysis: undefined,
};

export const useGameState = create<GameState>((set, get) => ({
  ...initialState,
  flipBoard: () => set((state) => ({ bottom: state.bottom === "white" ? "black" : "white" })),
  setFen: (fen) => set({ fen }),
  setIndex2: (index2) => set({ index2 }),
  setAnalysis: (analysis) => set({ analysis }),
  setTermination: (termination) => set({ termination }),

  changeState: (stage) => {
    if (stage === "first") set({ ...initialState });
    else if (stage === "second") set({ moveIndex: -1 });
    set({ stage });
  },

  setIndex: (index) =>
    set((state) => {
      if (!state.Game || !state.analysis) return state;
      const moveIndex = index;
      let fen;
      let evaluation: evaluationType = { value: 0, type: "cp" };
      const full_history = state.Game.history({ verbose: true });
      if (moveIndex === -1) {
        fen = full_history[0].before;
      } else {
        try {
          evaluation = state.analysis[moveIndex].eval;
        } catch (error) {
          console.log(`can't get evaluation of position `);
          console.error(error);
        }
        fen = full_history[moveIndex].after;
      }
      return { moveIndex, fen, evaluation, index2: 0, boardStage: "normal" };
    }),

  setBoardStage: (boardStage) => {
    const state = get();
    if (boardStage === "normal" && state.Game) {
      const fen = state.Game.history({ verbose: true })[state.moveIndex].after;
      set({ fen });
    }
    set({ boardStage });
  },

  setGame: (Game) => {
    const state = get();
    const header = Game.getHeaders();
    const formatPlayer = (player: string, elo: string, defaultName: string): string => {
      if (player === "?" || player === "??") return defaultName;
      player = player.trim();
      return elo ? `${player} (${elo})` : player;
    };
    const whitePlayer = formatPlayer(
      header.White || state.whitePlayer,
      header.WhiteElo || "",
      state.whitePlayer
    );
    const blackPlayer = formatPlayer(
      header.Black || state.blackPlayer,
      header.BlackElo || "",
      state.blackPlayer
    );
    set({ whitePlayer, blackPlayer, Game, moveIndex: -1, stage: "second" });
  },

  loadGame: (load) => set((state) => ({ ...state, ...load })),
}));
