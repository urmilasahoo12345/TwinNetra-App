import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const PAGE_TITLES: Record<string, string> = {
  "/": "Climate Overview",
  "/rainfall": "Rainfall Analytics",
  "/temperature": "Temperature Analytics",
  "/relation": "Climate Relation",
  "/map": "Climate Heatmap",
  "/prediction": "AI Prediction Engine",
  "/live": "Live Monitor",
  "/satellite": "Satellite LST",
  "/rawdata": "Raw Data",
  "/architecture": "System Architecture",
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? "TwinNetra";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar title={title} />
        <main style={{ flex: 1, padding: "1.6rem 2rem", maxWidth: 1300, width: "100%" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
