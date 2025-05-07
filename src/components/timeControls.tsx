import { BsLightningFill } from "react-icons/bs";
import { timeControls } from "../api/CDC";
import { LuTimer } from "react-icons/lu";
import { GiSandsOfTime, GiSilverBullet } from "react-icons/gi";
import { FaSun } from "react-icons/fa";
import { CgSandClock } from "react-icons/cg";
import { FC } from "react";

function getIcon(timeControl: timeControls) {
  switch (timeControl) {
    case "rapid":
      return { icon: <LuTimer />, color: "#7EB144" };
    case "daily":
      return { icon: <FaSun />, color: "#F7A117" };
    case "blitz":
      return { icon: <BsLightningFill />, color: "#FAD541" };
    case "classical":
      return { icon: <CgSandClock />, color: "#F7C631" };
    case "bullet":
      return { icon: <GiSilverBullet />, color: "#E3AA24" };
    default:
      return { icon: <GiSandsOfTime />, color: "#E3AA24" };
  }
}

const TimeControl: FC<{ control: timeControls }> = ({ control }) => {
  const { icon, color } = getIcon(control);
  return (
    <div style={{ color: color }} className="flex justify-center gap-2 text-2xl capitalize">
      <div> {icon} </div>
      <div className="text-sm">{control}</div>
    </div>
  );
};

export default TimeControl;
