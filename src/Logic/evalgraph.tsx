import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../App";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { rephraseEvaluation } from "./evalbar";

const white = "#454545";
const black = "#F1E4D2";

function EvalGraph() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("context not found");
  }

  const {
    state: { analysis },
  } = context;
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
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("context not found");
  }

  const {
    state: { moveIndex, analysis, stage },
    dispatch,
  } = context;
  if (!analysis) {
    throw new Error("analysis not found");
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxEval = Math.max(
    ...analysis.map((a) =>
      a.eval.type === "cp" ? Math.abs(a.eval.value / 100) : 0
    )
  );
  const threshold = Math.min(maxEval * 4, 25);

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
    <div ref={containerRef} className="size-full hide-axis">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={analysis.map((a, index) => ({
            name: `Move ${index + 1}`,
            value: val[index],
            index,
          }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[-threshold, threshold]} />
          <Tooltip
            content={({ payload, label }) => {
              const index =
                payload && payload[0] ? payload[0].payload.index : -1;
              if (index !== -1) {
                return <div>{rephraseEvaluation(analysis[index].eval)}</div>;
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            dot={false}
            activeDot={{ r: 8 }}
            // onClick={(data) => {
            //   if (data.payload.index !== undefined && stage === "third") {
            //     if (data.payload.index !== analysis.length - 1) {
            //       dispatch({ type: "SetIndex", index: data.payload.index });
            //     }
            //   }
            // }}
          />
          <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvalGraph;
