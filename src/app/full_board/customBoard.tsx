import { Arrow, Chessboard, PieceRenderObject, SquareHandlerArgs } from "react-chessboard";
import { FC } from "react";
import { Chess, Square } from "chess.js";
import { useSettingsState } from "@/Logic/state/settings";
import { AllIcons } from "@/components/moveTypes/types";
import { MoveIcon } from "@/components/moveTypes/MoveIcon";
import { useGameState } from "@/Logic/state/game";
import { cn } from "@heroui/react";
import { isLightSquare } from "@/Logic/pieces";

interface PieceProps {
  isDragging: boolean;
  squareWidth: number;
  square: Square;
}
type Review = Partial<Record<Square, AllIcons>>;

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

type squareRendererType = ({
  piece,
  square,
  children,
}: SquareHandlerArgs & {
  children?: React.ReactNode;
}) => React.JSX.Element;

function Board({
  arrows,
  squareRenderer,
}: {
  arrows?: Arrow[];
  squareRenderer?: squareRendererType;
}) {
  const allowMoves = useGameState((state) => state.allowMoves);
  const fen = useGameState((state) => state.fen);
  const bottom = useGameState((state) => state.bottom);
  const theme = useSettingsState((state) => state.theme);
  const animation = useSettingsState((state) => state.animation);
  const notationStyle = useSettingsState((state) => state.notationStyle);

  const baseSquareRenderer: squareRendererType = squareRenderer
    ? squareRenderer
    : ({ children }: SquareHandlerArgs & { children?: React.ReactNode }) => <>{children}</>;

  let newSquareRenderer: squareRendererType = baseSquareRenderer;

  if (notationStyle === "in-square") {
    newSquareRenderer = ({
      square,
      piece,
      children,
    }: SquareHandlerArgs & { children?: React.ReactNode }) => {
      return (
        <>
          {baseSquareRenderer({ piece, square, children })}
          {!children && (
            <div
              className="absolute-center md:text-md text-xs select-none md:font-bold"
              style={{
                color: isLightSquare(square as Square)
                  ? "var(--board-dark-square)"
                  : "var(--board-light-square)",
              }}>
              {square}
            </div>
          )}
        </>
      );
    };
  }

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
        pieces: customPieces(theme) as PieceRenderObject,
        arrows: arrows,
        squareRenderer: newSquareRenderer,
        //
        lightSquareStyle: { backgroundColor: "var(--board-light-square)" },
        darkSquareStyle: { backgroundColor: "var(--board-dark-square)" },
        darkSquareNotationStyle: { color: "var(--board-light-square)" },
        lightSquareNotationStyle: { color: "var(--board-dark-square)" },
      }}
    />
  );
}

function MainBoard() {
  const Game = useGameState((state) => state.Game);
  const moveIndex = useGameState((state) => state.moveIndex);
  const termination = useGameState((state) => state.termination);
  const analysis = useGameState((state) => state.analysis);
  const stage = useGameState((state) => state.stage);
  const boardStage = useGameState((state) => state.boardStage);
  const bestMove = useSettingsState((state) => state.bestMove);
  const highlight = useSettingsState((state) => state.highlight);

  const arrows: Arrow[] = [];
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
      if (bestMove) {
        const chess = new Chess(history[moveIndex].before);
        const moveOuptut = chess.move(analysis[moveIndex].bestMove);
        const { from, to } = moveOuptut;
        arrows.push({ startSquare: from, endSquare: to, color: "green" });
      }
    }
  }

  const squareRenderer: squareRendererType = ({ children, square }) => {
    const highlightThis = highlights.includes(square);
    const review = reviews[square as Square];
    return (
      <div className={cn(highlightThis && "bg-[rgba(255,0,0,0.1)]", "relative size-full")}>
        {review && (
          <div className="absolute -top-3 -right-3 z-50 scale-90 text-xl">
            <MoveIcon type={review} />
          </div>
        )}
        {children}
      </div>
    );
  };

  return <Board arrows={[...arrows]} {...{ squareRenderer }} />;
}

function PerMoveAnalysisBoard() {
  const Game = useGameState((state) => state.Game);
  const moveIndex = useGameState((state) => state.moveIndex);
  const termination = useGameState((state) => state.termination);
  const analysis = useGameState((state) => state.analysis);
  const hangingPieces: Square[] = [];

  const arrows: Arrow[] = [];
  const highlights: string[] = [];
  const reviews: Review = {};

  if (Game !== undefined && analysis !== undefined && moveIndex !== -1 && analysis[moveIndex + 1]) {
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

    const { from: Hfrom, to: Hto } = history[moveIndex];
    highlights.push(Hfrom, Hto);
    const pins = analysis[moveIndex + 1]?.pinnedPieces;
    if (pins) {
      for (const sq in pins) {
        const p = pins[sq as Square];
        if (p)
          arrows.push({
            startSquare: p.by.square,
            endSquare: p.targetPiece.square,
            color: "red",
          });
      }
    }
    const hp = analysis[moveIndex + 1]?.hangingPieces;
    if (hp) hangingPieces.push(...hp.b, ...hp.w);
    const chess = new Chess(history[moveIndex].before);
    const moveOuptut = chess.move(analysis[moveIndex].bestMove);
    const { from, to } = moveOuptut;
    arrows.push({ startSquare: from, endSquare: to, color: "green" });
  }

  const squareRenderer: squareRendererType = ({ children, square }) => {
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
        {review && (
          <div className="absolute -top-3 -right-3 z-50 scale-90 text-xl">
            <MoveIcon type={review} />
          </div>
        )}
        {children}
      </div>
    );
  };

  return <Board arrows={[...arrows]} {...{ squareRenderer }} />;
}

function JustBoard() {
  const analyzePerMove = useSettingsState((state) => state.analyzePerMove);
  return <>{analyzePerMove ? <PerMoveAnalysisBoard /> : <MainBoard />}</>;
}
export default JustBoard;
