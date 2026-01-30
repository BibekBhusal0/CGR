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

export type isPinnedReturn = {
  pinned: boolean;
  type?: "relative" | "absolute" | "both";
};

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
const pieceDirections: Partial<Record<PieceSymbol, directions[]>> = {
  [ROOK]: rookMoves,
  [BISHOP]: bishopMoves,
  [QUEEN]: [...rookMoves, ...bishopMoves],
};

export interface PieceAndSquare extends Piece {
  square: Square;
}
// See what's behind a piece useful function to check pin/skewer
export function seeBehindPiece(
  from: Square,
  direction: directions,
  game: Chess
): PieceAndSquare | undefined {
  const fromCoor = notationToCoors(from);

  const delta: coors = {
    y: direction.includes("up") ? 1 : direction.includes("down") ? -1 : 0,
    x: direction.includes("right") ? 1 : direction.includes("left") ? -1 : 0,
  };

  // this case will not happen just to be extra safe to avoid infinite loop
  if (delta.x === 0 && delta.y === 0) return;
  const crr = {
    x: fromCoor.x + delta.x,
    y: fromCoor.y + delta.y,
  };

  while (crr.x <= 7 && crr.x >= 0 && crr.y >= 0 && crr.y <= 7) {
    const notation = coorsToNotation(crr);
    const sq = game.get(notation);
    if (sq) return { ...sq, square: notation };
    crr.x += delta.x;
    crr.y += delta.y;
  }
  return undefined;
}

// if piece are in line it returns direction.
export function getDirection(from: Square, to: Square): directions | undefined {
  const toCoor = notationToCoors(to);
  const fromCoor = notationToCoors(from);
  if (toCoor.x === fromCoor.x) return toCoor.y < fromCoor.y ? "down" : "up";
  if (toCoor.y === fromCoor.y) return toCoor.x < fromCoor.x ? "left" : "right";

  // If it is in diagonal delta will be equal
  const deltaX = fromCoor.x - toCoor.x;
  const deltaY = fromCoor.y - toCoor.y;
  if (Math.abs(deltaX) === Math.abs(deltaY)) {
    if (deltaX > 0 && deltaY > 0) return "down-left";
    if (deltaX < 0 && deltaY < 0) return "up-right";
    if (deltaX < 0 && deltaY > 0) return "down-right";
    if (deltaX > 0 && deltaY < 0) return "up-left";
  }
  return undefined;
}

export const notPinned: isPinnedReturn = { pinned: false, type: undefined };

export function isPinned(fen: string, square: Square): isPinnedReturn {
  let game;
  try {
    game = new Chess(fen, { skipValidation: true });
  } catch {
    return notPinned;
  }
  let relatively_pinned = false;
  let absolutely_pinned = false;
  const piece = game.get(square);
  if (!piece) return notPinned;
  const opp = getOpp(piece.color);
  const piecesThatCanPin: PieceSymbol[] = [QUEEN, BISHOP, ROOK];
  for (let pieceSymbol of piecesThatCanPin) {
    const oppPieces = game.findPiece({ type: pieceSymbol, color: opp });
    if (!oppPieces) continue;
    for (let oppPiece of oppPieces) {
      const direction = getDirection(oppPiece, square);
      if (!direction) continue;
      const behind = seeBehindPiece(square, direction, game);
    }
  }

  // return isPinnedByRook(fen, square)
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
