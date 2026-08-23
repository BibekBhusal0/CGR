import { cn } from "@heroui/react";
import { useGameState } from "@/Logic/state/game";
import { useSettingsState } from "@/Logic/state/settings";

function EvalBar() {
  const evaluation = useGameState((state) => state.evaluation);
  const moveIndex = useGameState((state) => state.moveIndex);
  const bottom = useGameState((state) => state.bottom);
  const stage = useGameState((state) => state.stage);
  const animation = useSettingsState((state) => state.animation);

  const { type, value } = evaluation;
  let showVal: number | string = value;

  if (typeof showVal === "string") {
    showVal = parseInt(showVal);
  }

  const white_winning = showVal > 0;
  let winChance = 50;
  const rot = bottom === "white" ? "" : "rotate-180";
  if (stage === "third" && moveIndex !== -1) {
    if (type === "mate") {
      if (Math.abs(showVal) <= 1) {
        showVal = showVal > 0 ? "1-0" : "0-1";
      } else {
        showVal = `M${Math.abs(showVal)}`;
      }
      winChance = white_winning ? 100 : 0;
    } else {
      winChance = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * showVal)) - 1);
      showVal /= 100;
      showVal = Math.abs(showVal).toFixed(2);
    }
  }
  return (
    <div
      style={{
        backgroundColor: "#F1E4D2",
      }}
      id="eval-white"
      className={cn("my-auto h-[450px] w-8 drop-shadow-2xl", rot)}>
      <div
        id="eval-black"
        className={cn("absolute top-0 w-full", animation && "transition-height")}
        style={{
          height: `${100 - winChance}%`,
          backgroundColor: "#454545",
        }}></div>
      <div
        id="evalNum"
        className={cn(
          "absolute w-full text-center text-xs font-bold",
          white_winning ? "top-0 text-white" : "bottom-0 text-black",
          rot
        )}>
        {showVal}
      </div>
    </div>
  );
}

export default EvalBar;
