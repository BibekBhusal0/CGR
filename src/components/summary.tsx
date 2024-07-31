import { FC, useContext, useEffect, useState } from "react";
import MoveIcon, { allTypesOfMove, MoveMaping, MT } from "./moveTypes";
import { AppContext } from "../App";
import { Button, CardBody, CardFooter, Progress } from "@nextui-org/react";
import StockfishManager, { StockfishOutput } from "../Logic/stockfish";
import EvalGraph from "../Logic/evalgraph";
import { analysisType, analyze, analyzePropsType } from "../Logic/analyze";
import AnimatedCounter from "./AnimatedCounter";

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
  const context = useContext(AppContext);
  const [progress, setProgress] = useState(0);
  const loading = !(progress === 1);
  const [playerSummary, setPlayerSummary] = useState({
    black: initStats(),
    white: initStats(),
  });
  if (!context) {
    throw new Error();
  }
  const {
    dispatch,
    state: { whitePlayer, blackPlayer, Game, depth, analysis },
  } = context;
  if (!Game) {
    throw new Error();
  }
  const handleClick = () => {
    dispatch({ type: "ChangeState", stage: "third" });
  };
  useEffect(() => {
    const stockfish = new StockfishManager();
    const analysisLoop = async () => {
      const history = Game.history({ verbose: true });
      const CM = Game.isCheckmate();
      const SM = Game.isStalemate();
      const gameOver = CM || SM;
      let completed = 0;
      const analysisResult: analysisType[] = [];
      var prevEval = { type: "cp", value: 0 };
      var SFresult: StockfishOutput = await stockfish.analyzePosition(
        history[0].before,
        depth
      );
      var analyzedMove = await analyze({
        stockfishAnalysis: SFresult,
        prevEval,
        positionDetails: history[0],
        moveIndex: -1,
      });
      prevEval = analyzedMove.eval;
      for (let i = 0; i < history.length; i++) {
        const fen = history[i].after;
        if (!gameOver || !(i === history.length - 1)) {
          SFresult = await stockfish.analyzePosition(fen, depth);
        } else {
          SFresult = {
            bestMove: "",
            eval: { type: "cp", value: 0 },
            lines: [],
          };
          if (CM) {
            const turn = Game.turn();
            SFresult["eval"] = { type: "mate", value: turn === "w" ? -1 : 1 };
          }
        }

        const analyzeProps: analyzePropsType = {
          stockfishAnalysis: SFresult,
          prevEval,
          positionDetails: history[i],
          moveIndex: i,
        };

        analyzedMove = await analyze(analyzeProps);
        analysisResult.push(analyzedMove);
        prevEval = analyzedMove.eval;

        completed++;
        setProgress(completed / history.length);
      }
      dispatch({ type: "SetAnalysis", analysis: analysisResult });
      setPlayerSummary(countTypes(analysisResult));
      console.log(playerSummary);
    };

    if (!analysis) {
      analysisLoop();
    } else {
      if (progress !== 1) {
        setProgress(1);
      }
      setPlayerSummary(countTypes(analysis));
      console.log(playerSummary);
    }
    return () => {
      stockfish.terminate();
    };
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
          <div className="grid grid-cols-3 gap-3 ">
            <div>{whitePlayer}</div>
            <div className="text-xl font-bold">VS</div>
            <div>{blackPlayer}</div>
            <div className="text-left">
              {
                <AnimatedCounter
                  to={playerSummary.white.accuracy}
                  round_off={false}
                />
              }
            </div>
            <div>Accuracy</div>
            <div className="text-right">
              {
                <AnimatedCounter
                  to={playerSummary.black.accuracy}
                  round_off={false}
                />
              }
            </div>
          </div>

          {allTypesOfMove.slice(0, allTypesOfMove.length - 1).map((m) => (
            <MoveClass
              key={m}
              type={m}
              counts={
                loading
                  ? {
                      white: playerSummary.white.movesCount[m],
                      black: playerSummary.white.movesCount[m],
                    }
                  : undefined
              }></MoveClass>
          ))}
        </div>
      </CardBody>
      <CardFooter className="flex justify-center">
        <Button
          className="text-xl"
          onClick={handleClick}
          variant="ghost"
          isDisabled={loading}
          color="primary">
          Start analyzing
        </Button>
      </CardFooter>
    </>
  );
}

const MoveClass: FC<{
  type: MT;
  counts?: { white: number; black: number };
}> = ({ type, counts }) => {
  var black, white;
  if (!counts) {
    black = 0;
    white = 0;
  } else {
    black = counts.black;
    white = counts.white;
  }
  return (
    <div
      style={{ color: MoveMaping[type].color }}
      className="grid grid-cols-8 text-center text-lg w-full">
      <div className=" col-span-2">
        <AnimatedCounter to={white} round_off />
      </div>
      <div className="col-span-4">
        <div className="w-full">
          <div className="flex gap-3 items-center justify-around align-middle text-left capitalize ">
            {!counts ? (
              <>
                <MoveIcon type={type} scale={1} />
                <div>{type}</div>
              </>
            ) : (
              <>
                <div
                  style={{ backgroundColor: MoveMaping[type].color }}
                  className="rounded-full size-7 animate-pulse"></div>
                <div
                  style={{ backgroundColor: MoveMaping[type].color }}
                  className="w-20 h-5 my-1 rounded-md animate-pulse"></div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className=" col-span-2">
        <AnimatedCounter to={black} round_off />
      </div>
    </div>
  );
};

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
