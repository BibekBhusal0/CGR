import {
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  YAxis,
} from "recharts";
import { rephraseEvaluation } from "./evalbar";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "./reducers/store";
import { changeState, setIndex } from "./reducers/game";

// const white = "#F1E4D2";
// const black = "#454545";

function EvalGraph() {
  const { analysis } = useSelector((state: StateType) => state.game);
  const showGraph = analysis !== undefined;
  return (
    <div className="size-full">
      {showGraph ? (
        <Graph />
      ) : (
        <div className="size-full animate-pulse bg-default-300"></div>
      )}
    </div>
  );
}

const Graph = () => {
  const { analysis } = useSelector((state: StateType) => state.game);
  const dispatch = useDispatch();
  if (!analysis) throw new Error("analysis not found");

  const maxEval = Math.max(
    ...analysis.map((a) =>
      a.eval.type === "cp" ? Math.abs(a.eval.value / 100) : 0
    )
  );
  const threshold = Math.min(maxEval * 2, 6);

  const val: number[] = analysis.map((a) => {
    if (a.eval.type === "cp") {
      const scaledValue = a.eval.value / 100;
      return Math.max(Math.min(scaledValue, threshold), -threshold);
    } else if (a.eval.type === "mate") {
      return a.eval.value > 0 ? threshold : -threshold;
    }
    return 0;
  });

  return (
    <div className="size-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={analysis.map((_, index) => ({
            value: val[index],
            index,
          }))}
          onClick={(a) => {
            if (!a) return;
            if (typeof a.activeLabel !== "number") return;
            dispatch(changeState("third"));
            dispatch(setIndex(a.activeLabel));
          }}>
          <YAxis domain={[-threshold, threshold]} type="number" hide />
          <Tooltip
            content={({ payload }) => {
              const index =
                payload && payload[0] ? payload[0].payload.index : -1;
              if (index !== -1) {
                return <div>{rephraseEvaluation(analysis[index].eval)}</div>;
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill={""}
            fillRule="nonzero"
            activeDot={{ r: 8 }}
          />

          <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvalGraph;
