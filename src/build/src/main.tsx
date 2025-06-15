import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Routes, Route, HashRouter } from "react-router";
import Home from "./screens/Home/index.tsx";
import { AppProvider } from "./contexts/AppContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </HashRouter>
        </AppProvider>
    </StrictMode>
);
