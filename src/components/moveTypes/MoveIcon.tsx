import { FC } from "react";
import { AllIcons } from "./types";
import { mapping } from "./IconMapping";


export const MoveIcon: FC<{ type: AllIcons; }> = ({ type }) => {
  const { color, item } = mapping[type];
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

