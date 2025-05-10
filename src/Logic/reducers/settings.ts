import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const b = ["default", "ocean", "wood", "geometric", "cosmos", "dash", "nature"] as const;
export type boardThemes = (typeof b)[number];
export const allBoardThemes: boardThemes[] = [...b];
export type booleanSettings = "highlight" | "bestMove" | "animation" | "localStockfish";


export interface settingType {
  depth: number;
  highlight: boolean;
  bestMove: boolean;
  localStockfish: boolean;
  animation: boolean;
  btheme: boardThemes;
}

const initialState: settingType = {
  depth: 12,
  highlight: true,
  localStockfish: true,
  bestMove: true,
  animation: true,
  btheme: "default",
};

const changeBoardTheme = (state: settingType, theme: boardThemes) => {
  if (allBoardThemes.includes(theme)) state.btheme = theme;
};

const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleValues(state, action: PayloadAction<booleanSettings>) {
      state[action.payload] = !state[action.payload];
    },
    changeDepth(state, action: PayloadAction<number>) {
      state.depth = action.payload;
    },
    setBoardTheme(state, action: PayloadAction<boardThemes>) {
      changeBoardTheme(state, action.payload);
    },
    setSettings(state, action: PayloadAction<settingType>) {
      for (const key in state) {
        if (key in action.payload) {
          if (key === "btheme") changeBoardTheme(state, action.payload[key]);
          // @ts-expect-error This is safe mr eslint stop shouting
          else state[key] = action.payload[key];
        }
      }
    },
  },
});

export const { changeDepth, toggleValues, setBoardTheme } = settingSlice.actions;

export default settingSlice.reducer;
