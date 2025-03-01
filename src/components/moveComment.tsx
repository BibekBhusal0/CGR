import MoveIcon, { MoveExplained } from "./moveTypes";
import { rephraseEvaluation } from "../Logic/evalbar";
import { FC, useEffect, useState } from "react";
import { evaluationType } from "../Logic/stockfish";
import { Button } from "@heroui/button";
import { BiSolidChess } from "react-icons/bi";
import OpeningCard from "./opening";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "@/Logic/reducers/store";
import { setBoardStage, setIndex2 } from "@/Logic/reducers/game";

export const MoveComment: FC = () => {
  const {
    game: { moveIndex, analysis, Game, boardStage },
    settings: { bestMove },
  } = useSelector((state: StateType) => state);
  const dispatch = useDispatch();

  if (!analysis || !Game) {
    throw new Error("game not available or analysis not available");
  }
  var crrMove, crrPositionAnalysis, prevPositionAnalysis;

  const getClickHandler = (index: number): (() => boolean) => {
    const lines = analysis[index].fenLines;
    var execute = lines.length !== 0;
    return () => {
      if (execute) {
        dispatch(setIndex2(index));
        dispatch(
          setBoardStage(boardStage === "normal" ? "bestMove" : "normal")
        );
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
    <div className="bg-success-50 px-8 py-3 rounded-md flex flex-col gap-2">
      {moveIndex === -1 ? (
        <div className="text-lg">Start Analyzing Game</div>
      ) : (
        crrPositionAnalysis &&
        crrMove &&
        prevPositionAnalysis && (
          <>
            <div className="flex gap-3 justify-between items-center">
              <div className="flex justify-start gap-2 items-center">
                <MoveIcon type={prevPositionAnalysis.moveType} />
                <div>
                  {crrMove} is {MoveExplained[prevPositionAnalysis.moveType]}.
                </div>
              </div>
              <EvalBox evaluation={crrPositionAnalysis.eval} />
            </div>
            <div className="flex gap-2 justify-between items-center">
              <ShowMoves ClickEvent={getClickHandler(moveIndex + 1)} />
              {!bestMove && (
                <Button variant="flat" color="danger">
                  <div className="flex gap-2 font-semibold items-center">
                    <FaArrowRotateLeft className="text-xl " />
                    <div className="text-lg">Retry</div>
                  </div>
                </Button>
              )}
            </div>
            {bestMove && prevPositionAnalysis.bestMove !== crrMove && (
              <>
                <div className="flex gap-3 justify-between items-center">
                  <div className="flex justify-start gap-2 items-center">
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
        <BiSolidChess className="text-2xl" />
        <div className="text-lg font-semibold ">
          {showing ? "Hide Moves" : "Show Moves"}
        </div>
      </div>
    </Button>
  );
};

const EvalBox: FC<{ evaluation: evaluationType }> = ({ evaluation }) => {
  const phrasedEval = rephraseEvaluation(evaluation);
  const balckWinning = phrasedEval[0] === "-";
  const color = balckWinning
    ? "bg-gray-950 text-gray-50"
    : "bg-gray-50 text-gray-950";
  return (
    <div className={`text-sm font-bold p-2 rounded-md ${color}`}>
      {phrasedEval}
    </div>
  );
};
