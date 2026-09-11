import { analysisType } from "@/Logic/analyze";
import { create } from "zustand";
import { Chess, DEFAULT_POSITION } from "chess.js";
import { evaluationType } from "@/Logic/stockfish";
import { GOT } from "@/components/moveTypes/types";
import { chessResults, drawResults, game } from "@/api/CDC";
import type { LichessGame } from "@/api/lichess";
import { extractClocks } from "@/Logic/clocks";
import { addGameToArchive, getAllGamesFromArchive } from "@/utils/archive";
import { toast } from "@heroui/react";
import { v4 as uuidv4 } from "uuid";

function reformatLostResult(result: chessResults): GOT {
  if (result === "checkmated" || result === "timeout" || result === "resigned") {
    return result;
  }
  if (result === "abandoned") return "resigned";
  return "checkmated";
}

export function platformFromLink(link: string): { id: string; source: gameSource } {
  const id = link.match(/([A-Za-z0-9]+)\/?(?:\?.*)?$/)?.[1] ?? uuidv4();
  if (link.includes("lichess.org")) return { id, source: "lichess" };
  if (link.includes("chess.com")) return { id, source: "chess.com" };
  return { id, source: "pgn" };
}

export function idFromPgn(pgn: string): string {
  const link = /\[Link "([^"]+)"\]/.exec(pgn)?.[1] ?? "";
  return platformFromLink(link).id;
}

function lichessStatusToGot(status: import("@/api/lichess").LichessStatus): GOT {
  switch (status) {
    case "mate":
      return "checkmated";
    case "resign":
    case "aborted":
    case "noStart":
      return "resigned";
    case "outoftime":
    case "timeout":
      return "timeout";
    case "stalemate":
    case "draw":
      return "draw";
    default:
      return "checkmated";
  }
}

type stage = "first" | "second" | "third";
type Boardstage = "normal" | "bestMove" | "interact" | "practice";

export interface terminationType {
  winner: "b" | "w" | undefined;
  overBy: GOT;
}

export type gameSource = "chess.com" | "lichess" | "pgn";

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
  clocks: (string | undefined)[];
  id?: string;
  source?: gameSource;
}

export interface loadType {
  bottom: "white" | "black";
  whitePlayer: string;
  blackPlayer: string;
  analysis: analysisType[];
  termination?: terminationType;
  id?: string;
  source?: gameSource;
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
  loadFromLichess: (game: LichessGame, userName?: string) => void;
  loadFromLichessPgn: (pgn: string, whiteName?: string, blackName?: string) => void;
  getGameToSave: () => saveType | undefined;
  saveGameToArchive: () => void;
}

export type saveType = loadType & { pgn: string; name: string; id: string };

const s = [
  "bottom",
  "whitePlayer",
  "blackPlayer",
  "analysis",
  "termination",
  "id",
  "source",
] as const;
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
  clocks: [],
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
    if (stage === "first") set({ ...initialState, id: undefined, source: undefined });
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
        if (state.analysis && state.analysis[0]) evaluation = state.analysis[0].eval;
      } else if (moveIndex < -1 || moveIndex >= full_history.length) {
        return {};
      } else {
        try {
          if (state.analysis && state.analysis[moveIndex + 1])
            evaluation = state.analysis[moveIndex + 1].eval;
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
    let clocks: (string | undefined)[] = [];
    try {
      clocks = extractClocks(Game);
    } catch {
      clocks = [];
    }
    set({ whitePlayer, blackPlayer, Game, moveIndex: -1, stage: "second", clocks });
  },

  loadFromCdc: (game, userName) => {
    const { setTermination, setGame } = get();
    const { black, pgn, initial_setup, white } = game;
    const chess = new Chess(initial_setup || DEFAULT_POSITION);
    chess.loadPgn(pgn);
    set({ id: game.uuid, source: "chess.com" });
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

  loadFromLichessPgn: (pgn, whiteName, blackName) => {
    const { setTermination, setGame } = get();
    const chess = new Chess();
    chess.loadPgn(pgn);
    const header = chess.getHeaders();
    set({ ...platformFromLink(header.Link ?? "") });
    const result = header.Result;
    if (result === "1-0") setTermination({ winner: "w", overBy: "checkmated" });
    else if (result === "0-1") setTermination({ winner: "b", overBy: "checkmated" });
    else if (result === "1/2-1/2" || result === "*") {
      if (result !== "*") setTermination({ overBy: "draw", winner: undefined });
    }
    void whiteName;
    void blackName;
    setGame(chess);
  },

  loadFromLichess: (game, userName) => {
    const { setTermination, setGame } = get();
    const chess = new Chess();
    try {
      chess.loadPgn(game.pgn);
    } catch {
      return;
    }
    set({ id: game.id, source: "lichess" });
    const lowerUser = userName?.trim().toLowerCase();
    if (
      lowerUser &&
      game.players.black.user &&
      game.players.black.user.name.toLowerCase() === lowerUser
    ) {
      set({ bottom: "black" });
    }
    if (!game.winner) {
      setTermination({ overBy: "draw", winner: undefined });
    } else if (game.winner === "white") {
      setTermination({ winner: "w", overBy: lichessStatusToGot(game.status) });
    } else {
      setTermination({ winner: "b", overBy: lichessStatusToGot(game.status) });
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
      toast.danger("No Game to save");
      return;
    }
    const all = await getAllGamesFromArchive();
    const alreadySaved = all.some((game) => game.pgn === g?.pgn);
    if (alreadySaved) {
      toast.warning("Game already archived");
      return;
    }
    await addGameToArchive(g as saveType);
    toast.success("Game Archived");
  },
}));
