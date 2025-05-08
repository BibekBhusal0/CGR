import { FaFlag, FaTrophy } from "react-icons/fa";
import { GiPointySword } from "react-icons/gi";
import { TbClockX } from "react-icons/tb";
import { GameOverMappingType } from "./types";

export const GameOverMapping: GameOverMappingType = {
  resigned: { color: "#312E2B", item: <FaFlag /> },
  draw: { color: "#DBAC16", item: "½" },
  timeout: { color: "#312E2B", item: <TbClockX /> },
  win: { color: "#DBAC16", item: <FaTrophy /> },
  checkmated: { color: "#312E2B", item: <GiPointySword /> },
};
