import { FC, useContext } from "react";
import { Chessboard } from "react-chessboard";
import { AppContext } from "./App";
import { Chess } from "chess.js";
import { Square } from "react-chessboard/dist/chessboard/types";

interface PieceProps {
  isDragging: boolean;
  squareWidth: number;
  square: string;
}
const customPieces = (theme: string): { [key: string]: FC<PieceProps> } => {
  const pieceNames = ["K", "Q", "R", "B", "N", "P"];

  const pieces: { [key: string]: FC<PieceProps> } = {};

  const base_path =
    "https://raw.githubusercontent.com/BibekBhusal0/CGR/557306e3ad6b55c87def1d5ce01b4e6f2095542b/public/images/pieces/";
  ["w", "b"].forEach((color) => {
    pieceNames.forEach((piece) => {
      pieces[`${color}${piece}`] = ({
        isDragging,
        squareWidth,
      }: PieceProps) => (
        <img
          className="aspect-square p-0.5 realtive"
          src={`${base_path}/${theme.toLowerCase()}/${color}${piece}.svg`}
          alt={`${color === "w" ? "White" : "Black"} ${piece}`}
          style={{
            width: squareWidth,
            height: squareWidth,
            opacity: isDragging ? 0.5 : 1,
          }}
        />
      );
    });
  });

  return pieces;
};

function JustBoard() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("can't get context");
  }
  const {
    state: {
      btheme,
      allowMoves,
      fen,
      bottom,
      animation,
      bestMove,
      Game,
      moveIndex,
      analysis,
      highlight,
      stage,
    },
  } = context;

  const arrow: [Square, Square, string?][] = [];
  const highlights: { [square: string]: React.CSSProperties } = {};

  if (stage === "third" && moveIndex !== -1) {
    if (Game !== undefined && highlight) {
      const { from, to } = Game.history({ verbose: true })[moveIndex];
      highlights[from] = { background: "rgba(255, 255, 0, 0.3)" };
      highlights[to] = { background: "rgba(255, 255, 0, 0.3)" };
    }
    if (bestMove && analysis !== undefined) {
      try {
        const chess = new Chess(fen);
        chess.move(analysis[moveIndex].bestMove);
        const { from, to } = chess.history({ verbose: true })[0];
        arrow.push([from, to, "green"]);
      } catch {}
    }
  }

  return (
    <Chessboard
      id="board"
      position={fen}
      arePiecesDraggable={allowMoves}
      customPieces={customPieces(btheme)}
      boardOrientation={bottom}
      animationDuration={animation ? 300 : 0}
      customArrows={arrow}
      customSquareStyles={highlights}
    />
  );
}

export default JustBoard;
