import { Card } from "@nextui-org/card";
import { FC } from "react";
import EvalBar from "../Logic/evalbar";
import JustBoard from "./customBoard";
import { useSelector } from "react-redux";
import { StateType } from "@/Logic/reducers/store";

function FullBoard() {
  const { whitePlayer, blackPlayer, bottom } = useSelector(
    (state: StateType) => state.game
  );

  return (
    <Card className="basis-6/12 lg:basis-5/12 px-5">
      <div className="flex gap-1 relative h-full w-full">
        <EvalBar />
        <div className=" h-full max-h-screen w-full">
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
  return <div className="text-2xl pl-6 py-2">{name}</div>;
};

export default FullBoard;
