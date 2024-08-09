import { FC } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { FaBookOpen, FaCheck, FaFlag, FaTrophy } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { ImArrowRight } from "react-icons/im";
import { TbClockX } from "react-icons/tb";
import { GiPointySword } from "react-icons/gi";
import AnimatedCounter from "./AnimatedCounter";
import { FaThumbsUp } from "react-icons/fa6";

export interface MoveProperty {
  color: string;
  item: JSX.Element | string;
}

export const allTypesOfMove = [
  "brilliant",
  "great",
  "best",
  "excellent",
  "good",
  "book",
  "inaccuracy",
  "mistake",
  "miss",
  "blunder",
  "forcing",
] as const;

export const GameOverTypes = [
  "win",
  "draw",
  "checkmated",
  "resigned",
  "timeout",
] as const;

export type GOT = (typeof GameOverTypes)[number];
export type MT = (typeof allTypesOfMove)[number];
export type AllIcons = GOT | MT;

export type MoveMappingType = { [key in MT]: MoveProperty };
export type MoveCommentType = { [key in MT]: string };
export type GameOverMappingType = { [key in GOT]: MoveProperty };
export type AllMappingType = MoveMappingType | GameOverMappingType;

export const MoveExplained: MoveCommentType = {
  brilliant: "a Brilliancy",
  great: "a Great Move",
  best: "the Best Move the Position",
  excellent: "an Excellent Move",
  good: "a Good Move",
  book: "a Book Move",
  inaccuracy: "an Inaccuracy",
  mistake: "a mistake",
  miss: "a Missed Win",
  blunder: "a Blunder",
  forcing: "only possible move",
};

export const MoveMaping: MoveMappingType = {
  brilliant: { color: "#26C2A3", item: "!!" },
  great: { color: "#749BBF", item: "!" },
  best: { color: "#81B64C", item: <BsFillStarFill /> },
  excellent: { color: "#81B64C", item: <FaThumbsUp /> },
  good: {
    color: "#77915F",
    item: <FaCheck />,
  },
  book: {
    color: "#D2C4B8",
    item: <FaBookOpen className="scale-110 text-sm" />,
  },
  inaccuracy: { color: "#F7C631", item: "?!" },
  mistake: { color: "#FFA459", item: "?" },
  miss: {
    color: "#FF7769",
    item: <IoClose className=" font-extrabold text-3xl" />,
  },
  blunder: { color: "#FA412D", item: "??" },
  forcing: { color: "#96AF8B", item: <ImArrowRight /> },
};
export const GameOverMapping: GameOverMappingType = {
  resigned: { color: "#312E2B", item: <FaFlag /> },
  draw: { color: "#DBAC16", item: "½" },
  timeout: { color: "#312E2B", item: <TbClockX /> },
  win: { color: "#DBAC16", item: <FaTrophy /> },
  checkmated: { color: "#312E2B", item: <GiPointySword /> },
};

export const mapping = { ...MoveMaping, ...GameOverMapping };

const MoveIcon: FC<{ type: AllIcons }> = ({ type }) => {
  const { color, item } = mapping[type];
  return (
    <div
      style={{
        backgroundColor: color,
      }}
      className="rounded-full size-7 relative">
      <div className="size-full bg-radial-gradient from-gray-600 to-80% z-0 opacity-40 absolute"></div>
      <div className="size-full flex items-center text-center font-bold justify-center z-10 absolute text-white">
        {item}
      </div>
    </div>
  );
};

export const MoveClass: FC<{
  type: MT;
  counts?: { white: number; black: number };
}> = ({ type, counts }) => {
  var black, white;
  if (!counts) {
    black = 0;
    white = 0;
  } else {
    black = counts.black;
    white = counts.white;
  }
  return (
    <div
      style={{ color: MoveMaping[type].color }}
      className="grid grid-cols-8 text-center text-lg w-full">
      <div className=" col-span-2">
        <AnimatedCounter to={white} round_off />
      </div>
      <div className="col-span-4">
        <div className="w-full">
          <div className="flex gap-3 items-center justify-around align-middle text-left capitalize ">
            {!counts ? (
              <>
                <div
                  style={{ backgroundColor: MoveMaping[type].color }}
                  className="rounded-full size-7 animate-pulse "></div>
                <div
                  style={{ backgroundColor: MoveMaping[type].color }}
                  className="h-5 w-20 my-1 rounded-md animate-pulse "></div>
              </>
            ) : (
              <>
                <MoveIcon type={type} />
                <div>{type}</div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className=" col-span-2">
        <AnimatedCounter to={black} round_off />
      </div>
    </div>
  );
};

export default MoveIcon;
