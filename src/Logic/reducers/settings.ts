import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const b = [
  "default",
  "ocean",
  "wood",
  "geometric",
  "cosmos",
  "dash",
  "glass",
  "nature",
] as const;
export type boardThemes = (typeof b)[number];
export const allBoardThemes: boardThemes[] = [...b];

export interface settingType {
  depth: number;
  highlight: boolean;
  bestMove: boolean;
  animation: boolean;
  btheme: boardThemes;
}

const initialState: settingType = {
  depth: 12,
  highlight: true,
  bestMove: true,
  animation: true,
  btheme: "default",
};

const settingSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    toggleValues(
      state,
      action: PayloadAction<"highlight" | "bestMove" | "animation">
    ) {
      state[action.payload] = !state[action.payload];
    },
    changeDepth(state, action: PayloadAction<number>) {
      state.depth = action.payload;
    },
    setBoardTheme(state, action: PayloadAction<boardThemes>) {
      if (allBoardThemes.includes(action.payload))
        state.btheme = action.payload;
    },
  },
});

export const { changeDepth, toggleValues, setBoardTheme } =
  settingSlice.actions;

export default settingSlice.reducer;
