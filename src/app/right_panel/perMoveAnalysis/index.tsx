import { CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Controls } from "../moves/controls";
import { useSettingsState } from "@/Logic/state/settings";
import { useGameState } from "@/Logic/state/game";
import { useEffect, useState } from "react";
import { analysisType, analyzePosition } from "@/Logic/analyze";
import StockfishManager from "@/Logic/stockfish";
import { cn } from "@heroui/theme";
import { ChevronIcon } from "@heroui/shared-icons";
import { MoveIcon } from "@/components/moveTypes/MoveIcon";
import { MoveExplained } from "@/components/moveTypes/types";
import OpeningCard from "../moves/opening";

export function PerMoveAnalysis() {
  const moveIndex = useGameState((state) => state.moveIndex);
  const analysis = useGameState((state) => state.analysis);
  const setAnalysis = useGameState((state) => state.setAnalysis);
  const setIndex = useGameState((state) => state.setIndex);
  const Game = useGameState((state) => state.Game);
  const [loading, setLoading] = useState(!!analysis);

  function analyzeCurrentPos() {
    analyze().then(() => setLoading(false));
  }

  async function analyze(index: number = moveIndex) {
    if (!Game) return;
    const stockfish = new StockfishManager();
    let prevAnalysis: analysisType | undefined = undefined;
    setLoading(true);
    if (analysis && analysis[index]) prevAnalysis = analysis[index];
    const history = Game.history({ verbose: true });
    const move = moveIndex === -1 ? history[0] : history[index];
    const fen = moveIndex === -1 ? move.before : move.after;
    const output = await analyzePosition(fen, moveIndex, move, stockfish, prevAnalysis);
    stockfish.terminate();
    if (!analysis) {
      if (index === -1) setAnalysis([output]);
    } else {
      const newAnalysis = [...analysis];
      try {
        newAnalysis[moveIndex + 1] = output;
        setAnalysis(newAnalysis);
      } catch (e) {
        console.log(e);
      }
    }
  }

  useEffect(() => {
    // Analyze first 2 position if not available
    if (!Game) return;
    if (!analysis) {
      setLoading(true);
      analyze(-1).then(() => {
        analyze(0).then(() => {
          setLoading(false);
        });
      });
    } else {
      // Make sure to analyze without jumping
      // If analysis for prev moves not available rollback some moves
      if (analysis.length < moveIndex) {
        setIndex(analysis.length);
        setLoading(false);
      } else if (moveIndex + 1 === analysis.length) {
        // If analysis for previous moves available analyze the move
        analyzeCurrentPos();
      } else {
        setLoading(false);
      }
    }
  }, [analysis, moveIndex]);

  if (!Game) return null;

  return (
    <>
      <CardHeader className="flex flex-col gap-2">
        <Warning />
      </CardHeader>
      <CardBody>
        {loading ? <div>Per move detail will be here loading ....</div> : <AnalysisCard />}
      </CardBody>
      <CardFooter className="flex-center">
        <Controls />
      </CardFooter>
    </>
  );
}

function AnalysisCard() {
  const Game = useGameState((state) => state.Game);
  const analysis = useGameState((state) => state.analysis);
  const moveIndex = useGameState((state) => state.moveIndex);
  const bestMove = useSettingsState((state) => state.bestMove);

  if (!analysis || !Game) return null;
  let crrMove, crrPositionAnalysis, prevPositionAnalysis;

  if (moveIndex !== -1) {
    crrMove = Game.history({ verbose: true })[moveIndex].san;
    crrPositionAnalysis = analysis[moveIndex + 1];
    prevPositionAnalysis = analysis[moveIndex];
  }
  return (
    <div className="bg-success-50 flex flex-col gap-2 rounded-md px-8 py-3">
      {moveIndex === -1 ? (
        <div className="text-lg">Start Analyzing Game</div>
      ) : (
        crrPositionAnalysis &&
        crrMove &&
        prevPositionAnalysis && (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center justify-start gap-2">
                <MoveIcon type={prevPositionAnalysis.moveType} />
                <div>
                  {crrMove} is {MoveExplained[prevPositionAnalysis.moveType]}.
                </div>
              </div>
            </div>
            {bestMove && prevPositionAnalysis.bestMove !== crrMove && (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center justify-start gap-2">
                    <MoveIcon type="best" />
                    <div>{prevPositionAnalysis.bestMove} is the best move</div>
                  </div>
                </div>
              </>
            )}
            {crrPositionAnalysis.opening ? (
              <OpeningCard opening={crrPositionAnalysis.opening} />
            ) : (
              ""
            )}
          </>
        )
      )}
    </div>
  );
}

function Warning() {
  const [expanded, setExpanded] = useState(false);
  const toggle = useSettingsState((state) => state.toggleValues);
  const animation = useSettingsState((state) => state.animation);

  return (
    <div
      className={cn(
        "relative overflow-clip rounded-b-md",
        expanded ? "h-auto max-h-80" : "max-h-9.5",
        animation ? "transition-all" : "transition-none"
      )}>
      <ChevronIcon
        className={cn(
          "absolute top-3 right-4",
          animation ? "transition-all" : "transition-none",
          expanded ? "-rotate-90" : "rotate-0"
        )}
        onClick={() => setExpanded((e) => !e)}
      />
      <div className="text-md text-danger-800 bg-danger-200 flex flex-col gap-2 rounded-md p-2 pr-8">
        <div>Analysis per move enabled.</div>
        Note that per move analysis is not recommended unless you are inspecting every single move.
        Some default settigs will not be applied here.
        <div>Red Arrow: Pin.</div>
        <div>Green Arrow: Best Move</div>
        <div>Green Highlight: Hanging piece.</div>
        <Button className="self-center" color="primary" onPress={() => toggle("analyzePerMove")}>
          Turn off Per move analysis
        </Button>
      </div>
    </div>
  );
}
