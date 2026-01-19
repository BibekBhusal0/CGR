import { create } from "zustand";
import { persist } from "zustand/middleware";
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

interface settingActions {
  toggleValues: (item: booleanSettings) => void;
  changeDepth: (depth: number) => void;
  setBoardTheme: (btheme: boardThemes) => void;
  setOpenAccordtions: (openAccordions: string[]) => void;
  setSettings: (newSettings: settingType) => void;
  setInputMode: (newMode: inputModes) => void;
}

export type SettingsState = settingType & settingActions;

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

export const useSettingsState = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      toggleValues: (item) => set((state) => ({ [item]: !state[item] })),
      changeDepth: (depth) => set({ depth }),
      setBoardTheme: (btheme) => set({ btheme }),
      setOpenAccordtions: (openAccordions: string[]) => set({ openAccordions }),
      setSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),

      setInputMode: (newMode) =>
        set((state) => {
          if (allInputModes.includes(newMode)) return { inputMode: newMode };
          return state;
        }),
    }),
    { name: "CHESS SETTINGS" }
  )
);
