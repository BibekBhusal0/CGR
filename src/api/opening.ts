import openings from "./openings.json";

export interface LichessDatabaseResponse {
  opening: { eco: string; name: string };
  white: number;
  draws: number;
  black: number;
}

export function getOpeningName(fen: string) {
  const opening = openings.find((o) => fen.includes(o.fen));
  return opening;
}

export async function openingDatabase(
  fen: string,
  type: "master" | "lichess"
): Promise<LichessDatabaseResponse> {
  const url =
    type === "master"
      ? `https://explorer.lichess.ovh/masters?moves=0&topGames=0&fen=${fen}`
      : `https://explorer.lichess.ovh/lichess?moves=0&topGames=0&recentGames=0&fen=${fen}`;

  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error("opening position fetching failed from lichess");
  }
  const data: LichessDatabaseResponse = await response.json();
  return data;
}
