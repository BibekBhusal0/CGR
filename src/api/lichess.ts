import { timeControls } from "@/api/CDC";

export interface LichessUser {
  name: string;
  id: string;
}

export interface LichessPlayer {
  user?: LichessUser;
  rating?: number;
  ratingDiff?: number;
  aiLevel?: number;
}

export type LichessSpeed =
  "ultraBullet" | "bullet" | "blitz" | "rapid" | "classical" | "correspondence";

export type LichessStatus =
  | "created"
  | "started"
  | "aborted"
  | "mate"
  | "resign"
  | "stalemate"
  | "timeout"
  | "draw"
  | "outoftime"
  | "cheat"
  | "noStart"
  | "unknownFinish"
  | "variantEnd";

export interface LichessGame {
  id: string;
  rated: boolean;
  variant: string;
  speed: LichessSpeed;
  perf: string;
  createdAt: number;
  lastMoveAt?: number;
  status: LichessStatus;
  winner?: "white" | "black";
  players: {
    white: LichessPlayer;
    black: LichessPlayer;
  };
  moves?: string;
  pgn: string;
  clock?: { initial: number; increment: number };
  opening?: { eco?: string; name?: string; ply?: number };
}

export type LichessResponse =
  | { data: LichessGame[]; status: number }
  | { data: { error?: string; message?: string }; status: number };

export function lichessSpeedToTimeControl(speed: LichessSpeed): timeControls {
  switch (speed) {
    case "ultraBullet":
    case "bullet":
      return "bullet";
    case "blitz":
      return "blitz";
    case "rapid":
      return "rapid";
    case "classical":
      return "classical";
    case "correspondence":
      return "daily";
  }
}

export function isLichessGamesResponse(
  response: LichessResponse
): response is { data: LichessGame[]; status: number } {
  return Array.isArray(response.data);
}

export type SingleLichessResponse =
  | { data: LichessGame; status: number }
  | { data: { error?: string; message?: string }; status: number };

export function isSingleLichessGameResponse(
  response: SingleLichessResponse
): response is { data: LichessGame; status: number } {
  return (response.data as LichessGame).pgn !== undefined;
}

export async function getLichessGameById(gameId: string): Promise<SingleLichessResponse> {
  const params = new URLSearchParams({
    pgnInJson: "true",
    clocks: "true",
    opening: "true",
  });
  const url = `https://lichess.org/game/export/${encodeURIComponent(gameId.trim())}?${params.toString()}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  const data = await response.json();
  return { data, status: response.status };
}

export async function getLichessGamesOfPlayer(
  userName: string,
  month: number,
  year: number,
  max: number = 200
): Promise<LichessResponse> {
  const since = new Date(year, month - 1, 1).getTime();
  const until = new Date(year, month, 1).getTime();
  const params = new URLSearchParams({
    since: String(since),
    until: String(until),
    max: String(max),
    pgnInJson: "true",
    clocks: "true",
    opening: "true",
  });
  const url = `https://lichess.org/api/games/user/${encodeURIComponent(
    userName.trim()
  )}?${params.toString()}`;

  const response = await fetch(url, {
    headers: { Accept: "application/x-ndjson" },
  });

  if (!response.ok) {
    let data: { error?: string; message?: string } = {};
    try {
      data = await response.json();
    } catch {
      try {
        const text = await response.text();
        data = { message: text };
      } catch {
        data = {};
      }
    }
    return { data, status: response.status };
  }

  const text = await response.text();
  const games: LichessGame[] = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      games.push(JSON.parse(trimmed) as LichessGame);
    } catch {}
  }
  return { data: games, status: response.status };
}
