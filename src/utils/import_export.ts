import { allSaveKeys, saveType } from "@/Logic/reducers/game";
import { addToast } from "@heroui/toast";
import { store } from "@/Logic/reducers/store";
import { Chess } from "chess.js";

export const saveToJson = (data: any, fileName: string = 'games') => {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName + '.json'
  a.click();
  URL.revokeObjectURL(url);
}

export const getCurrentGameToSave = () => {
  const state = store.getState().game
  if (!state.Game || !state.analysis) return null
  const to_save: Partial<saveType> = {}
  for (let i in allSaveKeys) {
    const key = (allSaveKeys[i])
    to_save[key] = state[key] as any
  }
  to_save.pgn = state.Game.pgn()
  to_save.name = state.whitePlayer + ' VS ' + state.blackPlayer
  return to_save
}

export const saveGameJson = () => {
  const g = getCurrentGameToSave()
  if (!g) {
    addToast({ title: "Game can not be saved", color: 'danger' })
    return
  }
  saveToJson(g, g.name || 'game')
  addToast({ title: "Game saved", color: 'success' })
}

export const importGame = (game: saveType) => {
  try {
    console.log(game)
    store.dispatch({ type: 'game/loadGame', payload: game })
    const chess = new Chess()
    chess.loadPgn(game.pgn)
    store.dispatch({ type: 'game/setGame', payload: chess })
    addToast({ title: "Game Imported", color: 'success' })
  } catch (error) {
    console.error("Failed to import state", error);
    addToast({ title: "Game can not be imported", color: 'danger' })
  }
}

export const importGameFromJson = async (file: File) => {
  const text = await file.text();
  const importedState = JSON.parse(text);
  importGame(importedState)
}
