import React from "react";
import ReactDOM from "react-dom/client";
import App from "/src/App";
import GlobalTheme from "/src/components/GlobalTheme.tsx";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalTheme>
      <App />
    </GlobalTheme>
  </React.StrictMode>
)
