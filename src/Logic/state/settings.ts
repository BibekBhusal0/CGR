import { create } from "zustand";
const b = ["default", "ocean", "wood", "geometric", "cosmos", "dash", "nature"] as const;
export type boardThemes = (typeof b)[number];
export const allBoardThemes: boardThemes[] = [...b];
export type booleanSettings = "highlight" | "bestMove" | "animation" | "localStockfish" | "devMode";
const m = ["chess.com", "pgn"] as const;
export type inputModes = (typeof m)[number];
export const allInputModes: inputModes[] = [...m];

export interface settingType {
  depth: number;
  highlight: boolean;
  bestMove: boolean;
  localStockfish: boolean;
  devMode: boolean;
  animation: boolean;
  btheme: boardThemes;
  inputMode: inputModes;
  openAccordions: string[];
}

const initialState: settingType = {
  depth: 12,
  highlight: true,
  devMode: false,
  localStockfish: false,
  bestMove: true,
  animation: true,
  btheme: "default",
  inputMode: "chess.com",
  openAccordions: ["General Settings", "Stockfish Settings"],
};

const useSettingsState = create<settingType, any>((set) => ({
  ...initialState,

  toggleValues: (item: booleanSettings) => set((state) => ({ [item]: !state[item] })),
  changeDepth: (depth: number) => set({ depth }),
  setBoardTheme: (btheme: boardThemes) => set({ btheme }),
  setOpenAccordtions: (openAccordions: string[]) => set({ openAccordions }),
  setSettings: (newSettings: settingType) => set((state) => ({ ...state, ...newSettings })),

  setInputMode: (newMode: inputModes) =>
    set((state) => {
      if (allInputModes.includes(newMode)) return { inputMode: newMode };
      return state;
    }),
}));

export default useSettingsState;
