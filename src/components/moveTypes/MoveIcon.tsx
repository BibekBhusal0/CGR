import { FC } from "react";
import { AllColors, AllIcons } from "./types";
import { icons } from "../icons";
const moveIcons = { ...icons.move, ...icons.game_over };

export const MoveIcon: FC<{ type: AllIcons }> = ({ type }) => {
  const color = AllColors[type];
  const item = moveIcons[type];
  return (
    <div
      style={{
        backgroundColor: color,
      }}
      className="relative size-7 rounded-full">
      <div className="bg-radial-gradient absolute z-0 size-full from-gray-600 to-80% opacity-40"></div>
      <div className="absolute z-10 flex size-full items-center justify-center text-center font-bold text-white">
        {item}
      </div>
    </div>
  );
};
