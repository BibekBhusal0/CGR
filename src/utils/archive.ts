import { openDB } from "idb";
import { idFromPgn, saveType } from "@/Logic/state/game";

const DB_NAME = "chess_archive";
const STORE_NAME = "games";

export const getDb = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
};

export const addGameToArchive = async (game: saveType) => {
  const db = await getDb();
  await db.put(STORE_NAME, { ...game, id: game.id ?? idFromPgn(game.pgn) });
};

export const getAllGamesFromArchive = async (): Promise<saveType[]> => {
  const db = await getDb();
  return db.getAll(STORE_NAME);
};

export const clearArchive = async () => {
  const db = await getDb();
  await db.clear(STORE_NAME);
};

export const importGamesToArchive = async (games: saveType[]) => {
  const db = await getDb();
  for (const game of games) {
    await db.put(STORE_NAME, { ...game, id: game.id ?? idFromPgn(game.pgn) });
  }
};
