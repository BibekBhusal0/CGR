import { JSX } from "react";

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
export type MoveCommentType = Record<MT, string>;

export type MoveMappingType = { [key in MT]: MoveProperty };
export type GameOverMappingType = { [key in GOT]: MoveProperty };
export type MoveIconsType = MoveMappingType | GameOverMappingType;

export const GameOverColors : Record<GOT, string>= {
  resigned: "#312E2B",
  draw: "#DBAC16",
  timeout: "#312E2B",
  win: "#DBAC16",
  checkmated: "#312E2B",
};

export const MoveTypeColors : Record<MT, string> = {
  brilliant: "#26C2A3",
  great: "#749BBF",
  best: "#81B64C",
  excellent: "#81B64C",
  good: "#77915F",
  book: "#D2C4B8",
  inaccuracy: "#F7C631",
  mistake: "#FFA459",
  miss: "#FF7769",
  blunder: "#FA412D",
  forcing: "#96AF8B",
};

export const AllColors = { ...GameOverColors, ...MoveTypeColors };

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
