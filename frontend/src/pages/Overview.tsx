import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "../store/filterStore";
import { fetchOverview, fetchTrend, fetchMonthlyAverages } from "../api/climate";
import MetricCard from "../components/UI/MetricCard";
import RiskBadge from "../components/UI/RiskBadge";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Plot from "react-plotly.js";
import HeroBanner from "../components/Layout/HeroBanner";

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PLOT_LAYOUT = {
  paper_bgcolor: "#101928", plot_bgcolor: "#101928",
  font: { color: "#F0F4FF", family: "Inter, sans-serif" },
  xaxis: { gridcolor: "rgba(0,201,200,0.08)", tickfont: { color: "#8A97B0" } },
  yaxis: { gridcolor: "rgba(0,201,200,0.08)", tickfont: { color: "#8A97B0" } },
  legend: { bgcolor: "rgba(16,25,40,0.8)" },
  margin: { t: 40, b: 40, l: 50, r: 20 },
};

export default function Overview() {
  const month = useFilterStore((s) => s.selectedMonth);

  const { data: overview, isLoading: ol } = useQuery({ queryKey: ["overview", month], queryFn: () => fetchOverview(month) });
  const { data: trend, isLoading: tl } = useQuery({ queryKey: ["trend", month], queryFn: () => fetchTrend(month) });
  const { data: monthly } = useQuery({ queryKey: ["monthly"], queryFn: fetchMonthlyAverages });

  if (ol || tl) return <LoadingSpinner text="Loading climate data..." />;

  // 🛡️ BULLETPROOF PARSER: Forces stringified API payloads back into JSON objects
  const safeTrend = typeof trend === "string" ? JSON.parse(trend) : (trend || []);
  const safeMonthly = typeof monthly === "string" ? JSON.parse(monthly) : (monthly || {});
  
  // Debug Log: Check your browser console (F12) to see the exact structure!
  console.log("Parsed Monthly Data:", safeMonthly);

  const riskLevel = (overview?.heatwave_count ?? 0) > 100 ? "high" : (overview?.heatwave_count ?? 0) > 20 ? "medium" : "low";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
      <HeroBanner />

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <MetricCard label="Avg Rainfall" value={`${overview?.avg_rainfall ?? 0} mm`} />
        <MetricCard label="Avg Temperature" value={`${overview?.avg_temp ?? 0} °C`} />
        <MetricCard label="Max Rainfall" value={`${overview?.max_rainfall ?? 0} mm`} />
        <MetricCard label="Max Temperature" value={`${overview?.max_temp ?? 0} °C`} />
      </div>

      <RiskBadge level={riskLevel} message={`Heatwave Risk — ${overview?.heatwave_count ?? 0} records ≥ 40°C`} />

      {/* Trend line */}
      {safeTrend.length > 0 && (
        <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.2rem" }}>
          <h3 style={{ marginBottom: "1rem", color: "var(--teal)" }}>Climate Trend 2024</h3>
          <Plot
            data={[
              { x: safeTrend.map((d: any) => d.TIME ?? d.time), y: safeTrend.map((d: any) => d.RAINFALL ?? d.rainfall), name: "Rainfall (mm)", type: "scatter", mode: "lines", line: { color: "#00C9C8", width: 2 } },
              { x: safeTrend.map((d: any) => d.TIME ?? d.time), y: safeTrend.map((d: any) => d.MAX_TEMP ?? d.max_temp), name: "Max Temp (°C)", type: "scatter", mode: "lines", line: { color: "#FF6B2B", width: 2 }, yaxis: "y2" },
            ]}
            layout={{ ...PLOT_LAYOUT, yaxis2: { overlaying: "y", side: "right", gridcolor: "rgba(255,107,43,0.06)" }, hovermode: "x unified", height: 340 }}
            config={{ displayModeBar: false, responsive: true }} style={{ width: "100%" }}
          />
        </div>
      )}

      {/* Monthly bars */}
      {Object.keys(safeMonthly).length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {[
            { key: "rainfall", label: "Monthly Avg Rainfall", color: "#00C9C8", unit: "mm", yKey: "RAINFALL" },
            { key: "temperature", label: "Monthly Avg Temperature", color: "#FF6B2B", unit: "°C", yKey: "MAX_TEMP" },
          ].map(({ key, label, color, unit, yKey }) => {
            // Safely grab the array regardless of casing
            const dataset = safeMonthly[key] || safeMonthly[key.toUpperCase()] || [];
            
            return (
              <div key={key} style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.2rem" }}>
                <h3 style={{ marginBottom: "1rem", color: "var(--teal)" }}>{label}</h3>
                <Plot
                  data={[{
                    // 👇 FIX 1: Explicitly append " 2024" to the month string
                    x: dataset.map((d: any) => {
                      const monthName = MONTH_NAMES[d.MONTH ?? d.month ?? 0] || "Unknown";
                      return `${monthName} 2024`;
                    }),
                    y: dataset.map((d: any) => d[yKey] ?? d[yKey.toLowerCase()] ?? d[key] ?? 0),
                    type: "bar", marker: { color, opacity: 0.8 }, name: unit,
                  }]}
                  layout={{ 
                    ...PLOT_LAYOUT, 
                    // 👇 FIX 2: Force the axis to treat inputs as text categories
                    xaxis: { ...PLOT_LAYOUT.xaxis, type: 'category' },
                    height: 280, 
                    showlegend: false 
                  }}
                  config={{ displayModeBar: false, responsive: true }} style={{ width: "100%" }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}