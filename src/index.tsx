import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <main>
          <App />
        </main>
      </ThemeProvider>
    </NextUIProvider>
  </React.StrictMode>
);

reportWebVitals();
