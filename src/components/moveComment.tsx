import MoveIcon, { MoveExplained } from "./moveTypes";
import { rephraseEvaluation } from "../Logic/evalbar";
import { FC, useContext } from "react";
import { AppContext } from "../App";
import { evaluationType } from "../Logic/stockfish";
import { Button } from "@nextui-org/react";
import OpeningCard from "./opening";

export const MoveComment: FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error();
  }
  const {
    state: { moveIndex, analysis, Game, bestMove },
  } = context;
  if (!analysis || !Game) {
    throw new Error("game not available or analysis not available");
  }
  var crrMove, crrPositionAnalysis, prevPositionAnalysis, crrMoveType;

  if (moveIndex !== -1) {
    crrMove = Game.history({ verbose: true })[moveIndex].san;
    crrPositionAnalysis = analysis[moveIndex + 1];
    prevPositionAnalysis = analysis[moveIndex];
  }
  return (
    <div className="bg-success-50 px-8 py-3 rounded-md">
      {moveIndex === -1
        ? "Start Analyzing Game"
        : crrPositionAnalysis &&
          crrMove &&
          prevPositionAnalysis && (
            <>
              <div className="flex gap-3 justify-between items-start">
                <div className="flex justify-start gap-2">
                  <MoveIcon type={prevPositionAnalysis.moveType} scale={0.7} />
                  <div>
                    {crrMove} is {MoveExplained[prevPositionAnalysis.moveType]}.
                  </div>
                </div>
                <EvalBox evaluation={crrPositionAnalysis.eval} />
              </div>
              <div>
                <ShowMoves onClick={() => console.log()} />
                <div className="text-sm text-default-700">
                  Note: Buttons are not yet working
                </div>
              </div>
              {bestMove && prevPositionAnalysis.bestMove !== crrMove && (
                <>
                  <div className="flex gap-3 justify-between items-start mt-3">
                    <div className="flex justify-start gap-2">
                      <MoveIcon type="best" scale={0.7} />
                      <div>
                        {prevPositionAnalysis.bestMove} is the best move
                      </div>
                    </div>
                    <EvalBox evaluation={prevPositionAnalysis.eval} />
                  </div>
                  <ShowMoves onClick={() => console.log()} />
                </>
              )}
              {crrPositionAnalysis.opening ? (
                <OpeningCard opening={crrPositionAnalysis.opening} />
              ) : (
                ""
              )}
            </>
          )}
    </div>
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

const ShowMoves: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button variant="bordered" color="primary" onClick={onClick}>
      ShowMoves
    </Button>
  );
};
