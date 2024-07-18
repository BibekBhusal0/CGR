import { Dispatch } from "react";

type stage = "first" | "second" | "third" | "fourth";
export interface stateProps {
  depth: number;
  highlight: boolean;
  arrows: boolean;
  evalbar: boolean;
  lines: boolean;
  bottom: "white" | "black";
  allowMoves: boolean;
  btheme: string;
  whitePlayer: string;
  stage: stage;
  blackPlayer: string;
  evaluation: number;
  currentfen: string;
  userName?: any;
  completeGame?: string;
  moveIndex?: number;
}
export type Action =
  | { type: "ChangeDepth"; depth: any }
  | { type: "ToggleHighlight" }
  | { type: "ToggleArrows" }
  | { type: "ToggleEvalbar" }
  | { type: "ToggleLines" }
  | { type: "SetTheme"; theme: string }
  | { type: "FlipBoard" }
  | { type: "ChangeState"; stage: stage; more?: string };

export interface ContextProps {
  state: stateProps;
  dispatch: Dispatch<Action>;
}

export const initialState: stateProps = {
  depth: 12,
  highlight: true,
  arrows: true,
  evalbar: true,
  lines: true,
  bottom: "white",
  allowMoves: false,
  btheme: "wood",
  whitePlayer: "White Player",
  blackPlayer: "Black Player",
  evaluation: 0,
  stage: "first",
  currentfen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
};
export const themes = ["wood", "glass", "nature"];

export function reducer(state: stateProps, action: Action): stateProps {
  switch (action.type) {
    case "ChangeDepth":
      return { ...state, depth: action.depth };
    case "SetTheme":
      return { ...state, btheme: action.theme };
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
    case "ChangeState":
      if (action.stage === "second") {
        return { ...state, userName: action.more, stage: action.stage };
      }
      return state;

    default:
      return state;
  }
}
