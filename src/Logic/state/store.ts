import { configureStore, Middleware } from "@reduxjs/toolkit";
import gameReducer from "./game";
import settingsReducer from "./settings";
import { saveToLocalStorage, SETTINGS_KEY } from "@/utils/storage";

const middleware: Middleware = (store) => (next) => (action) => {
  const val = next(action);
  if (
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    typeof action.type === "string"
  ) {
    const s = action.type.split("/")[0];
    if (s === "settings") {
      saveToLocalStorage(SETTINGS_KEY, store.getState()[s as keyof StateType]);
    }
  }
  return val;
};

export const store = configureStore({
  reducer: {
    game: gameReducer,
    settings: settingsReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(middleware);
  },
});

export type StateType = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;
