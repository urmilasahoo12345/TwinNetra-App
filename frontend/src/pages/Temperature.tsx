import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "../store/filterStore";
import { fetchTrend, fetchTopEvents } from "../api/climate";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Plot from "react-plotly.js";

const LAYOUT = {
  paper_bgcolor: "#101928", plot_bgcolor: "#101928",
  font: { color: "#F0F4FF" },
  xaxis: { gridcolor: "rgba(0,201,200,0.08)", tickfont: { color: "#8A97B0" } },
  yaxis: { gridcolor: "rgba(0,201,200,0.08)", tickfont: { color: "#8A97B0" } },
  margin: { t: 40, b: 40, l: 50, r: 20 }, height: 340,
};

export default function Temperature() {
  const month = useFilterStore((s) => s.selectedMonth);
  const { data: trend, isLoading } = useQuery({ queryKey: ["trend", month], queryFn: () => fetchTrend(month) });
  const { data: top } = useQuery({ queryKey: ["top-temp", month], queryFn: () => fetchTopEvents("MAX_TEMP", month) });

  if (isLoading) return <LoadingSpinner text="Loading temperature data..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
      <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.2rem" }}>
        <h3 style={{ color: "var(--teal)", marginBottom: "1rem" }}>Daily Temperature Trend</h3>
        <Plot
          data={[{ x: trend?.map((d: any) => d.TIME), y: trend?.map((d: any) => d.MAX_TEMP), type: "scatter", mode: "lines", fill: "tozeroy", line: { color: "#FF6B2B" }, fillcolor: "rgba(255,107,43,0.1)" }]}
          layout={{ ...LAYOUT, yaxis: { ...LAYOUT.yaxis, title: { text: "Temperature (°C)" } } }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: "100%" }}
        />
      </div>

      {top && (
        <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.2rem" }}>
          <h3 style={{ color: "var(--teal)", marginBottom: "1rem" }}>Top 10 Hottest Events</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
              <thead>
                <tr>
                  {["Date", "Max Temp (°C)", "Rainfall (mm)", "Latitude", "Longitude"].map((h) => (
                    <th key={h} style={{ padding: "0.6rem 1rem", borderBottom: "1px solid rgba(0,201,200,0.12)", textAlign: "left", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", textTransform: "uppercase", color: "var(--muted)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {top.map((row: any, i: number) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(0,201,200,0.06)" }}>
                    <td style={{ padding: "0.55rem 1rem", color: "var(--star)" }}>{row.TIME}</td>
                    <td style={{ padding: "0.55rem 1rem", color: "#FF6B2B", fontWeight: 600 }}>{row.MAX_TEMP?.toFixed(2)}</td>
                    <td style={{ padding: "0.55rem 1rem", color: "#00C9C8" }}>{row.RAINFALL?.toFixed(2)}</td>
                    <td style={{ padding: "0.55rem 1rem", color: "var(--muted)" }}>{row.LATITUDE}</td>
                    <td style={{ padding: "0.55rem 1rem", color: "var(--muted)" }}>{row.LONGITUDE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
