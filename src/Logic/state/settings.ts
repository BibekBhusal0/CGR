import { create } from "zustand";
import { persist } from "zustand/middleware";

const b = ["default", "ocean", "wood", "geometric", "cosmos", "dash", "nature"] as const;
export type boardThemes = (typeof b)[number];
export const allBoardThemes: boardThemes[] = [...b];
export type booleanSettings =
  | "highlight"
  | "bestMove"
  | "animation"
  | "devMode"
  | "analyzePerMove"
  | "sidebarCollapsed";
const m = ["chess.com", "pgn"] as const;
const n = ["none", "in-board", "in-square"] as const;
const s = ["stockfish-17-lite", "stockfish-17"] as const;
export type availableStockfish = (typeof s)[number];
export const allStockfishAvailable: availableStockfish[] = [...s];
export type notationStyle = (typeof n)[number];
export const allNotationStyles: notationStyle[] = [...n];
export type inputModes = (typeof m)[number];
export const allInputModes: inputModes[] = [...m];

const SETTINGS_KEY = "CHESS SETTINGS";
export interface settingType {
  depth: number;
  highlight: boolean;
  bestMove: boolean;
  devMode: boolean;
  animation: boolean;
  sidebarCollapsed: boolean;
  analyzePerMove: boolean;
  btheme: boardThemes;
  inputMode: inputModes;
  openAccordions: string[];
  notationStyle: notationStyle;
  stockfish: availableStockfish;
}

interface settingActions {
  toggleValues: (item: booleanSettings) => void;
  changeDepth: (depth: number) => void;
  setBoardTheme: (btheme: boardThemes) => void;
  setOpenAccordtions: (openAccordions: string[]) => void;
  setSettings: (newSettings: settingType) => void;
  setInputMode: (newMode: inputModes) => void;
  setNotationStyle: (notationStyle: notationStyle) => void;
  setStockfish: (stockfish: availableStockfish) => void;
}

export type SettingsState = settingType & settingActions;

const initialState: settingType = {
  depth: 12,
  highlight: true,
  devMode: false,
  bestMove: true,
  animation: true,
  sidebarCollapsed: false,
  analyzePerMove: false,
  btheme: "default",
  inputMode: "chess.com",
  openAccordions: ["General Settings", "Stockfish Settings"],
  notationStyle: "in-board",
  stockfish: "stockfish-17",
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
      setNotationStyle: (notationStyle) => set({ notationStyle }),
      setStockfish: (stockfish) => set({ stockfish }),

      setInputMode: (newMode) =>
        set((state) => {
          if (allInputModes.includes(newMode)) return { inputMode: newMode };
          return state;
        }),
    }),
    { name: SETTINGS_KEY }
  )
);
