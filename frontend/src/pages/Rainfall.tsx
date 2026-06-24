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

export default function Rainfall() {
  const month = useFilterStore((s) => s.selectedMonth);
  const { data: trend, isLoading } = useQuery({ queryKey: ["trend", month], queryFn: () => fetchTrend(month) });
  const { data: top } = useQuery({ queryKey: ["top-rain", month], queryFn: () => fetchTopEvents("RAINFALL", month) });

  if (isLoading) return <LoadingSpinner text="Loading rainfall data..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
      <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.2rem" }}>
        <h3 style={{ color: "var(--teal)", marginBottom: "1rem" }}>Daily Rainfall Trend</h3>
        <Plot
          data={[{ x: trend?.map((d: any) => d.TIME), y: trend?.map((d: any) => d.RAINFALL), type: "scatter", mode: "lines", fill: "tozeroy", line: { color: "#00C9C8" }, fillcolor: "rgba(0,201,200,0.1)" }]}
          layout={{ ...LAYOUT, yaxis: { ...LAYOUT.yaxis, title: { text: "Rainfall (mm)" } } }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: "100%" }}
        />
      </div>

      {top && (
        <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.2rem" }}>
          <h3 style={{ color: "var(--teal)", marginBottom: "1rem" }}>Top 10 Rainfall Events</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
              <thead>
                <tr>
                  {["Date", "Rainfall (mm)", "Max Temp (°C)", "Latitude", "Longitude"].map((h) => (
                    <th key={h} style={{ padding: "0.6rem 1rem", borderBottom: "1px solid rgba(0,201,200,0.12)", textAlign: "left", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {top.map((row: any, i: number) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(0,201,200,0.06)" }}>
                    <td style={{ padding: "0.55rem 1rem", color: "var(--star)" }}>{row.TIME}</td>
                    <td style={{ padding: "0.55rem 1rem", color: "#00C9C8", fontWeight: 600 }}>{row.RAINFALL?.toFixed(2)}</td>
                    <td style={{ padding: "0.55rem 1rem", color: "#FF6B2B" }}>{row.MAX_TEMP?.toFixed(2)}</td>
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
