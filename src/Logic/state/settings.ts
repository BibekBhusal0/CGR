import { applyMode, applyAppTheme } from "@/utils/setTheme";
import setAnimation from "@/utils/setAnimation";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const t = ["default", "ocean", "wood", "geometric", "cosmos", "dash", "nature"] as const;
export type ThemeName = (typeof t)[number];
export const allThemes: ThemeName[] = [...t];
export type booleanSettings =
  | "highlight"
  | "darkMode"
  | "animation"
  | "bestMove"
  | "devMode"
  | "analyzePerMove"
  | "sidebarCollapsed"
  | "evalBar";
const m = ["chess.com", "pgn"] as const;
const n = ["none", "in-board", "in-square"] as const;
const s = ["stockfish-17-lite", "stockfish-17", "stockfish-18-lite"] as const;
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
  darkMode: boolean;
  animation: boolean;
  evalBar: boolean;
  bestMove: boolean;
  devMode: boolean;
  sidebarCollapsed: boolean;
  analyzePerMove: boolean;
  theme: ThemeName;
  inputMode: inputModes;
  openAccordions: string[];
  notationStyle: notationStyle;
  stockfish: availableStockfish;
}

interface settingActions {
  toggleValues: (item: booleanSettings) => void;
  changeDepth: (depth: number) => void;
  setTheme: (theme: ThemeName) => void;
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
  darkMode: true,
  animation: true,
  evalBar: true,
  devMode: false,
  bestMove: true,
  sidebarCollapsed: false,
  analyzePerMove: false,
  theme: "default",
  inputMode: "chess.com",
  openAccordions: ["General Settings", "Stockfish Settings"],
  notationStyle: "in-board",
  stockfish: "stockfish-17",
};

export const useSettingsState = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      toggleValues: (item) => {
        set((state) => {
          if (item === "darkMode") applyMode(!state[item]);
          if (item === "animation") setAnimation(!state[item]);
          return { [item]: !state[item] };
        });
      },
      changeDepth: (depth) => set({ depth }),
      setTheme: (theme) => {
        applyAppTheme(theme);
        set({ theme });
      },
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
    {
      name: SETTINGS_KEY,
      merge: (persisted, current) => {
        const p = persisted as Partial<settingType> & { btheme?: ThemeName };
        const { btheme, ...rest } = p;
        return { ...current, ...rest, theme: p.theme ?? btheme ?? current.theme };
      },
    }
  )
);
