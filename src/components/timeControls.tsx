import { timeControls } from "../api/CDC";
import { FC } from "react";
import { icons } from "./icons";

const timeControlColors = {
  rapid: "#7EB144",
  daily: "#F7A117",
  blitz: "#FAD541",
  classical: "#F7C631",
  bullet: "#E3AA24",
};

const TimeControl: FC<{ control: timeControls }> = ({ control }) => {
  const color = timeControlColors[control] || timeControlColors["rapid"];
  const icon = icons.time_control[control] || icons.time_control["rapid"];
  return (
    <div style={{ color: color }} className="flex-center gap-2 capitalize">
      <div className="text-xl"> {icon} </div>
      <div className="text-sm">{control}</div>
    </div>
  );
};

export default TimeControl;
