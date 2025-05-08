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

