import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
export type saveType = loadType & { pgn: string, name: string, id: string }

const s = ['bottom', 'whitePlayer', 'blackPlayer', 'analysis', 'termination'] as const
export type saveKeys = (typeof s)[number]
export const allSaveKeys: saveKeys[] = [...s]

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

const gameSlice = createSlice({
  name: "game",
  initialState: { ...initialState },
  reducers: {
    flipBoard(state) {
      state.bottom = state.bottom === "white" ? "black" : "white";
    },
    setFen(state, action: PayloadAction<string>) {
      state.fen = action.payload;
    },
    setIndex2(state, action: PayloadAction<number>) {
      state.index2 = action.payload;
    },
    setAnalysis(state, action: PayloadAction<analysisType[]>) {
      state.analysis = action.payload;
    },
    setTermination(state, action: PayloadAction<terminationType | undefined>) {
      state.termination = action.payload;
    },

    changeState(state, action: PayloadAction<stage>) {
      if (action.payload === "first") Object.assign(state, initialState);
      else if (action.payload === "second") state.moveIndex = -1;
      state.stage = action.payload;
    },

    setIndex(state, action: PayloadAction<number>) {
      if (!state.Game || !state.analysis) throw new Error("game not entered");
      const moveIndex = action.payload;
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

      state.moveIndex = moveIndex;
      state.fen = fen;
      state.evaluation = evaluation;
      state.index2 = 0;
      state.boardStage = "normal";
    },

    setBoardStage(state, action: PayloadAction<Boardstage>) {
      if (action.payload === "normal") {
        if (!state.Game) throw new Error("game not found");
        const fen = state.Game.history({ verbose: true })[state.moveIndex].after;
        state.fen = fen;
      }
      state.boardStage = action.payload;
    },

    setGame(state, action: PayloadAction<Chess>) {
      const header = action.payload.header();
      const formatPlayer = (player: string, elo: string, defaultName: string): string => {
        if (player === "?" || player === "??") return defaultName;
        player = player.trim();
        return elo ? `${player} (${elo})` : player;
      };
      state.whitePlayer = formatPlayer(
        header.White || state.whitePlayer,
        header.WhiteElo || "",
        state.whitePlayer
      );
      state.blackPlayer = formatPlayer(
        header.Black || state.blackPlayer,
        header.BlackElo || "",
        state.blackPlayer
      );
      state.Game = action.payload;
      state.moveIndex = -1;
      state.stage = 'second'
    },

    loadGame(state, action: PayloadAction<loadType>) {
      for (const key in state) {
        if (key in action.payload) {
          // @ts-expect-error This is safe mr eslint stop shouting
          state[key] = action.payload[key];
        }
      }
    }
  },
});

export const {
  flipBoard,
  setFen,
  setIndex,
  setIndex2,
  setBoardStage,
  changeState,
  setGame,
  setAnalysis,
  setTermination,
  loadGame,
} = gameSlice.actions;

export default gameSlice.reducer;
