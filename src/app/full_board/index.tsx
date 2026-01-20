import { Card } from "@heroui/card";
import { FC } from "react";
import EvalBar from "./evalbar";
import JustBoard from "./customBoard";
import { useGameState } from "@/Logic/state/game";

function FullBoard() {
  return (
    <Card className="px-4">
      <div className="relative flex size-full gap-1">
        <EvalBar />
        <div className="size-full">
          <Player position="top" />
          <JustBoard />
          <Player position="bottom" />
        </div>
      </div>
    </Card>
  );
}

type playerProps = { position: "top" | "bottom" };

const Player: FC<playerProps> = ({ position }) => {
  const whitePlayer = useGameState((state) => state.whitePlayer);
  const blackPlayer = useGameState((state) => state.blackPlayer);
  const bottom = useGameState((state) => state.bottom);
  const name =
    (position === "bottom" && bottom === "white") || (position === "top" && bottom === "black")
      ? whitePlayer
      : blackPlayer;

  return <div className="py-2 pl-6 text-2xl">{name || ""}</div>;
};

export default FullBoard;
