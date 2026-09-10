import { useMemo } from "react";
import {
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
  Area,
  AreaChart,
  YAxis,
  XAxis,
} from "recharts";
import { rephraseEvaluation } from "@/Logic/rephraseEvaluation";
import { useGameState } from "@/Logic/state/game";
import { MoveIcon } from "@/components/moveTypes/MoveIcon";
import { MoveTypeColors, MT } from "@/components/moveTypes/types";

const MARKER_TYPES: MT[] = ["brilliant", "great", "mistake", "miss", "blunder"];

const WHITE_FILL = "var(--board-light-square, #F1E4D2)";
const BLACK_FILL = "var(--board-dark-square, #454545)";
const NEUTRAL_STROKE = "var(--border, #888888)";

function EvalGraph() {
  const analysis = useGameState((state) => state.analysis);
  const showGraph = analysis !== undefined;
  return (
    <div className="size-full overflow-hidden rounded-md">
      {showGraph ? <Graph /> : <div className="bg-default-300 size-full animate-pulse"></div>}
    </div>
  );
}

const Graph = () => {
  const analysis = useGameState((state) => state.analysis);
  const changeState = useGameState((state) => state.changeState);
  const setIndex = useGameState((state) => state.setIndex);
  const moveIndex = useGameState((state) => state.moveIndex);
  if (!analysis) throw new Error("analysis not found");

  const maxEval = Math.max(
    ...analysis.map((a) => (a.eval.type === "cp" ? Math.abs(a.eval.value / 100) : 0))
  );
  const threshold = useMemo(() => Math.max(Math.min(maxEval * 2, 6), 1.5), [maxEval]);

  const data = useMemo(
    () =>
      analysis.map((a, index) => {
        let value: number;
        if (a.eval.type === "cp") {
          const scaledValue = a.eval.value / 100;
          value = Math.max(Math.min(scaledValue, threshold), -threshold);
        } else if (a.eval.type === "mate") {
          value = a.eval.value > 0 ? threshold : -threshold;
        } else {
          value = 0;
        }
        return { index, value, moveType: a.moveType as MT };
      }),
    [analysis, threshold]
  );

  const markers = useMemo(
    () => data.filter((d) => d.index > 0 && (MARKER_TYPES as string[]).includes(d.moveType)),
    [data]
  );

  const currentAnalysisIndex = moveIndex + 1;
  const currentEntry =
    moveIndex >= 0 && currentAnalysisIndex < analysis.length
      ? analysis[currentAnalysisIndex]
      : undefined;
  const currentMoveColor = currentEntry ? MoveTypeColors[currentEntry.moveType as MT] : undefined;

  return (
    <div className="size-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          onClick={(a) => {
            if (!a) return;
            if (typeof a.activeLabel !== "number") return;
            changeState("third");
            setIndex(a.activeLabel - 1);
          }}>
          <XAxis dataKey="index" type="number" domain={["dataMin", "dataMax"]} hide />
          <YAxis domain={[-threshold, threshold]} type="number" hide />
          <Tooltip
            cursor={{ stroke: NEUTRAL_STROKE, strokeOpacity: 0.5 }}
            content={({ payload }) => {
              const point = payload && payload[0] ? payload[0].payload : undefined;
              if (!point || typeof point.index !== "number" || point.index < 0) return null;
              const entry = analysis[point.index];
              if (!entry) return null;
              return (
                <div className="bg-surface text-foreground flex items-center gap-2 rounded-md border px-2 py-1 text-sm shadow-lg">
                  <MoveIcon type={entry.moveType} />
                  <span className="font-semibold">{rephraseEvaluation(entry.eval)}</span>
                  <span className="capitalize opacity-70">{entry.moveType}</span>
                </div>
              );
            }}
          />

          {/* One area fills curve-to-bottom, the other curve-to-top, so the curve
              splits the whole square instead of filling down to zero. */}
          <Area
            type="natural"
            dataKey="value"
            baseValue={-threshold}
            stroke="none"
            fill={WHITE_FILL}
            fillOpacity={1}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          <Area
            type="natural"
            dataKey="value"
            baseValue={threshold}
            stroke="none"
            fill={BLACK_FILL}
            fillOpacity={1}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          <Area
            type="natural"
            dataKey="value"
            stroke={NEUTRAL_STROKE}
            strokeWidth={2}
            fill="none"
            dot={false}
            activeDot={{ r: 5 }}
          />

          <ReferenceLine y={0} stroke="currentColor" strokeOpacity={0.35} />

          {currentEntry && currentMoveColor && (
            <ReferenceLine
              x={currentAnalysisIndex}
              stroke={currentMoveColor}
              strokeWidth={2}
              strokeOpacity={0.9}
            />
          )}

          {markers.map((m) => (
            <ReferenceDot
              key={`marker-${m.index}`}
              x={m.index}
              y={m.value}
              r={3.5}
              fill={MoveTypeColors[m.moveType]}
              stroke="#fff"
              strokeWidth={1}
              onClick={() => {
                changeState("third");
                setIndex(m.index - 1);
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvalGraph;
