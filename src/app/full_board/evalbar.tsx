import { useSelector } from "react-redux";
import { StateType } from "../../Logic/reducers/store";
import { cn } from "@heroui/theme";

function EvalBar() {
  const { evaluation, moveIndex, bottom, stage } = useSelector((state: StateType) => state.game);

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
      showVal = `M${Math.abs(showVal)}`;
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
        className="transition-height absolute top-0 w-full"
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
