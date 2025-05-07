import { FC, JSX } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { FaBookOpen, FaCheck, FaFlag, FaTrophy } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { ImArrowRight } from "react-icons/im";
import { TbClockX } from "react-icons/tb";
import { GiPointySword } from "react-icons/gi";
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

export const GameOverTypes = ["win", "draw", "checkmated", "resigned", "timeout"] as const;

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
    item: <IoClose className="text-3xl font-extrabold" />,
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
      className="relative size-7 rounded-full">
      <div className="bg-radial-gradient absolute z-0 size-full from-gray-600 to-80% opacity-40"></div>
      <div className="absolute z-10 flex size-full items-center justify-center text-center font-bold text-white">
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
      className="grid w-full grid-cols-8 text-center text-lg">
      <div className="col-span-2">{white}</div>
      <div className="col-span-4">
        <div className="w-full">
          <div className="flex items-center justify-around gap-3 text-left align-middle capitalize">
            {!counts ? (
              <>
                <div
                  style={{ backgroundColor: MoveMaping[type].color }}
                  className="size-7 animate-pulse rounded-full"></div>
                <div
                  style={{ backgroundColor: MoveMaping[type].color }}
                  className="my-1 h-5 w-20 animate-pulse rounded-md"></div>
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
      <div className="col-span-2">{black}</div>
    </div>
  );
};

export default MoveIcon;
