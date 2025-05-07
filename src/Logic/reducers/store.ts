import { configureStore, Middleware } from "@reduxjs/toolkit";
import gameReducer from "./game";
import settingsReducer from "./settings";
import { loadFromLocalStorage, saveToLocalStorage } from "@/utils/storage";


export const KEY = "CHESS SETTINGS"
export const loadSettings = async () => {
  const data = await loadFromLocalStorage(KEY);
  store.dispatch({ type: "settings/setSettings", payload: data })
};

const middleware: Middleware = (store) => (next) => (action: any) => {
  const val = next(action);
  const s = action.type.split("/")[0]
  if (s === 'settings') {
    saveToLocalStorage(KEY, store.getState()[s]);
  }
  return val;
};

export const store = configureStore({
  reducer: {
    game: gameReducer,
    settings: settingsReducer
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(middleware);
  },
});

export type StateType = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;

