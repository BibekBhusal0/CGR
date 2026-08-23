import { useSettingsState, boardThemes } from "@/Logic/state/settings";

export function setTheme(darkMode: boolean) {
  const crrClass = darkMode ? "dark" : "light";
  const prevClass = !darkMode ? "dark" : "light";
  document.documentElement.classList.remove(prevClass);
  document.documentElement.classList.add(crrClass);
  document.documentElement.setAttribute("data-theme", crrClass);
}

export function setBoardThemeColors(theme: boardThemes) {
  document.documentElement.setAttribute("data-board-theme", theme);
}

export function autoSetTheme() {
  const state = useSettingsState.getState();
  const darkMode = state.darkMode;
  const btheme = state.btheme;
  setTheme(darkMode);
  setBoardThemeColors(btheme);
}

export default setTheme;
