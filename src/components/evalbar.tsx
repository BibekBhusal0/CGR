import { useContext } from "react";
import { AppContext } from "../App";

function EvalBar() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("context not avalilable for eval bar");
  }
  const {
    state: { evaluation, Game, moveIndex, bottom, stage },
  } = context;
  const { type, value } = evaluation;
  var showVal: number | string = value;
  var white_winning = showVal <= 0;
  var winChance = 50;
  const rot = bottom === "white" ? "" : "rotate-180";
  if (stage === "third" && moveIndex !== -1) {
    if (!Game) {
      throw new Error("Game not found");
    }
    const turn = Game.history({ verbose: true })[moveIndex].color;
    if (turn === "b") {
      showVal *= -1;
    }
    if (type === "mate") {
      showVal = `M-${Math.abs(showVal)}`;
      winChance = white_winning ? 100 : -100;
    } else {
      showVal /= 100;
      winChance =
        50 - 50 * (2 / (1 + Math.exp(-0.00368208 * showVal * 10)) - 1);
      showVal = showVal.toFixed(2);
    }
  }

  return (
    <div
      className={`h-full w-8 ${rot} border-red-600 drop-shadow-2xl my-5 relative bg-white`}>
      <div
        className="w-full bg-black absolute top-0 transition-height"
        style={{ height: `${winChance}%` }}></div>
      <div
        id="evalNum"
        className={`absolute w-full text-center font-bold text-xs ${
          white_winning ? "top-0 text-white" : "bottom-0 text-black"
        } ${rot}`}>
        {showVal}
      </div>
    </div>
  );
}

export default EvalBar;
