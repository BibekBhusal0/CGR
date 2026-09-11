import { Chess } from "chess.js";

const CLK_REGEX = /\[%clk\s+([^\]]+)\]/;

export function extractClocks(game: Chess): (string | undefined)[] {
  const history = game.history({ verbose: true });
  if (history.length === 0) return [];

  const comments = new Map<string, string>();
  try {
    for (const { fen, comment } of game.getComments()) {
      comments.set(fen, comment);
    }
  } catch {
    return history.map(() => undefined);
  }

  return history.map((move) => {
    const comment = comments.get(move.after);
    if (comment) {
      const m = comment.match(CLK_REGEX);
      if (m) return m[1].trim();
    }
    return undefined;
  });
}

export function formatClock(raw: string): string {
  const match = raw.trim().match(/^(?:(\d+):)?(\d{1,3}):(\d{1,2}(?:\.\d+)?)$|^(\d+(?:\.\d+)?)$/);
  if (!match) return raw;
  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const seconds = parseFloat(match[3] ?? match[4] ?? "0");
  if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) return raw;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(Math.floor(seconds))}`;
  if (minutes > 0 || seconds >= 10) return `${minutes}:${pad(Math.floor(seconds))}`;
  const tenths = Math.round(seconds * 10) / 10;
  return String(Number.isInteger(tenths) ? tenths.toFixed(0) : tenths.toFixed(1));
}

export function getClocksAtIndex(
  clocks: (string | undefined)[] | undefined,
  moveIndex: number
): { white: string | undefined; black: string | undefined } {
  if (!clocks || clocks.length === 0 || moveIndex < 0) {
    return { white: undefined, black: undefined };
  }
  let white: string | undefined;
  let black: string | undefined;
  const end = Math.min(moveIndex, clocks.length - 1);
  for (let i = 0; i <= end; i++) {
    const c = clocks[i];
    if (c === undefined) continue;
    if (i % 2 === 0) white = c;
    else black = c;
  }
  return { white, black };
}
