import { Chess } from "chess.js";
import { Dispatch } from "react";

type stage = "first" | "second" | "third";
export interface userControlTypes {
  depth: number;
  highlight: boolean;
  arrows: boolean;
  evalbar: boolean;
  lines: boolean;
  btheme: string;
}
export interface resetTypes {
  bottom: "white" | "black";
  allowMoves: boolean;
  whitePlayer: string;
  stage: stage;
  blackPlayer: string;
  evaluation: number;
  fen: string;
  Game?: Chess;
  moveIndex: number;
}
export type stateProps = userControlTypes & resetTypes;
export type Action =
  | { type: "ChangeDepth"; depth: any }
  | { type: "ToggleHighlight" }
  | { type: "ToggleArrows" }
  | { type: "ToggleEvalbar" }
  | { type: "ToggleLines" }
  | { type: "SetTheme"; theme: string }
  | { type: "ChangeState"; stage: "first" | "third" }
  | { type: "ChangeState"; stage: "second"; game: Chess }
  | { type: "SetIndex"; index: number }
  | { type: "FlipBoard" };

export interface ContextProps {
  state: stateProps;
  dispatch: Dispatch<Action>;
}

const userControls: userControlTypes = {
  depth: 12,
  highlight: true,
  arrows: true,
  evalbar: true,
  lines: true,
  btheme: "wood",
};
const reset: resetTypes = {
  bottom: "white",
  allowMoves: false,
  whitePlayer: "White Player",
  blackPlayer: "Black Player",
  evaluation: 0,
  stage: "first",
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  Game: undefined,
  moveIndex: 0,
};
const iState: stateProps = {
  ...userControls,
  ...reset,
};
export const initialState = { ...iState };
export const themes = ["wood", "glass", "nature"];

export function reducer(state: stateProps, action: Action): stateProps {
  switch (action.type) {
    default:
      return state;
    case "ToggleHighlight":
      return { ...state, highlight: !state.highlight };
    case "ToggleArrows":
      return { ...state, arrows: !state.arrows };
    case "ToggleEvalbar":
      return { ...state, evalbar: !state.evalbar };
    case "ToggleLines":
      return { ...state, lines: !state.lines };
    case "FlipBoard":
      return { ...state, bottom: state.bottom === "white" ? "black" : "white" };
    case "ChangeDepth":
      return { ...state, depth: action.depth };
    case "SetTheme":
      return { ...state, btheme: action.theme };

    case "ChangeState":
      if (action.stage === "first") {
        return { ...state, ...reset };
      } else if (action.stage === "second") {
        return { ...state, stage: action.stage, Game: action.game };
      }
      return { ...state, stage: action.stage };

    case "SetIndex":
      var moveIndex = action.index;
      var fen;
      if (!state.Game) {
        throw new Error();
      }
      const full_history = state.Game.history({ verbose: true });
      if (moveIndex === -1) {
        fen = full_history[0].before;
      } else {
        fen = full_history[moveIndex].after;
      }
      return { ...state, moveIndex, fen };
  }
}
