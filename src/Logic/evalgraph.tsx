import { FC, useContext } from "react";
import { AppContext } from "../App";
import { ScaleLinear } from "d3-scale";
import { useYScale, useDrawingArea } from "@mui/x-charts/hooks";
import { LineChart, areaElementClasses } from "@mui/x-charts/LineChart";
import { StockfishOutput } from "./stockfish";

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
  console.log(showGraph);
  return (
    <div className="width-full h-28 bg-green-400">
      {showGraph ? (
        <Graph data={analysis}></Graph>
      ) : (
        <div className="flex-col" style={{ backgroundColor: white }}>
          <div className="h-2/4" style={{ backgroundColor: black }}></div>
        </div>
      )}
    </div>
  );
}

const Graph: FC<{ data: StockfishOutput[] }> = ({ data }) => {
  const maxCpValue = Math.max(
    ...data.map((a) => (a.eval.type === "cp" ? a.eval.value : 0))
  );
  const maxCpThreshold = 20;
  const calculateMateValue = (mateValue: number): number => {
    if (maxCpValue < maxCpThreshold) {
      const minMateValue = maxCpValue * 0.2;
      return Math.max(minMateValue, mateValue);
    } else {
      return Math.min(mateValue, maxCpThreshold);
    }
  };

  const val: number[] = data.map((a) => {
    if (a.eval.type === "cp") {
      return Math.min(a.eval.value / 100, maxCpThreshold);
    } else if (a.eval.type === "mate") {
      return calculateMateValue(a.eval.value / 100);
    }
    return 0;
  });

  return (
    <>
      <LineChart
        series={[{ data: val, showMark: false, area: true }]}
        width={200}
        height={100}
        margin={{ top: 20, bottom: 30, left: 75 }}
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
        <style>
          {`
      .MuiChartsAxis-root {
        display: none !important;
      }
    `}
        </style>
      </LineChart>
    </>
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
