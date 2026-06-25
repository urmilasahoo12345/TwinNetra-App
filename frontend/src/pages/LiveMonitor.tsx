import { useQuery } from "@tanstack/react-query";
import { fetchLiveComparison } from "../api/live";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Plot from "react-plotly.js";

const STATUS_COLORS: Record<string, string> = {
  "Above Normal": "#FF6B2B",
  "Below Normal": "#00C9C8",
  "Normal": "#2ED573",
  "Unavailable": "#8A97B0",
};

export default function LiveMonitor() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["live"],
    queryFn: fetchLiveComparison,
    refetchInterval: 300_000, // 👈 CHANGED: Now polls every 5 minutes (300,000 ms)
  });

  if (isLoading) return <LoadingSpinner text="Fetching live weather data..." />;

  // Safely parse double-stringified JSON
  const safeData = typeof data === "string" ? JSON.parse(data) : (data || []);
  const valid = safeData.filter((d: any) => d.live_temp !== null && d.live_temp !== undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ color: "var(--teal)" }}>Live vs Historical Comparison</h3>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.2rem" }}>
            Auto-refreshes every 5 minutes · Open-Meteo API {/* 👈 CHANGED: Updated UI text */}
          </p>
        </div>
        <button onClick={() => refetch()} style={{
          background: "rgba(0,201,200,0.07)", border: "1px solid rgba(0,201,200,0.25)",
          color: "var(--teal)", borderRadius: 8, padding: "0.4rem 1rem",
          fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Space Mono', monospace",
        }}>
          ↺ Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
          <thead>
            <tr style={{ background: "rgba(0,201,200,0.04)" }}>
              {["District", "Live Temp (°C)", "Historical Temp (°C)", "Difference", "Humidity (%)", "Rain (mm)", "Status"].map((h) => (
                <th key={h} style={{ padding: "0.8rem 1rem", textAlign: "left", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", textTransform: "uppercase", color: "var(--muted)", borderBottom: "1px solid rgba(0,201,200,0.1)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeData.map((row: any) => (
              <tr key={row.district} style={{ borderBottom: "1px solid rgba(0,201,200,0.06)" }}>
                <td style={{ padding: "0.6rem 1rem", fontWeight: 600, color: "var(--star)" }}>{row.district}</td>
                <td style={{ padding: "0.6rem 1rem", color: "#FF6B2B" }}>{row.live_temp ?? "—"}</td>
                <td style={{ padding: "0.6rem 1rem", color: "var(--muted)" }}>{row.historical_temp ?? "—"}</td>
                <td style={{ padding: "0.6rem 1rem", color: (row.difference ?? 0) > 0 ? "#FF4757" : "#2ED573" }}>
                  {row.difference !== null && row.difference !== undefined ? `${row.difference > 0 ? "+" : ""}${row.difference}` : "—"}
                </td>
                <td style={{ padding: "0.6rem 1rem", color: "var(--muted)" }}>{row.humidity ?? "—"}</td>
                <td style={{ padding: "0.6rem 1rem", color: "#00C9C8" }}>{row.rainfall ?? "—"}</td>
                <td style={{ padding: "0.6rem 1rem" }}>
                  <span style={{
                    background: `${STATUS_COLORS[row.status] ?? "#8A97B0"}22`,
                    border: `1px solid ${STATUS_COLORS[row.status] ?? "#8A97B0"}55`,
                    color: STATUS_COLORS[row.status] ?? "#8A97B0",
                    borderRadius: 20, padding: "2px 10px",
                    fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
                  }}>
                    {row.status}
                  </span>
                  {/* 🚨 This will display the actual Python crash message from Open-Meteo! */}
                  {row.error && (
                    <div style={{ color: "#FF4757", fontSize: "0.65rem", marginTop: "6px", maxWidth: "150px" }}>
                      Error: {row.error}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}