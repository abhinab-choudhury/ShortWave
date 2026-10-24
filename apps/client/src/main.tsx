import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import App from "./App.tsx";
import "./index.css";

if (Capacitor.isNativePlatform()) {
  document.documentElement.classList.add("native");
  import("@capacitor/splash-screen")
    .then(({ SplashScreen }) =>
      SplashScreen.hide({ fadeOutDuration: 180 }),
    )
    .catch(() => undefined);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
