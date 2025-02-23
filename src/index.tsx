import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <HeroUIProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <main>
          <App />
        </main>
      </ThemeProvider>
    </HeroUIProvider>
  </React.StrictMode>
);

reportWebVitals();
