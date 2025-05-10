export type chessResults =
  | "win"
  | "lose"
  | "abandoned"
  | "checkmated"
  | "timeout"
  | "resigned"
  | "agreed"
  | "timevsinsufficient"
  | "stalemate"
  | "insufficient"
  | "repetition"
  | "50move";

export type gameRules =
  | "chess"
  | "chess960"
  | "bughouse"
  | "kingofthehill"
  | "threecheck"
  | "crazyhouse";


export type timeControls = "daily" | "rapid" | "blitz" | "bullet" | "classical";
export interface player {
  rating: number;
  username: string;
  result: chessResults;
}

export const lostResults: chessResults[] = [
  "checkmated",
  "lose",
  "timeout",
  "resigned",
  "abandoned",
];
export const drawResults: chessResults[] = [
  "agreed",
  "timevsinsufficient",
  "insufficient",
  "repetition",
  "stalemate",
  "50move",
];

export interface game {
  url: string;
  tcn: string;
  uuid: string;

  initial_setup: string;
  fen: string;
  pgn: string;
  rules: gameRules;

  time_class: timeControls;
  time_control: string;

  white: player;
  black: player;
}

export interface GameResponse {
  games: game[];
}

export interface ErrorResponse {
  code: number;
  message: string;
}

export type CDCresponse = {
  data: GameResponse | ErrorResponse;
  status: number;
};

export function isGameResponse(
  response: CDCresponse
): response is { data: GameResponse; status: number } {
  return (response.data as GameResponse).games !== undefined;
}

export async function gamesOnChessDotCom(
  userName: string,
  month: number,
  year: number
): Promise<CDCresponse> {
  const baseurl = "https://api.chess.com/pub/player/";
  const pad = month <= 9 ? "0" : "";
  const url = `${baseurl}${userName}/games/${year}/${pad}${month}`;

  const response = await fetch(url);
  const data = await response.json();

  return {
    data: data,
    status: response.status,
  };
}
