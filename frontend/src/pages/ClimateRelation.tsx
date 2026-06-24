import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "../store/filterStore";
import { fetchScatter, fetchCorrelation } from "../api/climate";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Plot from "react-plotly.js";

const BASE_LAYOUT = {
  paper_bgcolor: "#101928", plot_bgcolor: "#101928",
  font: { color: "#F0F4FF" },
  xaxis: { gridcolor: "rgba(0,201,200,0.08)", tickfont: { color: "#8A97B0" } },
  yaxis: { gridcolor: "rgba(0,201,200,0.08)", tickfont: { color: "#8A97B0" } },
  margin: { t: 40, b: 40, l: 50, r: 20 }, height: 420,
};

export default function ClimateRelation() {
  const month = useFilterStore((s) => s.selectedMonth);
  const { data: scatter, isLoading } = useQuery({ queryKey: ["scatter", month], queryFn: () => fetchScatter(month) });
  const { data: corr } = useQuery({ queryKey: ["corr"], queryFn: fetchCorrelation });

  if (isLoading) return <LoadingSpinner />;

  // Dynamic helper to search keys matching both uppercase and lowercase variants safely
  const getCorrValue = (rowKey: string, colKey: string) => {
    if (!corr) return null;
    const r = corr[rowKey] ?? corr[rowKey.toLowerCase()] ?? corr[rowKey.toUpperCase()];
    if (!r) return null;
    return r[colKey] ?? r[colKey.toLowerCase()] ?? r[colKey.toUpperCase()];
  };

  const getScatterData = (key: string) => {
    if (!scatter || !Array.isArray(scatter)) return [];
    return scatter.map((d: any) => d[key] ?? d[key.toUpperCase()] ?? d[key.toLowerCase()]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
      <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.2rem" }}>
        <h3 style={{ color: "var(--teal)", marginBottom: "1rem" }}>Rainfall vs Temperature</h3>
        <Plot
          data={[{ 
            x: getScatterData("MAX_TEMP"), 
            y: getScatterData("RAINFALL"), 
            type: "scatter", mode: "markers", 
            marker: { color: "#00C9C8", opacity: 0.5, size: 5 } 
          }]}
          layout={{ ...BASE_LAYOUT, xaxis: { ...BASE_LAYOUT.xaxis, title: { text: "Max Temperature (°C)" } }, yaxis: { ...BASE_LAYOUT.yaxis, title: { text: "Rainfall (mm)" } } }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: "100%" }}
        />
      </div>

      {corr && (
        <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.4rem", maxWidth: 380 }}>
          <h3 style={{ color: "var(--teal)", marginBottom: "1rem" }}>Correlation Matrix</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr>
                <th style={{ padding: "0.5rem 1rem", color: "var(--muted)", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem" }}></th>
                <th style={{ padding: "0.5rem 1rem", color: "var(--muted)", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem" }}>RAINFALL</th>
                <th style={{ padding: "0.5rem 1rem", color: "var(--muted)", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem" }}>MAX_TEMP</th>
              </tr>
            </thead>
            <tbody>
              {["RAINFALL", "MAX_TEMP"].map((row) => (
                <tr key={row} style={{ borderBottom: "1px solid rgba(0,201,200,0.06)" }}>
                  <td style={{ padding: "0.5rem 1rem", fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "var(--teal)" }}>{row}</td>
                  {["RAINFALL", "MAX_TEMP"].map((col) => {
                    const val = getCorrValue(row, col);
                    return (
                      <td key={col} style={{ padding: "0.5rem 1rem", textAlign: "center", color: val && val > 0 ? "#2ED573" : "#FF4757" }}>
                        {val !== null && val !== undefined ? val.toFixed(3) : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}