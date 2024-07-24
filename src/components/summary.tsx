import { FC, useContext, useEffect, useState } from "react";
import MoveIcon, { allTypesOfMove, MoveMaping, MT } from "./moveTypes";
import { AppContext } from "../App";
import { Button, Progress } from "@nextui-org/react";
import StockfishManager from "../Logic/stockfish";

function Summary() {
  const context = useContext(AppContext);
  const [progress, setProgress] = useState(0);
  const loading = !(progress === 1);
  const [analysis, setAnalysis] = useState<any[]>([]);
  if (!context) {
    throw new Error();
  }
  const {
    dispatch,
    state: { whitePlayer, blackPlayer, Game, depth },
  } = context;
  if (!Game) {
    throw new Error();
  }
  const handleClick = () => {
    dispatch({ type: "ChangeState", stage: "third", analysis });
  };
  const history = Game.history({ verbose: true });
  const gameOver = Game.isCheckmate() || Game.isStalemate();
  useEffect(() => {
    const stockfish = new StockfishManager();
    let completed = 0;

    const analyze = async () => {
      const analysisResult = [];
      for (let i = 0; i < history.length; i++) {
        if (!gameOver || !(i === history.length - 1)) {
          const result = await stockfish.analyzePosition(
            history[i].after,
            depth
          );
          analysisResult.push(result);
        }
        completed++;
        setProgress(completed / history.length);
      }
      setAnalysis(analysisResult);
    };

    analyze();
    return () => {
      stockfish.terminate();
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 text-lg items-center justify-center align-middle text-center p-3">
      {loading && (
        <Progress
          label={`Analyzing Game`}
          size="lg"
          value={progress * 100}
          color="primary"
          showValueLabel></Progress>
      )}
      <div className="grid grid-cols-12 gap-3 ">
        <div className="col-span-4">{whitePlayer}</div>
        <div className="col-span-4 text-xl font-bold">VS</div>
        <div className="col-span-4">{blackPlayer}</div>

        {allTypesOfMove.slice(0, allTypesOfMove.length - 1).map((m) => (
          <MoveClass
            key={m}
            type={m}
            counts={loading ? { white: 0, balck: 0 } : undefined}></MoveClass>
        ))}
      </div>
      <Button
        className="text-xl"
        onClick={handleClick}
        variant="ghost"
        isDisabled={loading}
        color="primary">
        Start analyzing
      </Button>
    </div>
  );
}

const MoveClass: FC<{
  type: MT;
  counts?: { white: number; balck: number };
}> = ({ type, counts }) => {
  var balck, white;
  if (!counts) {
    balck = 0;
    white = 0;
  } else {
    balck = counts.balck;
    white = counts.white;
  }
  return (
    <>
      <div className="col-span-2">{white}</div>
      <div className="col-span-8 flex gap-3 items-center justify-center align-middle text-center capitalize ">
        {!counts ? (
          <>
            <div style={{ color: MoveMaping[type].color }}>{type}</div>
            <MoveIcon type={type}></MoveIcon>
          </>
        ) : (
          <div className="animate-pulse col-span-8 flex gap-3 ">
            <div
              style={{ backgroundColor: MoveMaping[type].color }}
              className="w-20 my-1 rounded-md"></div>
            <div
              style={{ backgroundColor: MoveMaping[type].color }}
              className="rounded-full size-7"></div>
          </div>
        )}
      </div>
      <div className="col-span-2">{balck}</div>
    </>
  );
};

export default Summary;
