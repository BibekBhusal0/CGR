import { useSettingsState } from "@/Logic/state/settings";

export function setAnimation(animation: boolean) {
  document.documentElement.setAttribute("data-reduce-motion", animation ? "false" : "true");
}

export function autoSetAnimation() {
  const animation = useSettingsState.getState().animation;
  setAnimation(animation);
}

export default setAnimation;
