import { useEffect, useState } from "react";
import { allTypesOfMove, MT } from "@/components/moveTypes/types";
import { Card, ButtonGroup, ButtonProps, ProgressBar, Label } from "@heroui/react";
import EvalGraph from "@/Logic/evalgraph";
import { analysisType, analyzeGame } from "@/Logic/analyze";
import { useGameState } from "@/Logic/state/game";
import { MoveClass } from "@/components/moveTypes";
import { icons } from "@/components/icons";
import { Buttons, newButtonProps } from "@/components/buttons";

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
  const whitePlayer = useGameState((state) => state.whitePlayer);
  const blackPlayer = useGameState((state) => state.blackPlayer);
  const changeState = useGameState((state) => state.changeState);
  const setAnalysis = useGameState((state) => state.setAnalysis);
  const Game = useGameState((state) => state.Game);
  const analysis = useGameState((state) => state.analysis);
  const saveGameToArchive = useGameState((state) => state.saveGameToArchive);

  const allButtons: newButtonProps[] = [
    {
      children: "Start Analyzing",
      icon: icons.others.rocket,
      onClick: () => changeState("third"),
      hide: loading,
    },
    {
      children: "Archive",
      icon: icons.left_panel.archive,
      onClick: saveGameToArchive,
      hide: loading,
    },
    {
      children: "Back",
      icon: icons.controls.previous,
      onClick: () => changeState("first"),
      // color: "danger",
      // variant: "flat",
    },
  ];
  const defaultProps: ButtonProps = {
    size: "md",
    variant: "danger-soft",
  };

  useEffect(() => {
    if (!Game) return;

    if (!analysis) {
      analyzeGame(Game, setProgress).then((a) => {
        setAnalysis(a);
        setPlayerSummary(countTypes(a));
      });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (progress !== 1) setProgress(1);
      setPlayerSummary(countTypes(analysis));
    }
  }, []);
  if (!Game) throw new Error();

  return (
    <>
      <Card.Content>
        <div className="flex flex-col items-center justify-center gap-3 p-3 text-center align-middle text-lg">
          {!loading && (
            <div className="h-20 w-4/5 rounded-xs">
              <EvalGraph />
            </div>
          )}
          {loading && (
            <ProgressBar
              aria-label={`Analyzing Game`}
              size="lg"
              value={progress * 100}
              // color="primary"
              // showValueLabel
            >
              <Label>Analyzing Game</Label>
              <ProgressBar.Output />
              <ProgressBar.Track>
                <ProgressBar.Fill />
              </ProgressBar.Track>
            </ProgressBar>
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
      </Card.Content>
      <Card.Footer className="flex justify-center">
        <ButtonGroup variant={defaultProps.variant}>
          <Buttons buttons={allButtons} defaultProps={defaultProps} includeSeperators />
        </ButtonGroup>
      </Card.Footer>
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
