import { Card } from "@heroui/card";
import { FC } from "react";
import EvalBar from "./evalbar";
import JustBoard from "./customBoard";
import { useGameState } from "@/Logic/state/game";

function FullBoard() {
  const whitePlayer = useGameState((state) => state.whitePlayer);
  const blackPlayer = useGameState((state) => state.blackPlayer);
  const bottom = useGameState((state) => state.bottom);

  return (
    <Card className="px-5 ">
      <div className="relative flex h-full w-full gap-1">
        <EvalBar />
        <div className="h-full max-h-screen w-full">
          <Player name={bottom === "white" ? blackPlayer : whitePlayer} />
          <JustBoard />
          <Player name={bottom === "white" ? whitePlayer : blackPlayer} />
        </div>
      </div>
    </Card>
  );
}

type playerProps = { name: string };
const Player: FC<playerProps> = ({ name }) => {
  return <div className="py-2 pl-6 text-2xl">{name}</div>;
};

export default FullBoard;
