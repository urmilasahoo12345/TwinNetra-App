import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "../store/filterStore";
import { fetchScenario } from "../api/satellite";
import MetricCard from "../components/UI/MetricCard";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Plot from "react-plotly.js";

export default function SatelliteLST() {
  const futureRise = useFilterStore((s) => s.futureRise);
  const { data, isLoading } = useQuery({
    queryKey: ["satellite", futureRise],
    queryFn: () => fetchScenario(futureRise),
  });

  if (isLoading) return <LoadingSpinner text="Processing INSAT-3DR data..." />;
  if (!data?.loaded) return <div style={{ color: "var(--danger)", padding: "2rem" }}>MOSDAC LST file not found. Place the .h5 file in the backend directory.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        <MetricCard label="Average LST" value={`${data.avg_lst} °C`} />
        <MetricCard label="Maximum LST" value={`${data.max_lst} °C`} />
        <MetricCard label="Minimum LST" value={`${data.min_lst} °C`} />
      </div>

      {/* Scatter map */}
      <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.2rem" }}>
        <h3 style={{ color: "var(--teal)", marginBottom: "1rem" }}>Odisha Satellite Land Surface Temperature</h3>
        <Plot
          data={[{
            type: "scatter",
            x: data.points.map((p: any) => p.lon),
            y: data.points.map((p: any) => p.lat),
            mode: "markers",
            marker: {
              color: data.points.map((p: any) => p.lst),
              colorscale: "Turbo", size: 4, opacity: 0.8,
              colorbar: { title: "LST (°C)", tickfont: { color: "#8A97B0" } },
            },
          }]}
          layout={{
            paper_bgcolor: "#101928", plot_bgcolor: "#101928",
            font: { color: "#F0F4FF" }, height: 560,
            xaxis: { title: { text: "Longitude" }, gridcolor: "rgba(0,201,200,0.08)", tickfont: { color: "#8A97B0" } },
            yaxis: { title: { text: "Latitude" }, gridcolor: "rgba(0,201,200,0.08)", tickfont: { color: "#8A97B0" } },
            margin: { t: 20, b: 50, l: 60, r: 20 },
          }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: "100%" }}
        />
      </div>

      {/* Scenario simulator */}
      <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.4rem" }}>
        <h3 style={{ color: "var(--teal)", marginBottom: "1rem" }}>Climate Scenario Simulator</h3>
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "1rem" }}>
          Adjust "Future Temperature Rise" in the sidebar to simulate scenarios.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
          <MetricCard label="Current Avg LST" value={`${data.avg_lst} °C`} />
          <MetricCard label={`Projected LST (+${futureRise}°C)`} value={`${data.future_lst} °C`} delta={`+${futureRise} °C scenario`} deltaType="negative" />
        </div>
        <Plot
          data={[{
            type: "bar",
            x: ["Current", `+${futureRise}°C Future`],
            y: [data.avg_lst, data.future_lst],
            marker: { color: ["#00C9C8", "#FF6B2B"] },
          }]}
          layout={{
            paper_bgcolor: "#101928", plot_bgcolor: "#101928",
            font: { color: "#F0F4FF" }, height: 280, showlegend: false,
            xaxis: { gridcolor: "rgba(0,201,200,0.08)", tickfont: { color: "#8A97B0" } },
            yaxis: { title: { text: "Temperature (°C)" }, gridcolor: "rgba(0,201,200,0.08)", tickfont: { color: "#8A97B0" } },
            margin: { t: 20, b: 40, l: 60, r: 20 },
          }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
