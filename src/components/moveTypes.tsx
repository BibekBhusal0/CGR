import { FC } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { FaBookOpen, FaCheck } from "react-icons/fa";
import { IoMdThumbsUp } from "react-icons/io";
import { IoClose } from "react-icons/io5";

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
export type MT = (typeof allTypesOfMove)[number];

type MoveMappingType = { [key in MT]: MoveProperty };

export const MoveMaping: MoveMappingType = {
  brilliant: { color: "#26C2A3", item: "!!" },
  great: { color: "#749BBF", item: "!" },
  best: { color: "#81B64C", item: <BsFillStarFill /> },
  excellent: { color: "#81B64C", item: <IoMdThumbsUp /> },
  good: { color: "#77915F", item: <FaCheck /> },
  book: { color: "#D2C4B8", item: <FaBookOpen /> },
  inaccuracy: { color: "#F7C631", item: "?!" },
  mistake: { color: "#FFA459", item: "?" },
  miss: { color: "#FF7769", item: <IoClose /> },
  blunder: { color: "#FA412D", item: "??" },
  forcing: { color: "", item: "" },
};

const MoveType: FC<{ type: MT }> = ({ type }) => {
  const { color, item } = MoveMaping[type];
  return (
    <div
      style={{ backgroundColor: color }}
      className="rounded-full text-white font-bold aspect-square w-7 flex items-center text-center justify-center ">
      {item}
    </div>
  );
};

export default MoveType;
