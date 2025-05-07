import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import EverythingProvider from "./components/everythingProvider";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <EverythingProvider>
      <App />
    </EverythingProvider>
  </React.StrictMode>
);
