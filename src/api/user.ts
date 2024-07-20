export interface player {
  rating: number;
  username: string;
  result: string;
}

export interface game {
  url: string;
  pgn: string;
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
  const pad = month <= 8 ? "0" : "";
  const url = `${baseurl}${userName}/games/${year}/${pad}${month + 1}`;

  const response = await fetch(url);
  const data = await response.json();

  return {
    data: data,
    status: response.status,
  };
}
