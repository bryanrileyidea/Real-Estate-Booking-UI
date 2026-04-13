import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Initialize wallet config
import "./lib/walletConfig";

createRoot(document.getElementById("root")!).render(<App />);
