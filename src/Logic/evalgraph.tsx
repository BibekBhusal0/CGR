import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../App";
import { ScaleLinear } from "d3-scale";
import { useYScale, useDrawingArea } from "@mui/x-charts/hooks";
import { LineChart, areaElementClasses } from "@mui/x-charts/LineChart";
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
      <LineChart
        series={[
          {
            data: val,
            showMark: ({ index }) => index === moveIndex,
            valueFormatter: (v, { dataIndex }) =>
              rephraseEvaluation(analysis[dataIndex].eval),
            area: true,
          },
        ]}
        //
        width={dimensions.width}
        height={dimensions.height}
        margin={{ top: 2, bottom: 2, left: 0, right: 0 }}
        yAxis={[{ min: -threshold, max: threshold }]}
        //
        onAxisClick={(event, d) => {
          if (d?.dataIndex !== undefined && stage === "third") {
            if (d.dataIndex !== analysis.length - 1) {
              dispatch({ type: "SetIndex", index: d.dataIndex });
            }
          }
        }}
        axisHighlight={{ x: "line", y: "none" }}
        sx={{
          [`& .${areaElementClasses.root}`]: {
            fill: "url(#swich-color-id-1)",
          },
        }}>
        <ColorSwich
          color1={black}
          color2={white}
          threshold={0}
          id="swich-color-id-1"
        />
      </LineChart>
    </div>
  );
};
export default EvalGraph;

type ColorSwichProps = {
  threshold: number;
  color1: string;
  color2: string;
  id: string;
};

function ColorSwich({ threshold, color1, color2, id }: ColorSwichProps) {
  const { top, height, bottom } = useDrawingArea();
  const svgHeight = top + bottom + height;

  const scale = useYScale() as ScaleLinear<number, number>;
  const y0 = scale(threshold);
  const off = y0 !== undefined ? y0 / svgHeight : 0;

  return (
    <defs>
      <linearGradient
        id={id}
        x1="0"
        x2="0"
        y1="0"
        y2={`${svgHeight}px`}
        gradientUnits="userSpaceOnUse">
        <stop offset={off} stopColor={color1} stopOpacity={1} />
        <stop offset={off} stopColor={color2} stopOpacity={1} />
      </linearGradient>
    </defs>
  );
}
