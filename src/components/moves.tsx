import { FC, useContext, useEffect, useRef } from "react";
import { AppContext } from "../App";
import { CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Controls } from "./controls";

function Moves() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error();
  }
  const {
    state: { Game },
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
      <CardHeader className="bg-default-100">
        <MoveComment />
      </CardHeader>
      <CardBody>
        <div className="max-h-96 min-h-36 ">
          {Pears.map((p, rowIndex) => (
            <div className="flex" key={rowIndex}>
              <div className="text-lg basis-2/12 text-center">
                {rowIndex + 1}.
              </div>
              {p.map((move, colIndex) => {
                const i = rowIndex * 2 + colIndex;
                return <SingleMove key={colIndex} move={move} index={i} />;
              })}
            </div>
          ))}
        </div>
      </CardBody>
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
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (elementRef.current) {
      if (moveIndex === index) {
        elementRef.current.scrollIntoView();
      } else if (moveIndex === -1 && index === 0) {
        elementRef.current.scrollIntoView();
      }
    }
  }, [moveIndex, index]);
  const ClickHandler = () => {
    dispatch({ type: "SetIndex", index: index });
  };
  const cls = moveIndex === index ? "bg-default-300" : "bg-default-100 ";

  return (
    <div
      ref={elementRef}
      className={`${cls} basis-5/12 text-xl p-1 pl-4 cursor-pointer hover:bg-default-200`}
      onClick={ClickHandler}>
      {move}
    </div>
  );
};

const MoveComment: FC = () => {
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
  const comment =
    moveIndex === -1
      ? "Start Analyzing Game"
      : `${history[moveIndex]} was definately one of the moves`;
  return (
    <>
      <div className="text-xl ">
        <div>{comment}</div>
        <div>Move index is : {moveIndex}</div>
      </div>
    </>
  );
};

export default Moves;
