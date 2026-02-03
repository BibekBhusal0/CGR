import { create } from "zustand";
import { Chess, DEFAULT_POSITION } from "chess.js";
import { evaluationType } from "@/Logic/stockfish";
import { analysisType } from "@/Logic/analyze";
import { GOT } from "@/components/moveTypes/types";
import { chessResults, drawResults, game } from "@/api/CDC";
import { ToastProps } from "@heroui/toast";
import { addGameToArchive, getAllGamesFromArchive } from "@/utils/archive";

function reformatLostResult(result: chessResults): GOT {
  if (result === "checkmated" || result === "timeout" || result === "resigned") {
    return result;
  }
  if (result === "abandoned") return "resigned";
  return "checkmated";
}

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
  setBottom: (bottom: "black" | "white") => void;
  changeState: (stage: stage) => void;
  setIndex: (index: number) => void;
  setBoardStage: (boardStage: Boardstage) => void;
  setGame: (Game: Chess) => void;
  loadGame: (load: saveType) => void;
  loadFromCdc: (game: game, userName?: string) => void;
  getGameToSave: () => saveType | undefined;
  saveGameToArchive: () => Promise<ToastProps>;
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
  setBottom: (bottom) => set({ bottom }),

  changeState: (stage) => {
    const state = get();
    if (stage === state.stage) return;
    if (stage === "first") set({ ...initialState });
    else if (stage === "second") set({ moveIndex: -1 });
    set({ stage });
  },

  setIndex: (index) => {
    const state = get();
    if (!state.Game) return;
    const full_history = state.Game.history({ verbose: true });
    if (index < -1 || index >= full_history.length) return;
    set(() => {
      if (!state.Game) return {};
      const moveIndex = index;
      let fen;
      let evaluation: evaluationType = { value: 0, type: "cp" };
      if (moveIndex === -1) {
        fen = full_history[0].before;
      } else if (moveIndex < -1 || moveIndex >= full_history.length) {
        return {};
      } else {
        try {
          if (state.analysis && state.analysis[moveIndex]) evaluation = state.analysis[moveIndex].eval;
        } catch (error) {
          console.log(`can't get evaluation of position `);
          console.error(error);
        }
        fen = full_history[moveIndex].after;
      }
      return { moveIndex, fen, evaluation, index2: 0, boardStage: "normal" };
    });
  },

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

  loadFromCdc: (game, userName) => {
    const { setTermination, setGame } = get();
    const { black, pgn, initial_setup, white } = game;
    const chess = new Chess(initial_setup || DEFAULT_POSITION);
    chess.loadPgn(pgn);
    if (black.username === userName) set({ bottom: "black" });
    if (drawResults.includes(black.result)) {
      setTermination({ overBy: "draw", winner: undefined });
    } else if (black.result === "win") {
      setTermination({ winner: "b", overBy: reformatLostResult(white.result) });
    } else if (white.result === "win") {
      setTermination({ winner: "w", overBy: reformatLostResult(black.result) });
    }
    setGame(chess);
  },

  loadGame: (load) => {
    const chess = new Chess();
    chess.loadPgn(load.pgn);
    set({ ...load });
    const { setGame } = get();
    setGame(chess);
  },

  getGameToSave: () => {
    const state = get();
    const { Game, analysis, whitePlayer, blackPlayer } = state;
    if (!Game || !analysis) return;
    const to_save: Partial<saveType> = {
      pgn: Game.pgn(),
      name: whitePlayer + " VS " + blackPlayer,
    };
    for (const i in allSaveKeys) {
      const key = allSaveKeys[i];
      // @ts-expect-error: safe key assignment
      to_save[key] = state[key];
    }
    return to_save as saveType;
  },

  saveGameToArchive: async () => {
    const { getGameToSave } = get();
    const g = getGameToSave();
    if (!g) {
      return { title: "No game to save", color: "danger" } as ToastProps;
    }
    const all = await getAllGamesFromArchive();
    const alreadySaved = all.some((game) => game.pgn === g.pgn);
    if (alreadySaved) {
      return { title: "Game already archived", color: "warning" } as ToastProps;
    }
    await addGameToArchive(g as saveType);
    return { title: "Game archived", color: "success" } as ToastProps;
  },
}));
