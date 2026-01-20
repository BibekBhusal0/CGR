import { evaluationType } from "@/Logic/stockfish";

export function rephraseEvaluation(evaluation: evaluationType) {
  const { type, value } = evaluation;
  let out: number | string = value;
  if (typeof out === "string") out = parseInt(out);

  const white_winning = out > 0;
  if (type === "mate") out = `M${Math.abs(out)}`;
  else {
    out /= 100;
    out = Math.abs(out).toFixed(2);
  }
  out = white_winning ? "+" + out : "-" + out;
  return out;
}
