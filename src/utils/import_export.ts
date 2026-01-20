import { allSaveKeys, saveType, useGameState } from "@/Logic/state/game";
import { addToast } from "@heroui/toast";
import { Chess } from "chess.js";

export const saveToJson = (data: unknown, fileName: string = "games") => {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName + ".json";
  a.click();
  URL.revokeObjectURL(url);
};

export const getCurrentGameToSave = () => {
  const state = useGameState.getState();
  const { Game, analysis, whitePlayer, blackPlayer } = state
  if (!Game || !analysis) return null;
  const to_save: Partial<saveType> = {};
  for (const i in allSaveKeys) {
    const key = allSaveKeys[i];
    // @ts-expect-error: safe key assignment
    to_save[key] = state[key];
  }
  to_save.pgn = Game.pgn();
  to_save.name = whitePlayer + " VS " + blackPlayer;
  return to_save;
};

export const saveGameJson = () => {
  const g = getCurrentGameToSave();
  if (!g) {
    addToast({ title: "Game can not be saved", color: "danger" });
    return;
  }
  saveToJson(g, g.name || "game");
  addToast({ title: "Game saved", color: "success" });
};

export const importGame = (game: saveType) => {
  const { loadGame, setGame } = useGameState.getState();
  try {
    loadGame(game);
    const chess = new Chess();
    chess.loadPgn(game.pgn);
    setGame(chess);
    addToast({ title: "Game Imported", color: "success" });
  } catch (error) {
    console.error("Failed to import state", error);
    addToast({ title: "Game can not be imported", color: "danger" });
  }
};

export const importGameFromJson = async (file: File) => {
  const text = await file.text();
  const importedState = JSON.parse(text);
  importGame(importedState);
};
