import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import EverythingProvider from "./components/everythingProvider";
import "./index.css";
import Footer from "./components/footer";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <main>
      <EverythingProvider>
        <App />
      </EverythingProvider>
      <Footer />
    </main>
  </React.StrictMode>
);
