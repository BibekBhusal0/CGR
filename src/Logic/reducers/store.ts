import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import gameReducer from "./game";
import settingsReducer from "./settings";

const persistConfig = { key: "chess-settings", storage };

export const store = configureStore({
  reducer: {
    game: gameReducer,
    settings: persistReducer(persistConfig, settingsReducer),
  },
});

export type StateType = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;
export const persistor = persistStore(store);
