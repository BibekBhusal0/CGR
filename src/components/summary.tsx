import { useEffect, useState } from "react";
import { allTypesOfMove, MoveClass, MT } from "./moveTypes";
import { CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Progress } from "@nextui-org/progress";
import StockfishManager, { evaluationType } from "../Logic/stockfish";
import EvalGraph from "../Logic/evalgraph";
import { analysisType, analyze } from "../Logic/analyze";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "@/Logic/reducers/store";

export interface playerStats {
  accuracy: number;
  movesCount: {
    [key in MT]: number;
  };
}
const initStats = (): playerStats => ({
  accuracy: 0,
  movesCount: Object.fromEntries(allTypesOfMove.map((type) => [type, 0])) as {
    [key in MT]: number;
  },
});

function Summary() {
  const [progress, setProgress] = useState(0);
  const loading = !(progress === 1);
  const [playerSummary, setPlayerSummary] = useState({
    black: initStats(),
    white: initStats(),
  });
  const {
    game: { whitePlayer, blackPlayer, Game, analysis },
    settings: { depth },
  } = useSelector((state: StateType) => state);
  const dispatch = useDispatch();

  if (!Game) throw new Error();
  const handleClick = () => {
    dispatch({ type: "ChangeState", stage: "third" });
  };

  useEffect(() => {
    const stockfish = new StockfishManager();

    const analyzePosition = async (
      fen: string,
      prevEval: evaluationType,
      moveIndex: number
    ) => {
      const move = Game.history({ verbose: true })[moveIndex];
      console.log(move);
      const SFresult = await stockfish.analyzePosition(fen, depth);
      console.log(SFresult);
      return await analyze({
        stockfishAnalysis: SFresult,
        prevEval,
        positionDetails: move,
        moveIndex,
      });
    };

    const analysisLoop = async () => {
      const history = Game.history({ verbose: true });
      console.log(history);
      const CM = Game.isCheckmate();
      const SM = Game.isStalemate();
      const gameOver = CM || SM;
      let completed = 0;
      const analysisResult = [];
      let prevEval = { type: "cp", value: 0 };

      const initialMove = await analyzePosition(
        history[0].before,
        prevEval,
        -1
      );
      analysisResult.push(initialMove);
      prevEval = initialMove.eval;

      for (let i = 0; i < history.length; i++) {
        const fen = history[i].after;

        if (gameOver && i === history.length - 1) {
          const turn = Game.turn();
          if (SM) prevEval = { type: "cp", value: 0 };
          else prevEval = { type: "mate", value: turn === "w" ? -1 : 1 };
        } else {
          const analyzedMove = await analyzePosition(fen, prevEval, i);
          analysisResult.push(analyzedMove);
          prevEval = analyzedMove.eval;
        }

        completed++;
        setProgress(completed / history.length);
      }

      dispatch({ type: "SetAnalysis", analysis: analysisResult });
      setPlayerSummary(countTypes(analysisResult));
    };

    if (!analysis) analysisLoop();
    else {
      if (progress !== 1) setProgress(1);
      setPlayerSummary(countTypes(analysis));
    }

    return () => stockfish.terminate();
  }, []);

  return (
    <>
      <CardBody>
        <div className="flex flex-col gap-3 text-lg items-center justify-center align-middle text-center p-3">
          <div className="w-4/5 h-20 p-1 rounded-sm bg-red-300">
            <EvalGraph />
          </div>
          {loading && (
            <Progress
              label={`Analyzing Game`}
              size="lg"
              value={progress * 100}
              color="primary"
              showValueLabel></Progress>
          )}
          <div className="grid grid-cols-8 gap-3 ">
            <div className="col-span-3">{whitePlayer}</div>
            <div className="text-xl font-bold col-span-2">VS</div>
            <div className="col-span-3">{blackPlayer}</div>
            <div className="text-center col-span-2">
              {playerSummary.white.accuracy.toFixed(2)} %
            </div>
            <div className="col-span-4">Accuracy</div>
            <div className="text-center col-span-2">
              {playerSummary.black.accuracy.toFixed(2)} %
            </div>
          </div>
          {allTypesOfMove.slice(0, allTypesOfMove.length - 1).map((m) => (
            <MoveClass
              key={m}
              type={m}
              counts={
                loading
                  ? undefined
                  : {
                      white: playerSummary.white.movesCount[m],
                      black: playerSummary.black.movesCount[m],
                    }
              }></MoveClass>
          ))}
        </div>
      </CardBody>
      <CardFooter className="flex justify-center">
        <Button
          className="text-2xl px-6 py-4"
          onPress={handleClick}
          variant="ghost"
          isDisabled={loading}
          color="primary">
          Start analyzing
        </Button>
      </CardFooter>
    </>
  );
}

function countTypes(analysis: analysisType[]): {
  white: playerStats;
  black: playerStats;
} {
  const stats = { white: initStats(), black: initStats() };
  const count = {
    white: { totalAccuracy: 0, totalMoves: 0 },
    black: { totalAccuracy: 0, totalMoves: 0 },
  };

  analysis.forEach((entry, index) => {
    const { moveType, accuracy } = entry;
    const color = index % 2 === 0 ? "white" : "black";
    stats[color].movesCount[moveType]++;
    count[color].totalMoves++;
    count[color].totalAccuracy += accuracy;
  });

  stats.white.accuracy = count.white.totalMoves
    ? count.white.totalAccuracy / count.white.totalMoves
    : 0;
  stats.black.accuracy = count.black.totalMoves
    ? count.black.totalAccuracy / count.black.totalMoves
    : 0;

  return stats;
}

export default Summary;
