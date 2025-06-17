import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./components/UserContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <UserProvider>
      {" "}
      {/* ✅ 追加で App をラップ */}
      <App />
    </UserProvider>
  </React.StrictMode>
);
