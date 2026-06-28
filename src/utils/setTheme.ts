import { useSettingsState } from "@/Logic/state/settings";

export function setTheme(darkMode: boolean) {
  const crrClass = darkMode ? "dark" : "light";
  const prevClass = !darkMode ? "dark" : "light";
  document.documentElement.classList.remove(prevClass);
  document.documentElement.classList.add(crrClass);
  document.documentElement.setAttribute("data-theme", crrClass);
}

export function autoSetTheme() {
  const darkMode = useSettingsState.getState().darkMode;
  setTheme(darkMode);
}

export default setTheme;
