import { BsLightningFill } from "react-icons/bs";
import { timeControls } from "../api/CDC";
import { LuTimer } from "react-icons/lu";
import { GiSandsOfTime, GiSilverBullet } from "react-icons/gi";
import { FaSun } from "react-icons/fa";
import { CgSandClock } from "react-icons/cg";
import { FC } from "react";

export function getIcon(timeControl: timeControls) {
  switch (timeControl) {
    case "rapid":
      return { icon: <LuTimer />, color: "#7EB144" };
    case "daily":
      return { icon: <FaSun />, color: "#0e0d0c" };
    case "blitz":
      return { icon: <BsLightningFill />, color: "#948c6d" };
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
    <div style={{ color: color }} className="gap-1 align-middle capitalize">
      <div className="text-center w-full text-2xl justify-center"> {icon} </div>
      <div className="">{control}</div>
    </div>
  );
};

export default TimeControl;
