import { rephraseEvaluation } from "../Logic/rephraseEvaluation";
import { FC, useEffect, useState } from "react";
import { evaluationType } from "../Logic/stockfish";
import { Button } from "@heroui/button";
import OpeningCard from "./opening";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "@/Logic/reducers/store";
import { setBoardStage, setIndex2 } from "@/Logic/reducers/game";
import { MoveIcon } from "./moveTypes/MoveIcon";
import { MoveExplained } from "./moveTypes/types";
import { icons } from "./icons";

export const MoveComment: FC = () => {
  const {
    game: { moveIndex, analysis, Game, boardStage },
    settings: { bestMove },
  } = useSelector((state: StateType) => state);
  const dispatch = useDispatch();

  if (!analysis || !Game) {
    throw new Error("game not available or analysis not available");
  }
  let crrMove, crrPositionAnalysis, prevPositionAnalysis;

  const getClickHandler = (index: number): (() => boolean) => {
    const lines = analysis[index].fenLines;
    const execute = lines.length !== 0;
    return () => {
      if (execute) {
        dispatch(setIndex2(index));
        dispatch(setBoardStage(boardStage === "normal" ? "bestMove" : "normal"));
      }
      return execute;
    };
  };

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
              <EvalBox evaluation={crrPositionAnalysis.eval} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <ShowMoves ClickEvent={getClickHandler(moveIndex + 1)} />
              {!bestMove && (
                <Button variant="flat" color="danger">
                  <div className="flex items-center gap-2 font-semibold">
                    {/* <FaArrowRotateLeft className="text-xl" /> */}
                    <div className="text-xl">{icons.others.retry}</div>

                    <div className="text-lg">Retry</div>
                  </div>
                </Button>
              )}
            </div>
            {bestMove && prevPositionAnalysis.bestMove !== crrMove && (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center justify-start gap-2">
                    <MoveIcon type="best" />
                    <div>{prevPositionAnalysis.bestMove} is the best move</div>
                  </div>
                  <EvalBox evaluation={prevPositionAnalysis.eval} />
                </div>
                <ShowMoves ClickEvent={getClickHandler(moveIndex)} />
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
};

const ShowMoves: FC<{ ClickEvent: () => boolean }> = ({ ClickEvent }) => {
  const { boardStage } = useSelector((state: StateType) => state.game);

  const [showing, setShowing] = useState(false);
  useEffect(() => {
    if (boardStage !== "bestMove") {
      setShowing(false);
    }
  }, [boardStage]);
  const handleClick = () => {
    if (ClickEvent()) {
      setShowing(!showing);
    }
  };
  return (
    <Button
      variant={showing ? "flat" : "solid"}
      color={showing ? "danger" : "primary"}
      onPress={handleClick}>
      <div className="flex gap-2">
        {/* <BiSolidChess className="text-2xl" /> */}
        <div className="text-2xl">{icons.chess.small_board}</div>
        <div className="text-lg font-semibold">{showing ? "Hide Moves" : "Show Moves"}</div>
      </div>
    </Button>
  );
};

const EvalBox: FC<{ evaluation: evaluationType }> = ({ evaluation }) => {
  const phrasedEval = rephraseEvaluation(evaluation);
  const balckWinning = phrasedEval[0] === "-";
  const color = balckWinning ? "bg-gray-950 text-gray-50" : "bg-gray-50 text-gray-950";
  return <div className={`rounded-md p-2 text-sm font-bold ${color}`}>{phrasedEval}</div>;
};
