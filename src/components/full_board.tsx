import { Card } from "@nextui-org/react";
import { FC, useContext } from "react";
import { AppContext } from "../App";
import EvalBar from "./evalbar";
import JustBoard from "../customBoard";

function FullBoard() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("can't get context");
  }
  const {
    state: { whitePlayer, blackPlayer, bottom, evalbar },
  } = context;

  return (
    <Card className="basis-5/12 px-5">
      <div className="flex w-full h-full gap-1">
        {evalbar && <EvalBar></EvalBar>}
        <div className="w-full h-full">
          <Player name={bottom === "white" ? blackPlayer : whitePlayer} />
          <JustBoard></JustBoard>
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
