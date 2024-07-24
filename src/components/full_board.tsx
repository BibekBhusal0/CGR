import { Card } from "@nextui-org/react";
import { Chessboard } from "react-chessboard";
import { FC, useContext } from "react";
import { AppContext } from "../App";
import EvalBar from "./evalbar";

function FullBoard() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(
      "GeneralSettings must be used within an AppContext.Provider"
    );
  }
  const {
    state: {
      btheme,
      whitePlayer,
      blackPlayer,
      allowMoves,
      fen,
      bottom,
      animation,
    },
  } = context;

  return (
    <>
      <Card className="basis-5/12 px-5">
        <Player name={bottom === "white" ? blackPlayer : whitePlayer} />
        <div className="flex">
          <EvalBar></EvalBar>
          <Chessboard
            position={fen}
            customPieces={customPieces(btheme)}
            arePiecesDraggable={allowMoves}
            boardOrientation={bottom}
            animationDuration={animation ? 300 : 0}
            id="board"
          />
        </div>
        <Player name={bottom === "white" ? whitePlayer : blackPlayer} />
      </Card>
    </>
  );
}

type playerProps = { name: string };
const Player: FC<playerProps> = ({ name }) => {
  return <div className="text-2xl pl-6 py-2">{name}</div>;
};

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
          className="aspect-square p-1"
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

export default FullBoard;
