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

// Laser pieces are pieces which can move straight
// And can't jumb between pieces.
// Those pieces can pin
const lp = [ROOK, QUEEN, BISHOP] as const;
type laserPieces = (typeof lp)[number];
export const allLaserPieces: laserPieces[] = [...lp];

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

const t = [
  "up",
  "down",
  "left",
  "right",
  "up-left",
  "down-left",
  "down-right",
  "up-right",
] as const;

type directions = (typeof t)[number];
const allDirections: directions[] = [...t];

const rookMoves: directions[] = ["up", "down", "left", "right"];
const bishopMoves: directions[] = ["up-left", "down-left", "up-right", "down-right"];
export const pieceDirections: Record<laserPieces, directions[]> = {
  [ROOK]: rookMoves,
  [BISHOP]: bishopMoves,
  [QUEEN]: [...rookMoves, ...bishopMoves],
};

export function getXrayAttackers(game: Chess, square: Square, color: Color): Square[] {
  const coor = notationToCoors(square);
  const xrayAttackers: Square[] = [];
  const opp = getOpp(color);
  for (const direction of allDirections) {
    let striked = false; // Can only strike one time
    const delta = getDelta(direction);
    const crr = {
      x: coor.x + delta.x,
      y: coor.y + delta.y,
    };
    function increment() {
      crr.x += delta.x;
      crr.y += delta.y;
    }
    while (crr.x <= 7 && crr.x >= 0 && crr.y >= 0 && crr.y <= 7) {
      const crrNotation = coorsToNotation(crr);
      const p = game.get(crrNotation);
      if (!p) {
        increment();
        continue;
      }
      const piece = p.type as laserPieces;
      if (p.type === PAWN) {
        // Pawn can only capture diagonally
        if (!bishopMoves.includes(direction)) break;
        // Pawn an only capture 1 square
        if (Math.abs(coor.y - crr.y) !== 1) break;
        // Pawn can only capture forward
        const canPawnCapture = p.color === WHITE ? crr.y < coor.y : crr.y > coor.y;
        // p.color === WHITE ? direction.includes("down") : direction.includes("up");
        if (canPawnCapture) {
          striked = true;
          increment();
          continue;
        } else break;
      } else if (!allLaserPieces.includes(piece)) break;
      if (!pieceDirections[piece].includes(direction)) break;
      if (striked) {
        if (p.color === opp) break;
        xrayAttackers.push(crrNotation);
      }
      striked = true; //  Can't strike twice
      increment();
    }
  }
  return xrayAttackers;
}

type attackerType = {
  square: Square;
  type: "direct" | "x-ray";
  value: number;
};

function getAllAttackers(game: Chess, square: Square, color: Color): attackerType[] {
  const directAttackers = game.attackers(square, color);
  const xrayAttackers = getXrayAttackers(game, square, color);
  const attackers: attackerType[] = [];
  // Pinned piece can't attack
  directAttackers.forEach((a) => {
    const pinned = isPinned(game.fen(), a);
    // Somethimes it can take the attacking piece even though pinned.
    if (pinned && pinned.by.square !== square) {
    } else {
      const piece = game.get(a)?.type;
      if (piece) {
        const value = pieceValues[piece];
        attackers.push({ square: a, type: "direct", value });
      }
    }
  });

  const opp = getOpp(color);
  // X-ray attack through pinned piece don't count
  xrayAttackers.forEach((a) => {
    const inBetween = getPiecesBetween(game, a, square);
    // Pinned pieces are not pushed into attackers array
    // So if it is not if attacker arry its pinned.
    const pinned = inBetween.every((b) => {
      // We are not adding opponent's piece in attacker array but xray attack can be done through attackers piece as well
      if (b.color === opp) return false;
      return !attackers.some((c) => b.square === c.square);
    });
    const piece = game.get(a)?.type;
    if (piece && !pinned) {
      const value = pieceValues[piece];
      attackers.push({ square: a, type: "x-ray", value });
    }
  });

  return attackers;
}

function getDelta(direction: directions) {
  return {
    y: direction.includes("up") ? 1 : direction.includes("down") ? -1 : 0,
    x: direction.includes("right") ? 1 : direction.includes("left") ? -1 : 0,
  };
}

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

  const delta = getDelta(direction);

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

export function isEmpty(game: Chess, from: Square, to: Square): boolean {
  return getPiecesBetween(game, from, to).length === 0;
}

export function getPiecesBetween(game: Chess, from: Square, to: Square): PieceAndSquare[] {
  const fromCoor = notationToCoors(from);
  const toCoor = notationToCoors(to);
  const delta = {
    x: Math.sign(toCoor.x - fromCoor.x),
    y: Math.sign(toCoor.y - fromCoor.y),
  };
  const inBetween: PieceAndSquare[] = [];

  // this case will not happen just to be extra safe to avoid infinite loop
  if (delta.x === 0 && delta.y === 0) return inBetween;
  const crr = {
    x: fromCoor.x + delta.x,
    y: fromCoor.y + delta.y,
  };

  // to avoid infinite loop Just in case squares don't line up (not going outside board)
  while (crr.x <= 7 && crr.x >= 0 && crr.y >= 0 && crr.y <= 7) {
    const notation = coorsToNotation(crr);
    if (notation === to) break;
    const piece = game.get(notation);
    if (piece) inBetween.push({ ...piece, square: notation });
    crr.x += delta.x;
    crr.y += delta.y;
  }
  return inBetween;
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

  for (const pieceSymbol of allLaserPieces) {
    const oppPieces = game.findPiece({ type: pieceSymbol, color: opp });
    if (!oppPieces) continue;
    for (const oppPiece of oppPieces) {
      const direction = getDirection(oppPiece, square);
      if (!direction) continue;
      // Check if piece can move in that direction.
      if (!pieceDirections[pieceSymbol]?.includes(direction)) continue;
      // Path need to be clear for piece to be attacked
      if (!isEmpty(game, oppPiece, square)) continue;
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
  const pieceValue = pieceValues[piece.type];
  const opp = getOpp(piece.color);
  const defenders = getAllAttackers(game, square, piece.color);
  const attackers = getAllAttackers(game, square, opp);

  // If being attacked directly by lower value piece it's hanging
  if (attackers.some((a) => a.type === "direct" && a.value < pieceValue)) return true;

  // If single direct defender is lower value than all attacker not hanging
  const lowestValueAttacker = Math.min(
    ...attackers.filter((a) => a.type === "direct").map((a) => a.value)
  );
  if (defenders.some((d) => d.type === "direct" && d.value < lowestValueAttacker)) return false;

  if (attackers.length > defenders.length) return true;
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

export type allPinnedPiecesType = Partial<Record<Square, isPinnedReturn>>;
export function getAllPinnedPieces(game: Chess): allPinnedPiecesType {
  const piecesToCheck: PieceSymbol[] = [KNIGHT, ROOK, QUEEN, PAWN];
  const allPinnedPieces: allPinnedPiecesType = {};
  for (const pieceName of piecesToCheck) {
    const allWhitePieces = game.findPiece({ type: pieceName, color: WHITE });
    const allBlackPieces = game.findPiece({ type: pieceName, color: BLACK });
    const allPiece = [...allWhitePieces, ...allBlackPieces];
    for (const piece of allPiece) {
      const p = isPinned(game.fen(), piece);
      if (p) allPinnedPieces[piece] = p;
    }
  }
  return allPinnedPieces;
}

export function getAllHangingPieces(game: Chess): Square[] {
  const piecesToCheck: PieceSymbol[] = [KNIGHT, ROOK, QUEEN, PAWN];
  const allPinnedPieces: Square[] = [];
  for (const pieceName of piecesToCheck) {
    const allWhitePieces = game.findPiece({ type: pieceName, color: WHITE });
    const allBlackPieces = game.findPiece({ type: pieceName, color: BLACK });
    const allPiece = [...allWhitePieces, ...allBlackPieces];
    for (const sq of allPiece) {
      const p = isPieceHanging(game.fen(), sq);
      if (p) allPinnedPieces.push(sq);
    }
  }
  return allPinnedPieces;
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
