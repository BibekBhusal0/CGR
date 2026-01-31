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
  return color === WHITE ? BLACK : WHITE;
}

export const pieceValues: Record<PieceSymbol, number> = {
  [PAWN]: 1,
  [KNIGHT]: 3,
  [BISHOP]: 3,
  [ROOK]: 5,
  [QUEEN]: 9,
  [KING]: Infinity,
};
export const pieceNames: Record<PieceSymbol, string> = {
  [PAWN]: "pawn",
  [KNIGHT]: "knight",
  [BISHOP]: "bishop",
  [ROOK]: "rook",
  [QUEEN]: "queen",
  [KING]: "king",
};

export type isPinnedReturn = {
  type: "relative" | "absolute";
  targetPiece: PieceAndSquare;
  by: PieceAndSquare;
};

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
export const pieceDirections: Partial<Record<PieceSymbol, directions[]>> = {
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

export function isEmpty(game: Chess, from: Square, to: Square, direction: directions): boolean {
  const fromCoor = notationToCoors(from);

  const delta: coors = {
    y: direction.includes("up") ? 1 : direction.includes("down") ? -1 : 0,
    x: direction.includes("right") ? 1 : direction.includes("left") ? -1 : 0,
  };

  // this case will not happen just to be extra safe to avoid infinite loop
  if (delta.x === 0 && delta.y === 0) return false;
  const crr = {
    x: fromCoor.x + delta.x,
    y: fromCoor.y + delta.y,
  };

  while (crr.x <= 7 && crr.x >= 0 && crr.y >= 0 && crr.y <= 7) {
    const notation = coorsToNotation(crr);
    if (notation === to) return true;
    const piece = game.get(notation);
    if (piece) return false;
    crr.x += delta.x;
    crr.y += delta.y;
  }
  return true;
}

export function isPinned(fen: string, square: Square): isPinnedReturn | undefined {
  let game;
  try {
    game = new Chess(fen, { skipValidation: true });
  } catch {
    return;
  }
  const piece = game.get(square);
  if (!piece) return;
  const opp = getOpp(piece.color);
  const piecesThatCanPin: PieceSymbol[] = [QUEEN, BISHOP, ROOK];

  for (const pieceSymbol of piecesThatCanPin) {
    const oppPieces = game.findPiece({ type: pieceSymbol, color: opp });
    if (!oppPieces) continue;
    for (const oppPiece of oppPieces) {
      const direction = getDirection(oppPiece, square);
      if (!direction) continue;
      // Check if piece can move in that direction.
      if (!pieceDirections[pieceSymbol]?.includes(direction)) continue;
      // Path need to be clear for piece to be attacked
      if (!isEmpty(game, oppPiece, square, direction)) continue;
      const behind = seeBehindPiece(square, direction, game);
      // It should be our piece and piece with higher value
      if (!behind) continue;
      if (behind.color !== piece.color) continue;
      if (pieceValues[behind.type] > pieceValues[piece.type]) {
        let type: "relative" | "absolute" = "relative";
        if (behind.type === KING) type = "absolute";
        return {
          type,
          targetPiece: behind,
          by: { color: opp, square: oppPiece, type: pieceSymbol },
        };
      }
    }
  }
}

// Calculating if piece is hanging.

export function isPieceHanging(fen: string, square: Square): boolean {
  let game;
  try {
    game = new Chess(fen, { skipValidation: true });
  } catch {
    return false;
  }
  const piece = game.get(square);
  if (!piece) return false;
  const opp = getOpp(piece.color);
  const defenders = game.attackers(square, piece.color);
  const attackers = game.attackers(square, opp);
  let attackerCount = 0;
  let defenderCount = 0;
  // attacker
  for (const attacker_sq of attackers) {
    const attacker_piece = game.get(attacker_sq)
    if (!attacker_piece) continue
    // Check if piece is pinned
    const pinned = isPinned(game.fen(), attacker_sq)
    // Somethimes it can take the attacking piece even though pinned.
    if (pinned && pinned.by.square !== attacker_sq) continue
    // If pawn can take piece it's hanging
    if (attacker_piece.type === PAWN && piece.type !== PAWN) return true
    attackerCount++;
  }

  for (const defender_sq of defenders) {
    const defender_piece = game.get(defender_sq)
    if (!defender_piece) continue
    // Check if piece is pinned
    const pinned = isPinned(game.fen(), defender_sq)
    // Somethimes it can take the attacking piece even though pinned.
    if (pinned && pinned.by.square !== defender_sq) continue
    defenderCount++;
  }

  if (attackerCount > defenderCount) return true;
  return false;
}

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

export function isMoveLegal(fen: string, move: string): boolean {
  try {
    const game = new Chess(fen);
    game.move(move);
    return true;
  } catch {
    return false;
  }
}
