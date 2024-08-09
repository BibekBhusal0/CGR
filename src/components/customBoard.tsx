import { FC, useContext } from "react";
import { Chessboard } from "react-chessboard";
import { AppContext, ColorContext } from "../App";
import { Chess } from "chess.js";
import { Square } from "react-chessboard/dist/chessboard/types";
import MoveIcon, { AllIcons } from "../components/moveTypes";
import { getPieces } from "../Logic/pieces";

interface PieceProps {
  isDragging: boolean;
  squareWidth: number;
  square: Square;
}
type Review = { [key in Square]: AllIcons };

const customPieces = (
  theme: string,
  reviews: Review[]
): { [key: string]: FC<PieceProps> } => {
  const pieceNames = ["K", "Q", "R", "B", "N", "P"];
  const pieces: { [key: string]: FC<PieceProps> } = {};

  const base_path =
    "https://raw.githubusercontent.com/BibekBhusal0/CGR/557306e3ad6b55c87def1d5ce01b4e6f2095542b/public/images/pieces/";
  ["w", "b"].forEach((color) => {
    pieceNames.forEach((piece) => {
      pieces[`${color}${piece}`] = ({
        isDragging,
        squareWidth,
        square,
      }: PieceProps) => {
        const index = reviews.findIndex((obj) => square in obj);
        const review = index === -1 ? undefined : reviews[index][square];

        return (
          <div className="aspect-square size-full realtive overflow-visible">
            <img
              className="aspect-square p-0.5"
              src={`${base_path}/${theme.toLowerCase()}/${color}${piece}.svg`}
              alt={`${color === "w" ? "White" : "Black"} ${piece}`}
              style={{
                width: squareWidth,
                height: squareWidth,
                opacity: isDragging ? 0.5 : 1,
              }}
            />
            {review && (
              <div className="translate-x-[70%] translate-y-[-250%]">
                <MoveIcon type={review} />
              </div>
            )}
          </div>
        );
      };
    });
  });

  return pieces;
};

function JustBoard() {
  const context = useContext(AppContext);
  const colorContext = useContext(ColorContext);
  if (!context || !colorContext) {
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
      termination,
      analysis,
      highlight,
      stage,
      boardStage,
    },
  } = context;
  const {
    state: { colors },
  } = colorContext;
  const { light, dark } = colors[btheme];

  const arrow: [Square, Square, string?][] = [];
  const highlights: { [square: string]: React.CSSProperties } = {};
  const reviews: Review[] = [];

  if (stage === "third" && moveIndex !== -1 && boardStage === "normal") {
    if (Game !== undefined && analysis !== undefined) {
      const history = Game.history({ verbose: true });
      const type = analysis[moveIndex].moveType;
      const sq = history[moveIndex].to;
      reviews.push({ [sq]: type } as Review);

      if (moveIndex === history.length - 1 && termination !== undefined) {
        const whiteKing = getPieces(Game, "w", "k");
        const blackKing = getPieces(Game, "b", "k");
        const whiteKingSq = whiteKing[0].square;
        const blackKingSq = blackKing[0].square;

        if (!termination.winner) {
          reviews.push({ [whiteKingSq]: "draw" } as Review);
          reviews.push({ [blackKingSq]: "draw" } as Review);
        } else {
          reviews.push({
            [blackKingSq]:
              termination.winner === "b" ? "win" : termination.overBy,
          } as Review);
          reviews.push({
            [whiteKingSq]:
              termination.winner === "w" ? "win" : termination.overBy,
          } as Review);
        }
      }

      if (highlight) {
        const { from, to } = history[moveIndex];
        highlights[from] = { background: "rgba(255, 255, 0, 0.3)" };
        highlights[to] = { background: "rgba(255, 255, 0, 0.3)" };
      }
      if (bestMove) {
        const chess = new Chess(history[moveIndex].before);
        const moveOuptut = chess.move(analysis[moveIndex].bestMove);
        const { from, to } = moveOuptut;
        arrow.push([from, to, "green"]);
      }
    }
  }

  return (
    <Chessboard
      id="board"
      position={fen}
      //
      animationDuration={animation ? 300 : 0}
      arePiecesDraggable={allowMoves}
      boardOrientation={bottom}
      //
      customPieces={customPieces(btheme, reviews)}
      customArrows={arrow}
      customSquareStyles={highlights}
      //
      customLightSquareStyle={{ backgroundColor: light }}
      customDarkSquareStyle={{ backgroundColor: dark }}
    />
  );
}

export default JustBoard;
