import { useContext } from "react";
import MoveType, { allTypesOfMove, MoveMaping } from "./moveTypes";
import { AppContext } from "../App";
import { Button } from "@nextui-org/react";

function Summary() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error();
  }
  const {
    dispatch,
    state: { whitePlayer, blackPlayer },
  } = context;
  const handleClick = () => {
    dispatch({ type: "ChangeState", stage: "third" });
  };
  return (
    <div className="flex flex-col gap-3 justify-center">
      <div className="flex justify-between gap-3 text-xl">
        {whitePlayer}
        vs
        {blackPlayer}
      </div>
      {allTypesOfMove.map((m) => (
        <div key={m} className="flex capetalize text-xl justify-between px-4">
          <div>0</div>
          <div className="flex gap-3">
            <div style={{ color: MoveMaping[m].color }} className=" capitalize">
              {m}
            </div>
            <MoveType type={m} />
          </div>
          <div>0</div>
        </div>
      ))}
      <div>
        <Button
          className=" text-xl"
          onClick={handleClick}
          variant="ghost"
          color="primary">
          Start analyzing
        </Button>
      </div>
    </div>
  );
}

export default Summary;
