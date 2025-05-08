import { Chess } from "chess.js";
import { Dispatch } from "react";
import { evaluationType } from "./stockfish";
import { analysisType } from "./analyze";
import { GOT } from "../components/moveTypes/types";

type stage = "first" | "second" | "third";
type Boardstage = "normal" | "bestMove" | "interact" | "practice";
export interface terminationType {
  winner: "b" | "w" | undefined;
  overBy: GOT;
}
export interface userControlTypes {
  depth: number;
  highlight: boolean;
  bestMove: boolean;
  animation: boolean;
  btheme: string;
}

export interface resetTypes {
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

export type stateProps = userControlTypes & resetTypes;
export type Action =
  | { type: "ToggleHighlight" }
  | { type: "ToggleBestMove" }
  | { type: "ToggleAnimation" }
  | { type: "FlipBoard" }
  | { type: "SetTheme"; theme: string }
  | { type: "SetFen"; fen: string }
  | { type: "SetIndex"; index: number }
  | { type: "SetIndex2"; index: number }
  | { type: "SetBoardStage"; stage: Boardstage }
  | { type: "ChangeState"; stage: stage }
  | { type: "ChangeDepth"; depth: number }
  | { type: "SetTermination"; termination?: terminationType }
  | { type: "SetGame"; game: Chess }
  | { type: "SetAnalysis"; analysis: analysisType[] };

export interface ContextProps {
  state: stateProps;
  dispatch: Dispatch<Action>;
}

const userControls: userControlTypes = {
  depth: 12,
  highlight: true,
  bestMove: true,
  animation: true,
  btheme: "default",
};
const reset: resetTypes = {
  bottom: "white",
  allowMoves: false,
  whitePlayer: "White Player",
  blackPlayer: "Black Player",
  evaluation: { type: "cp", value: 0 },
  stage: "first",
  boardStage: "normal",
  index2: 0,
  moveIndex: -1,
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  termination: undefined,
  Game: undefined,
  analysis: undefined,
};
const iState: stateProps = {
  ...userControls,
  ...reset,
};
export const initialState = { ...iState };

export function reducer(state: stateProps, action: Action): stateProps {
  switch (action.type) {
    default:
      return state;
    case "ToggleHighlight":
      return { ...state, highlight: !state.highlight };
    case "ToggleBestMove":
      return { ...state, bestMove: !state.bestMove };
    case "ToggleAnimation":
      return { ...state, animation: !state.animation };
    case "FlipBoard":
      return { ...state, bottom: state.bottom === "white" ? "black" : "white" };
    case "ChangeDepth":
      return { ...state, depth: action.depth };
    case "SetTheme":
      return { ...state, btheme: action.theme };
    case "SetAnalysis":
      return { ...state, analysis: action.analysis };
    case "SetTermination":
      return { ...state, termination: action.termination };
    case "SetFen":
      console.log(`setting fen to ${action.fen}`);
      return { ...state, fen: action.fen };
    case "SetIndex2":
      console.log(`in move ${action.index}`);
      return { ...state, index2: action.index };
    case "SetBoardStage":
      console.log(`changing state to ${action.stage}`);
      if (action.stage === "normal") {
        if (!state.Game) {
          throw new Error("game not found");
        }

        const fen = state.Game.history({ verbose: true })[state.moveIndex].after;
        return { ...state, boardStage: action.stage, fen };
      }
      return { ...state, boardStage: action.stage };

    case "ChangeState":
      if (action.stage === "first") {
        return { ...state, ...reset };
      } else if (action.stage === "second") {
        return { ...state, stage: action.stage, moveIndex: -1 };
      } else {
        return { ...state, stage: action.stage };
      }

    case "SetGame":
      const header = action.game.header();
      let whitePlayer = header.White || state.whitePlayer;
      let blackPlayer = header.Black || state.blackPlayer;
      const whiteElo = header.WhiteElo || "";
      const blackElo = header.BlackElo || "";

      if (whitePlayer === "?" || whitePlayer === "??") {
        whitePlayer = state.whitePlayer;
      } else {
        whitePlayer = whitePlayer.trim();
        if (whiteElo) {
          whitePlayer = `${whitePlayer} (${whiteElo})`;
        }
      }

      if (blackPlayer === "?" || blackPlayer === "??") {
        blackPlayer = state.blackPlayer;
      } else {
        blackPlayer = blackPlayer.trim();
        if (blackElo) {
          blackPlayer = `${blackPlayer} (${blackElo})`;
        }
      }

      return {
        ...state,
        Game: action.game,
        whitePlayer,
        blackPlayer,
      };

    case "SetIndex":
      const moveIndex = action.index;
      let fen;
      let evaluation: evaluationType = { value: 0, type: "cp" };

      if (!state.Game || !state.analysis) {
        throw new Error("game not entered");
      }
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
      return {
        ...state,
        moveIndex,
        fen,
        evaluation,
        index2: 0,
        boardStage: "normal",
      };
  }
}
