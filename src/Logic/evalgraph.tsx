import { Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, YAxis } from "recharts";
import { rephraseEvaluation } from "@/Logic/rephraseEvaluation";
import { useGameState } from "@/Logic/state/game";

// const white = "#F1E4D2";
// const black = "#454545";

function EvalGraph() {
  const analysis = useGameState(state=>state.analysis)
  const showGraph = analysis !== undefined;
  return (
    <div className="size-full">
      {showGraph ? <Graph /> : <div className="bg-default-300 size-full animate-pulse"></div>}
    </div>
  );
}

const Graph = () => {
  const analysis = useGameState((state) => state.analysis);
  const changeState = useGameState((state) => state.changeState);
  const setIndex = useGameState((state) => state.setIndex);
  if (!analysis) throw new Error("analysis not found");

  const maxEval = Math.max(
    ...analysis.map((a) => (a.eval.type === "cp" ? Math.abs(a.eval.value / 100) : 0))
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
            changeState("third");
            setIndex(a.activeLabel);
          }}>
          <YAxis domain={[-threshold, threshold]} type="number" hide />
          <Tooltip
            content={({ payload }) => {
              const index = payload && payload[0] ? payload[0].payload.index : -1;
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
