import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "../store/filterStore";
import { fetchSpatial, fetchTopEvents } from "../api/climate";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Plot from "react-plotly.js";

export default function ClimateMap() {
  const [variable, setVariable] = useState<"RAINFALL" | "MAX_TEMP">("RAINFALL");
  const month = useFilterStore((s) => s.selectedMonth);
  const { data, isLoading } = useQuery({ queryKey: ["spatial", variable, month], queryFn: () => fetchSpatial(variable, month) });
  const { data: top } = useQuery({ queryKey: ["top-map", variable, month], queryFn: () => fetchTopEvents(variable, month) });

  if (isLoading) return <LoadingSpinner text="Rendering climate heatmap..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
      <div style={{ display: "flex", gap: "0.8rem" }}>
        {(["RAINFALL", "MAX_TEMP"] as const).map((v) => (
          <button key={v} onClick={() => setVariable(v)} style={{
            background: variable === v ? "rgba(0,201,200,0.12)" : "transparent",
            border: `1px solid ${variable === v ? "rgba(0,201,200,0.4)" : "rgba(0,201,200,0.15)"}`,
            color: variable === v ? "var(--teal)" : "var(--muted)",
            borderRadius: 8, padding: "0.45rem 1.2rem",
            fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Space Mono', monospace",
            transition: "all 0.18s",
          }}>
            {v === "RAINFALL" ? "Rainfall" : "Temperature"}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.2rem" }}>
        <h3 style={{ color: "var(--teal)", marginBottom: "1rem" }}>Odisha {variable} Heatmap (2024)</h3>
        {data && data.length > 0 ? (
          <Plot
            data={[{
              type: "densitymap" as any,
              lat: data.map((d: any) => d.LATITUDE),
              lon: data.map((d: any) => d.LONGITUDE),
              z: data.map((d: any) => d[variable]),
              radius: 20,
              colorscale: "Turbo",
              colorbar: { title: variable === "RAINFALL" ? "mm" : "°C", tickfont: { color: "#8A97B0" } },
            }]}
            layout={{
              mapbox: { style: "carto-darkmatter", center: { lat: 20.5, lon: 84.5 }, zoom: 5.5 },
              paper_bgcolor: "#101928", height: 520,
              margin: { t: 10, b: 10, l: 10, r: 10 },
            } as any}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: "100%" }}
          />
        ) : (
          <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
            No spatial data available. Ensure LATITUDE/LONGITUDE columns are present in the dataset.
          </p>
        )}
      </div>

      {top && (
        <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.2rem" }}>
          <h3 style={{ color: "var(--teal)", marginBottom: "1rem" }}>Top 10 High-Intensity Grid Points</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
            <thead>
              <tr>
                {["Latitude", "Longitude", variable].map((h) => (
                  <th key={h} style={{ padding: "0.6rem 1rem", borderBottom: "1px solid rgba(0,201,200,0.1)", textAlign: "left", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", textTransform: "uppercase", color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {top.map((row: any, i: number) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(0,201,200,0.06)" }}>
                  <td style={{ padding: "0.55rem 1rem", color: "var(--muted)" }}>{row.LATITUDE}</td>
                  <td style={{ padding: "0.55rem 1rem", color: "var(--muted)" }}>{row.LONGITUDE}</td>
                  <td style={{ padding: "0.55rem 1rem", color: "var(--teal)", fontWeight: 600 }}>{row[variable]?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
