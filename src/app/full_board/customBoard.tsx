import { Arrow, Chessboard, PieceRenderObject, SquareHandlerArgs } from "react-chessboard";
import { FC } from "react";
import { Chess, Square } from "chess.js";
import { boardThemes, useSettingsState } from "@/Logic/state/settings";
import { AllIcons } from "@/components/moveTypes/types";
import { MoveIcon } from "@/components/moveTypes/MoveIcon";
import { useGameState } from "@/Logic/state/game";
import { cn } from "@heroui/theme";
import { isLightSquare } from "@/Logic/pieces";

interface PieceProps {
  isDragging: boolean;
  squareWidth: number;
  square: Square;
}
type Review = Partial<Record<Square, AllIcons>>;

const colors: Record<boardThemes, { light: string; dark: string }> = {
  default: { light: "#f0d2ad", dark: "#654e2f" },
  ocean: { light: "#D5E0E6", dark: "#6aa4c8" },
  wood: { light: "#c8ac89", dark: "#6e543f" },
  geometric: { light: "#C7C3AB", dark: "#77534c" },
  cosmos: { light: "#94a1ad", dark: "#464c53" },
  dash: { light: "#EDF3F4", dark: "#7e8a99" },
  nature: { light: "#c4d49b", dark: "#68926f" },
};
export const base_path =
  "https://raw.githubusercontent.com/BibekBhusal0/CGR/e3bc436ef9d23fc37ad0d9364b3d7fd697963ee3/public/images/pieces/";

const customPieces = (theme: string): { [key: string]: FC<PieceProps> } => {
  const pieceNames = ["K", "Q", "R", "B", "N", "P"];
  const pieces: { [key: string]: FC<PieceProps> } = {};

  ["w", "b"].forEach((color) => {
    pieceNames.forEach((piece) => {
      pieces[`${color}${piece}`] = () => {
        return (
          <img
            className="z-20 p-0.5 select-none"
            src={`${base_path}/${theme.toLowerCase()}/${color}${piece}.svg`}
            alt={`${color === "w" ? "White" : "Black"} ${piece}`}
          />
        );
      };
    });
  });

  return pieces;
};

function JustBoard() {
  const allowMoves = useGameState((state) => state.allowMoves);
  const fen = useGameState((state) => state.fen);
  const bottom = useGameState((state) => state.bottom);
  const Game = useGameState((state) => state.Game);
  const moveIndex = useGameState((state) => state.moveIndex);
  const termination = useGameState((state) => state.termination);
  const analysis = useGameState((state) => state.analysis);
  const stage = useGameState((state) => state.stage);
  const boardStage = useGameState((state) => state.boardStage);
  const animation = useSettingsState((state) => state.animation);
  const highlightPins = useSettingsState((state) => state.highlightPins);
  const highlightHangingPieces = useSettingsState((state) => state.highlightHangingPieces);
  const bestMove = useSettingsState((state) => state.bestMove);
  const btheme = useSettingsState((state) => state.btheme);
  const highlight = useSettingsState((state) => state.highlight);
  const notationStyle = useSettingsState((state) => state.notationStyle);
  const hangingPieces: Square[] = [];

  const { light, dark } = colors[btheme];

  const arrows: Arrow[] = [];
  const pins: Arrow[] = [];
  const highlights: string[] = [];
  const reviews: Review = {};

  if (stage === "third" && moveIndex !== -1 && boardStage === "normal") {
    if (Game !== undefined && analysis !== undefined) {
      const history = Game.history({ verbose: true });
      const type = analysis[moveIndex + 1].moveType;
      const sq = history[moveIndex].to;
      reviews[sq] = type;

      if (moveIndex === history.length - 1 && termination !== undefined) {
        const whiteKingSq = Game.findPiece({ type: "k", color: "w" })[0];
        const blackKingSq = Game.findPiece({ type: "k", color: "b" })[0];

        if (!termination.winner) {
          reviews[whiteKingSq] = "draw";
          reviews[blackKingSq] = "draw";
        } else {
          reviews[blackKingSq] = termination.winner === "b" ? "win" : termination.overBy;
          reviews[whiteKingSq] = termination.winner === "w" ? "win" : termination.overBy;
        }
      }

      if (highlight) {
        const { from, to } = history[moveIndex];
        highlights.push(from, to);
      }
      if (highlightPins) {
        const hp = analysis[moveIndex + 1]?.pinnedPieces;
        if (hp) {
          for (let sq in hp) {
            const p = hp[sq as Square];
            if (p)
              pins.push({
                startSquare: p.by.square,
                endSquare: p.targetPiece.square,
                color: "red",
              });
          }
        }
      }
      if (highlightHangingPieces) {
        const hp = analysis[moveIndex + 1]?.hangingPieces;
        if (hp) hangingPieces.push(...hp);
      }
      if (bestMove) {
        const chess = new Chess(history[moveIndex].before);
        const moveOuptut = chess.move(analysis[moveIndex].bestMove);
        const { from, to } = moveOuptut;
        arrows.push({ startSquare: from, endSquare: to, color: "green" });
      }
    }
  }

  const squareRenderer = ({
    children,
    square,
  }: SquareHandlerArgs & { children?: React.ReactNode }) => {
    const highlightThis = highlights.includes(square);
    const isHanging = hangingPieces.includes(square as Square);
    const review = reviews[square as Square];
    return (
      <div
        className={cn(
          highlightThis && "bg-[rgba(255,0,0,0.1)]",
          isHanging && "bg-[rgba(0,255,0,0.5)]",
          "relative size-full"
        )}>
        {notationStyle === "in-square" && !children && (
          <div
            className="absolute-center md:text-md text-xs select-none md:font-bold"
            style={{ color: isLightSquare(square as Square) ? dark : light }}>
            {square}
          </div>
        )}
        {review && (
          <div className="absolute -top-3 -right-3 z-50 scale-90 text-xl">
            <MoveIcon type={review} />
          </div>
        )}
        {children}
      </div>
    );
  };

  return (
    <Chessboard
      options={{
        id: "board",
        position: fen,
        //
        allowDragging: allowMoves,
        boardOrientation: bottom,
        animationDurationInMs: animation ? 300 : 0,
        showNotation: notationStyle === "in-board",
        //
        arrows: [...arrows, ...pins],
        pieces: customPieces(btheme) as PieceRenderObject,
        squareRenderer: squareRenderer,
        //
        lightSquareStyle: { backgroundColor: light },
        darkSquareStyle: { backgroundColor: dark },
        darkSquareNotationStyle: { color: light },
        lightSquareNotationStyle: { color: dark },
      }}
    />
  );
}

export default JustBoard;
