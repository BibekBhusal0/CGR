import { useEffect, useState } from "react";
import { allTypesOfMove, MoveClass, MT } from "./moveTypes";
import { CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import StockfishManager, { evaluationType } from "../Logic/stockfish";
import EvalGraph from "../Logic/evalgraph";
import { analysisType, analyze } from "../Logic/analyze";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "@/Logic/reducers/store";
import { Move } from "chess.js";
import { changeState, setAnalysis } from "@/Logic/reducers/game";

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
    dispatch(changeState("third"));
  };

  useEffect(() => {
    const stockfish = new StockfishManager();

    const analyzePosition = async (
      fen: string,
      prevEval: evaluationType,
      moveIndex: number,
      move: Move
    ) => {
      const SFresult = await stockfish.analyzePosition(fen, depth);
      const analysis = await analyze({
        stockfishAnalysis: SFresult,
        prevEval,
        positionDetails: move,
        moveIndex,
      });
      return analysis;
    };

    const analysisLoop = async () => {
      const history = Game.history({ verbose: true });
      const CM = Game.isCheckmate();
      const SM = Game.isStalemate();
      const gameOver = CM || SM;
      let completed = 0;
      const analysisResult = [];
      let prevEval = { type: "cp", value: 0 };

      const initialMove = await analyzePosition(history[0].before, prevEval, -1, history[0]);
      analysisResult.push(initialMove);
      prevEval = initialMove.eval;

      for (let i = 0; i < history.length; i++) {
        const fen = history[i].after;

        if (gameOver && i === history.length - 1) {
          const turn = Game.turn();
          if (SM) prevEval = { type: "cp", value: 0 };
          else prevEval = { type: "mate", value: turn === "w" ? -1 : 1 };
        } else {
          const a = await analyzePosition(fen, prevEval, i, history[i]);
          analysisResult.push(a);
          prevEval = a.eval;
        }

        completed++;
        setProgress(completed / history.length);
      }

      dispatch(setAnalysis(analysisResult));
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
        <div className="flex flex-col items-center justify-center gap-3 p-3 text-center align-middle text-lg">
          {!loading && (
            <div className="h-20 w-4/5 rounded-sm">
              <EvalGraph />
            </div>
          )}
          {loading && (
            <Progress
              label={`Analyzing Game`}
              size="lg"
              value={progress * 100}
              color="primary"
              showValueLabel></Progress>
          )}
          <div className="grid grid-cols-8 gap-3">
            <div className="col-span-3">{whitePlayer}</div>
            <div className="col-span-2 text-xl font-bold">VS</div>
            <div className="col-span-3">{blackPlayer}</div>
            <div className="col-span-2 text-center">
              {playerSummary.white.accuracy.toFixed(2)} %
            </div>
            <div className="col-span-4">Accuracy</div>
            <div className="col-span-2 text-center">
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
          className="px-6 py-4 text-2xl"
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
