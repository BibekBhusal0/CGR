import {
  Chess,
  Color,
  Piece,
  PieceSymbol,
  Square,
  BLACK,
  WHITE,
  KING,
  QUEEN,
  KNIGHT,
  BISHOP,
  PAWN,
  ROOK,
} from "chess.js";

type coors = { x: number; y: number };
function notationToCoors(notation: Square): coors {
  return {
    x: "abcdefgh".indexOf(notation.slice(0, 1)),
    y: parseInt(notation.slice(1)) - 1,
  };
}
function coorsToNotation(coors: coors): Square {
  return ("abcdefgh".charAt(coors.x) + (coors.y + 1).toString()) as Square;
}

function getOpp(color: Color): Color {
  return color === "w" ? "b" : "w";
}

export const pieceValues: { [key in PieceSymbol]: number } = {
  [PAWN]: 1,
  [KNIGHT]: 3,
  [BISHOP]: 3,
  [ROOK]: 5,
  [QUEEN]: 9,
  [KING]: Infinity,
};
export const pieceNames: { [key in PieceSymbol]: string } = {
  [PAWN]: "pawn",
  [KNIGHT]: "knight",
  [BISHOP]: "bishop",
  [ROOK]: "rook",
  [QUEEN]: "queen",
  [KING]: "king",
};

export type isPinnedReturn = { pinned: boolean; type: undefined | "relative" | "absolute" | "both" };

function getPinType(absolutely_pinned: boolean, relatively_pinned: boolean): isPinnedReturn {
  return {
    pinned: absolutely_pinned && relatively_pinned,
    type:
      relatively_pinned && absolutely_pinned
        ? "both"
        : relatively_pinned || absolutely_pinned
          ? relatively_pinned
            ? "relative"
            : "absolute"
          : undefined,
  };
}

type directions =
  | "up"
  | "down"
  | "left"
  | "right"
  | "up-left"
  | "down-left"
  | "down-right"
  | "up-right";

const rookMoves: directions[] = ["up", "down", "left", "right"];
const bishopMoves: directions[] = ["up-left", "down-left", "up-right", "down-right"];

// See what's behind a piece useful function to check pin/skewer
function seeBehindPiece(from: coors, direction: directions, game: Chess): PieceSymbol | undefined {
  const fromPiece = game.get(coorsToNotation(from))
  if (!fromPiece) return


  const delta: coors = {
    y: direction.includes("up") ? 1 : direction.includes("down") ? -1 : 0,
    x: direction.includes("right") ? 1 : direction.includes("right") ? -1 : 0,
  };

  // this case will not happen just to be extra safe to avoid infinite loop
  if (delta.x === 0 && delta.y === 0) return;
  const crr = {
    x: from.x + delta.x,
    y: from.y + delta.y,
  }

  while (crr.x <= 9 && crr.y >= 1 && crr.y >= 1 && crr.y <= 9) {
    const notation = coorsToNotation(crr)
    const sq = game.get(notation)
    if (sq) {
      return sq.type
    }
    crr.x += delta.x;
    crr.y += delta.y;
  }
  return undefined;
}

export const notPinned: isPinnedReturn = { pinned: false, type: undefined };
function isPinnedByRook(fen: string, square: Square): isPinnedReturn {
  const game = new Chess(fen, { skipValidation: true });
  let relatively_pinned = false;
  let absolutely_pinned = false;
  const piece = game.get(square);
  if (!piece) return notPinned;
  const opp = getOpp(piece.color);
  // Find Opponent's rook
  const rooks = game.findPiece({ type: ROOK, color: opp });
  if (!rooks) return notPinned
  const pieceCoor = notationToCoors(square);

  for (let rookNotation of rooks) {
    const rookCoor = notationToCoors(rookNotation);
    // If not in same file/rank as rook it can't be pinned.
    if (rookCoor.x !== pieceCoor.x && rookCoor.y !== pieceCoor.y) continue;
  }
  return getPinType(absolutely_pinned, relatively_pinned);
}

// function isPinnedByBishop(fen: string, square: Square): isPinnedReturn { }
export function isPinned(fen: string, square: Square): isPinnedReturn {
  let game
  try {
    game = new Chess(fen, { skipValidation: true });
  } catch {
    return notPinned
  }
  // let relatively_pinned = false;
  // let absolutely_pinned = false;
  const piece = game.get(square);
  if (!piece) return notPinned
  // const piecesThatCanPin = [QUEEN, BISHOP, ROOK];

  return isPinnedByRook(fen, square)
  // return getPinType(absolutely_pinned, relatively_pinned);
}

// Calculating if piece is hanging.
export function isPieceHanging() { }

export function getMaterial(fen: string, color: Color) {
  const pieces = fen.split(" ")[1];
  if (!pieces) return 0;

  let material = 0;
  pieces.split("").forEach((p) => {
    if (p.toLowerCase() !== "k") {
      const isPieceWhite = p.toUpperCase() === p;
      if ((isPieceWhite && color === "w") || (!isPieceWhite && color !== "w")) {
        const value = pieceValues[p as PieceSymbol];
        if (value) material += value;
      }
    }
  });
  return material;
}

export const promotions = [undefined, "b", "n", "r", "q"];
