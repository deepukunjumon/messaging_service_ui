import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App.tsx";
import { ThemeProviderCustom } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProviderCustom>
      <App />
    </ThemeProviderCustom>
  </React.StrictMode>,
);
