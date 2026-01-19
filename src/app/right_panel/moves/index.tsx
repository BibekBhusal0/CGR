import { FC, useEffect, useRef } from "react";
import { CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Controls } from "./controls";
import EvalGraph from "@/Logic/evalgraph";
import { MoveComment } from "./moveComment";
import { cn } from "@heroui/theme";
import { MoveIcon } from "@/components/moveTypes/MoveIcon";
import { useGameState } from "@/Logic/state/game";

function Moves() {
  const Game = useGameState((state) => state.Game);
  const changeState = useGameState((state) => state.changeState);
  if (!Game) {
    throw new Error();
  }
  const history = Game.history();
  const makePear = (moves: string[]) => {
    const movePears = [];
    for (let i = 0; i < moves.length; i += 2) {
      movePears.push(moves.slice(i, i + 2));
    }
    return movePears;
  };
  const Pears = makePear(history);

  return (
    <>
      <CardHeader className="bg-default-100 flex h-20 w-full flex-col justify-center px-3">
        <EvalGraph />
      </CardHeader>
      <CardBody>
        <div className="max-h-96 min-h-20 overflow-auto">
          {Pears.map((p, rowIndex) => (
            <div className="flex" key={rowIndex}>
              <div className="basis-2/12 text-center text-lg">{rowIndex + 1}.</div>
              {p.map((move, colIndex) => {
                const i = rowIndex * 2 + colIndex;
                return <SingleMove key={colIndex} move={move} index={i} />;
              })}
            </div>
          ))}
        </div>
      </CardBody>
      <CardFooter>
        <div className="align-center flex w-full flex-col justify-center gap-3 align-middle">
          <MoveComment />
          <Controls />
          <Button onPress={() => changeState("second")} variant="ghost" size="lg">
            <div className="text-2xl">Back</div>
          </Button>
        </div>
      </CardFooter>
    </>
  );
}

const SingleMove: FC<{ move: string; index: number }> = ({ move, index }) => {
  const moveIndex = useGameState((state) => state.moveIndex);
  const setIndex = useGameState((state) => state.setIndex);
  const analysis = useGameState((state) => state.analysis);

  let moveType;
  if (index !== -1 && analysis !== undefined) {
    moveType = analysis[index].moveType;
  }

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
    setIndex(index);
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "hover:bg-default-200 flex basis-5/12 cursor-pointer items-center gap-1 p-1 pl-4 text-xl",
        moveIndex === index ? "bg-default-300" : "bg-default-100"
      )}
      onClick={ClickHandler}>
      {moveType && <MoveIcon type={moveType} />}
      <div>{move}</div>
    </div>
  );
};

export default Moves;
