import { Dispatch } from "react";

export interface stateProps {
  depth: number;
  highlight: boolean;
  arrows: boolean;
  evalbar: boolean;
  lines: boolean;
  btheme: string;
}
export type Action =
  | { type: "ChangeDepth"; n: any }
  | { type: "ToggleHighlight" }
  | { type: "ToggleArrows" }
  | { type: "ToggleEvalbar" }
  | { type: "ToggleLines" }
  | { type: "SetTheme"; theme: string };

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
  btheme: "wood",
};
export const themes = ["wood", "glass", "nature"];

export function reducer(state: stateProps, action: Action) {
  switch (action.type) {
    case "ChangeDepth":
      return { ...state, depth: action.n };

    case "SetTheme":
      var btheme = action.theme;
      return { ...state, btheme };

    case "ToggleHighlight":
      var highlight = !state.highlight;
      return { ...state, highlight };

    case "ToggleArrows":
      var arrows = !state.arrows;
      return { ...state, arrows };

    case "ToggleEvalbar":
      var evalbar = !state.evalbar;
      return { ...state, evalbar };
    case "ToggleLines":
      var lines = !state.lines;
      return { ...state, lines };

    default:
      return state;
  }
}
