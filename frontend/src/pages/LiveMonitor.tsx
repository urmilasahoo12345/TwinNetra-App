import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { fetchLiveComparison } from "../api/live";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const STATUS_COLORS: Record<string, string> = {
  "Above Normal": "#FF6B2B",
  "Below Normal": "#00C9C8",
  "Normal": "#2ED573",
  "Unavailable": "#8A97B0",
};

// 🌟 New combined fetch function
const fetchCombinedData = async () => {
  // 1. Get historical baseline from your Render backend
  const rawHistorical = await fetchLiveComparison();
  const historicalData = typeof rawHistorical === "string" ? JSON.parse(rawHistorical) : (rawHistorical || []);

  // 2. Fetch live data for each district directly from the browser to avoid IP bans
  const combined = await Promise.all(
    historicalData.map(async (item: any) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${item.lat}&longitude=${item.lon}&current=temperature_2m,relative_humidity_2m,rain`;
        const res = await axios.get(url);
        const current = res.data.current;

        const live_temp = current.temperature_2m;
        const diff = item.historical_temp ? Number((live_temp - item.historical_temp).toFixed(2)) : 0;

        let status = "Normal";
        if (diff > 2) status = "Above Normal";
        else if (diff < -2) status = "Below Normal";

        return {
          ...item,
          live_temp,
          humidity: current.relative_humidity_2m,
          rainfall: current.rain,
          difference: diff,
          status,
          error: null
        };
      } catch (err: any) {
        return {
          ...item,
          live_temp: null,
          humidity: null,
          rainfall: null,
          difference: null,
          status: "Unavailable",
          error: "API Blocked or Offline",
        };
      }
    })
  );
  return combined;
};

export default function LiveMonitor() {
  const { data: safeData, isLoading, refetch } = useQuery({
    queryKey: ["live_combined"],
    queryFn: fetchCombinedData,
    refetchInterval: 300_000, // 5 minutes
  });

  if (isLoading) return <LoadingSpinner text="Fetching live weather data..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ color: "var(--teal)" }}>Live vs Historical Comparison</h3>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.2rem" }}>Auto-refreshes every 5 minutes · Client-Side Fetch</p>
        </div>
        <button onClick={() => refetch()} style={{
          background: "rgba(0,201,200,0.07)", border: "1px solid rgba(0,201,200,0.25)",
          color: "var(--teal)", borderRadius: 8, padding: "0.4rem 1rem",
          fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Space Mono', monospace",
        }}>
          ↺ Refresh
        </button>
      </div>

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
            {(safeData || []).map((row: any) => (
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