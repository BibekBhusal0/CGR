import { FC, useContext, useEffect, useRef } from "react";
import { AppContext } from "../App";
import { Button, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Controls } from "./controls";
import EvalGraph from "../Logic/evalgraph";
import { MoveComment } from "./moveComment";

function Moves() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error();
  }
  const {
    state: { Game },
    dispatch,
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
      <CardHeader className="bg-default-100 flex flex-col justify-center w-full px-3 h-20">
        <EvalGraph />
      </CardHeader>
      <CardBody>
        <div className="max-h-96 min-h-20 overflow-auto">
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
        <div className="flex flex-col gap-3 align-center align-middle justify-center w-full">
          <MoveComment />
          <Controls />
          <Button
            onPress={() => dispatch({ type: "ChangeState", stage: "second" })}
            variant="ghost"
            size="lg">
            <div className="text-xl">Back</div>
          </Button>
        </div>
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

export default Moves;
