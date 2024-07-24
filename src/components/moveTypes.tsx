import { FC } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { FaBookOpen, FaCheck, FaFlag, FaTrophy } from "react-icons/fa";
import { IoMdThumbsUp } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { ImArrowRight } from "react-icons/im";
import { TbClockX } from "react-icons/tb";
import { GiPointySword } from "react-icons/gi";

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
  "timeout",
  "draw",
  "resign",
  "win",
  "checkmate",
] as const;

export type GOT = (typeof GameOverTypes)[number];
export type MT = (typeof allTypesOfMove)[number];
export type AllIcons = GOT | MT;

export type MoveMappingType = { [key in MT]: MoveProperty };
export type GameOverMappingType = { [key in GOT]: MoveProperty };
export type AllMappingType = MoveMappingType | GameOverMappingType;

export const MoveMaping: MoveMappingType = {
  brilliant: { color: "#26C2A3", item: "!!" },
  great: { color: "#749BBF", item: "!" },
  best: { color: "#81B64C", item: <BsFillStarFill /> },
  excellent: { color: "#81B64C", item: <IoMdThumbsUp /> },
  good: {
    color: "#77915F",
    item: (
      <FaCheck
        style={{
          textShadow: "1px 1px 3px black",
        }}
      />
    ),
  },
  book: {
    color: "#D2C4B8",
    item: (
      <FaBookOpen
        style={{
          textShadow: "1px 1px 3px black",
        }}
      />
    ),
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
  resign: { color: "#312E2B", item: <FaFlag /> },
  draw: { color: "#DBAC16", item: "½" },
  timeout: { color: "#312E2B", item: <TbClockX /> },
  win: { color: "#DBAC16", item: <FaTrophy /> },
  checkmate: { color: "#312E2B", item: <GiPointySword /> },
};

export const mapping = { ...MoveMaping, ...GameOverMapping };

const MoveIcon: FC<{ type: AllIcons }> = ({ type }) => {
  const { color, item } = mapping[type];
  return (
    <div
      style={{
        backgroundColor: color,
        textShadow: "1px 1px 3px black",
      }}
      className="rounded-full text-white font-bold size-7 flex items-center text-center justify-center">
      {item}
    </div>
  );
};

export default MoveIcon;
