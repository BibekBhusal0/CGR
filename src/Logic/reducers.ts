import { Chess } from "chess.js";
import { Dispatch } from "react";
import { evaluationType, StockfishOutput } from "./stockfish";

type stage = "first" | "second" | "third";
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
  blackPlayer: string;
  evaluation: evaluationType;
  fen: string;
  Game?: Chess;
  analysis?: StockfishOutput[];
  moveIndex: number;
}

export interface analysisMoveType {
  bestMove: string;
  eval: { type: string; value: number };
  lines: string[];
}
export type stateProps = userControlTypes & resetTypes;
export type Action =
  | { type: "ChangeDepth"; depth: any }
  | { type: "ToggleHighlight" }
  | { type: "ToggleBestMove" }
  | { type: "ToggleAnimation" }
  | { type: "SetTheme"; theme: string }
  | { type: "ChangeState"; stage: "first" | "third" | "second" }
  | { type: "SetGame"; game: Chess }
  | { type: "SetIndex"; index: number }
  | { type: "SetAnalysis"; analysis: analysisMoveType[] }
  | { type: "FlipBoard" };

export interface ContextProps {
  state: stateProps;
  dispatch: Dispatch<Action>;
}

const userControls: userControlTypes = {
  depth: 10,
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
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  Game: undefined,
  analysis: undefined,
  moveIndex: -1,
};
const iState: stateProps = {
  ...userControls,
  ...reset,
};
export const initialState = { ...iState };
export const themes = [
  "default",
  "ocen",
  "wood",
  "geometric",
  "cosmos",
  "dash",
  "glass",
  "nature",
];

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

    case "ChangeState":
      if (action.stage === "first") {
        return { ...state, ...reset };
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
      var moveIndex = action.index;
      var fen;
      var evaluation: evaluationType = { value: 0, type: "cp" };

      if (!state.Game || !state.analysis) {
        throw new Error("game not entered");
      }
      const full_history = state.Game.history({ verbose: true });
      if (moveIndex === -1) {
        fen = full_history[0].before;
      } else {
        try {
          evaluation = state.analysis[moveIndex].eval;
          console.log(evaluation);
        } catch {}
        fen = full_history[moveIndex].after;
      }
      return { ...state, moveIndex, fen, evaluation };
  }
}
