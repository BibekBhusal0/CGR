import { useSettingsState, ThemeName } from "@/Logic/state/settings";

function applyMode(darkMode: boolean) {
  const mode = darkMode ? "dark" : "light";
  document.documentElement.classList.toggle("dark", darkMode);
  document.documentElement.classList.toggle("light", !darkMode);
  document.documentElement.setAttribute("data-theme", mode);
}

function applyAppTheme(theme: ThemeName) {
  document.documentElement.setAttribute("data-app-theme", theme);
}

export function autoSetTheme() {
  const { darkMode, theme } = useSettingsState.getState();
  applyMode(darkMode);
  applyAppTheme(theme);
}

export { applyMode, applyAppTheme };
export default autoSetTheme;
