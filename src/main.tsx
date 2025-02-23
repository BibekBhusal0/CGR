import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NextUIProvider } from "@nextui-org/system";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "next-themes";
import "./index.css";
import { persistor, store } from "@/Logic/reducers/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextUIProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <App />
          </ThemeProvider>
        </NextUIProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
