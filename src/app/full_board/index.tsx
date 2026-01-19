import { Card } from "@heroui/card";
import { FC } from "react";
import EvalBar from "./evalbar";
import JustBoard from "./customBoard";
import { useSelector } from "react-redux";
import { StateType } from "@/Logic/state/store";

function FullBoard() {
  const { whitePlayer, blackPlayer, bottom } = useSelector((state: StateType) => state.game);

  return (
    <Card className="basis-6/12 px-5 lg:basis-5/12">
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
