import "cm-chessboard/assets/chessboard.css";
import { Card } from "@nextui-org/react";
import { Chessboard } from "react-chessboard";
import { FC, useContext } from "react";
import { AppContext } from "../App";
import GameSelect from "./game_select";

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
      currentfen,
      bottom,
      stage,
    },
  } = context;

  return (
    <>
      <Card className="basis-5/12 px-5">
        <Player name={blackPlayer} />

        <Chessboard
          position={currentfen}
          customPieces={customPieces(btheme)}
          arePiecesDraggable={allowMoves}
          boardOrientation={bottom}
          id="board"
        />
        <Player name={whitePlayer} />
      </Card>
      {stage === "second" && <GameSelect />}
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
    "https://raw.githubusercontent.com/BibekBhusal0/Chess/main/public/Images/pieces/";
  ["w", "b"].forEach((color) => {
    pieceNames.forEach((piece) => {
      pieces[`${color}${piece}`] = ({
        isDragging,
        squareWidth,
      }: PieceProps) => (
        <img
          className="aspect-square p-1"
          src={`${base_path}/${theme.toLowerCase()}/${color}${piece}.png`}
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
