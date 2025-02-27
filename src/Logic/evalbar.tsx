import { useSelector } from "react-redux";
import { evaluationType } from "./stockfish";
import { StateType } from "./reducers/store";

function EvalBar() {
  const { evaluation, moveIndex, bottom, stage } = useSelector(
    (state: StateType) => state.game
  );

  const { type, value } = evaluation;
  var showVal: number | string = value;

  if (typeof showVal === "string") {
    showVal = parseInt(showVal);
  }

  var white_winning = showVal > 0;
  console.log(white_winning);
  var winChance = 50;
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
      className={`my-auto h-[450px] w-8 ${rot} drop-shadow-2xl`}>
      <div
        id="eval-black"
        className="w-full absolute top-0 transition-height "
        style={{
          height: `${100 - winChance}%`,
          backgroundColor: "#454545",
        }}></div>
      <div
        id="evalNum"
        className={`absolute w-full text-center font-bold text-xs  ${
          white_winning ? "top-0 text-white" : "bottom-0 text-black"
        } ${rot}`}>
        {showVal}
      </div>
    </div>
  );
}

export default EvalBar;

export function rephraseEvaluation(evaluation: evaluationType) {
  const { type, value } = evaluation;
  var out: number | string = value;

  if (typeof out === "string") {
    out = parseInt(out);
  }

  var white_winning = out > 0;
  if (type === "mate") {
    out = `M${Math.abs(out)}`;
  } else {
    out /= 100;
    out = Math.abs(out).toFixed(2);
  }
  out = white_winning ? "+" + out : "-" + out;
  return out;
}
