import { FC, useContext } from "react";
import { AppContext } from "../App";
import { CardFooter } from "@nextui-org/react";
import { Controls } from "./controls";

function Moves() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error();
  }
  const {
    state: { Game, moveIndex },
  } = context;
  if (!Game) {
    throw new Error();
  }
  const history = Game.history();
  const makePear = (moves: string[]) => {
    let movePears = [];
    for (let i = 0; i < moves.length; i += 2) {
      movePears.push(moves.slice(i, i + 2));
    }
    return movePears;
  };
  const Pears = makePear(history);

  return (
    <>
      <div>{moveIndex}</div>
      <div className="bg-default text-default-900 h-80 rounded-md p-3 overflow-y-scroll ">
        {Pears.map((p, rowIndex) => (
          <div className="flex" key={rowIndex}>
            <div className="text-lg basis-2/12 text-center">{rowIndex + 1}</div>
            {p.map((move, colIndex) => {
              const i = rowIndex * 2 + colIndex;
              return <SingleMove key={colIndex} move={move} index={i} />;
            })}
          </div>
        ))}
      </div>
      <CardFooter>
        <Controls />
      </CardFooter>
    </>
  );
}

const SingleMove: FC<{ move: string; index: number }> = ({ move, index }) => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error();
  }
  const {
    state: { moveIndex },
    dispatch,
  } = context;

  const ClickHandler = () => {
    dispatch({ type: "SetIndex", index: index });
  };
  const cls =
    moveIndex === index
      ? "bg-default-200 text-default-900"
      : "bg-default-100 text-default-800";

  return (
    <div
      className={`${cls} basis-5/12 text-xl p-1 cursor-pointer`}
      onClick={ClickHandler}>
      {move}
    </div>
  );
};

export default Moves;
