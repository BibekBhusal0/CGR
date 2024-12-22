import { Chessboard } from "react-chessboard";
import { FC } from "react";
import { Chess } from "chess.js";
import { Square } from "react-chessboard/dist/chessboard/types";
import MoveIcon, { AllIcons } from "../components/moveTypes";
import { getPieces } from "../Logic/pieces";
import { boardThemes } from "@/Logic/reducers/settings";
import { useSelector } from "react-redux";
import { StateType } from "@/Logic/reducers/store";

interface PieceProps {
  isDragging: boolean;
  squareWidth: number;
  square: Square;
}
type Review = { [key in Square]: AllIcons };

const colors: Record<boardThemes, { light: string; dark: string }> = {
  default: { light: "#f0d2ad", dark: "#654e2f" },
  ocean: { light: "#D5E0E6", dark: "#6aa4c8" },
  wood: { light: "#c8ac89", dark: "#6e543f" },
  geometric: { light: "#C7C3AB", dark: "#77534c" },
  cosmos: { light: "#94a1ad", dark: "#464c53" },
  dash: { light: "#EDF3F4", dark: "#7e8a99" },
  glass: { light: "#dbdbdb", dark: "#687578" },
  nature: { light: "#c4d49b", dark: "#68926f" },
};
export const base_path =
  "https://raw.githubusercontent.com/BibekBhusal0/CGR/23fab2b83de03e68e9f496b98b1001d420142513/public/images/pieces/";

const customPieces = (
  theme: string,
  reviews: Review[]
): { [key: string]: FC<PieceProps> } => {
  const pieceNames = ["K", "Q", "R", "B", "N", "P"];
  const pieces: { [key: string]: FC<PieceProps> } = {};

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
  const {
    allowMoves,
    fen,
    bottom,
    Game,
    moveIndex,
    termination,
    analysis,
    stage,
    boardStage,
  } = useSelector((state: StateType) => state.game);
  const { animation, bestMove, btheme, highlight } = useSelector(
    (state: StateType) => state.settings
  );

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
