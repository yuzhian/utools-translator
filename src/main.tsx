import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "/src/App";
import GlobalTheme from "/src/components/GlobalTheme.tsx";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <GlobalTheme>
        <App />
      </GlobalTheme>
    </RecoilRoot>
  </React.StrictMode>
)
