import { BsFillStarFill } from "react-icons/bs";
import { FaCheck, FaBookOpen } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa6";
import { ImArrowRight } from "react-icons/im";
import { IoClose } from "react-icons/io5";
import { MoveMappingType } from "./types";

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
