import { Chess, Color, Piece, PieceSymbol, Square } from "chess.js";

export const pieceValues: { [key in PieceSymbol]: number } = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: Infinity,
};

export const pieceNames: { [key in PieceSymbol]: string } = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king",
};

export const promotions = [undefined, "b", "n", "r", "q"];
