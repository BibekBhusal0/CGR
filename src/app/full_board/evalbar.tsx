import { cn } from "@heroui/react";
import { useGameState } from "@/Logic/state/game";
import { useSettingsState } from "@/Logic/state/settings";
import { rephraseEvaluation } from "@/Logic/rephraseEvaluation";

function EvalBar() {
  const evaluation = useGameState((state) => state.evaluation);
  const bottom = useGameState((state) => state.bottom);
  const animation = useSettingsState((state) => state.animation);

  const { type, value } = evaluation;
  const raw = typeof value === "string" ? parseInt(value) : value;

  const white_winning = raw > 0;
  let winChance = 50;
  if (type === "mate") {
    winChance = white_winning ? 100 : 0;
  } else {
    winChance = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * raw)) - 1);
  }
  const showVal = rephraseEvaluation(evaluation);
  const whiteAtBottom = bottom === "white";
  const blackAnchor = whiteAtBottom ? "top" : "bottom";
  const labelAtTop = whiteAtBottom ? !white_winning : white_winning;
  const darkHeight = 100 - winChance;
  const labelOnBlackFill =
    (labelAtTop && blackAnchor === "top") || (!labelAtTop && blackAnchor === "bottom");
  const labelOnDark = labelOnBlackFill ? darkHeight > 8 : darkHeight > 92;
  return (
    <div id="eval-white" className="bg-board-light relative w-8 self-stretch drop-shadow-2xl">
      <div
        id="eval-black"
        className={cn(
          "bg-board-dark absolute inset-x-0",
          blackAnchor === "top" ? "top-0" : "bottom-0"
        )}
        style={{
          height: `${100 - winChance}%`,
          transition: animation ? "height 300ms ease" : "none",
        }}></div>
      <div
        id="evalNum"
        className={cn(
          "absolute w-full text-center text-sm font-bold",
          labelAtTop ? "top-0" : "bottom-0",
          labelOnDark ? "text-board-light" : "text-board-dark"
        )}>
        {showVal}
      </div>
    </div>
  );
}

export default EvalBar;
