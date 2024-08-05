import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WebSocketProvider } from "./context/WebSocketContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WebSocketProvider url="ws://localhost:8080">
      <App />
    </WebSocketProvider>
  </React.StrictMode>
);
