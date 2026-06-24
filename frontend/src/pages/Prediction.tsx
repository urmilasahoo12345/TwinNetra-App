import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchDistricts, runPrediction } from "../api/prediction";
import MetricCard from "../components/UI/MetricCard";
import RiskBadge from "../components/UI/RiskBadge";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import type { PredictionResult } from "../types";

export default function Prediction() {
  const [district, setDistrict] = useState("Bhubaneswar");
  const [rainfall, setRainfall] = useState(10);
  const [temperature, setTemperature] = useState(30);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());

  const { data: districts } = useQuery({ queryKey: ["districts"], queryFn: fetchDistricts });
  const mutation = useMutation({ mutationFn: runPrediction });
  const result: PredictionResult | undefined = mutation.data;

  const inputStyle = {
    width: "100%", background: "var(--navy-3)",
    border: "1px solid rgba(0,201,200,0.18)", borderRadius: 8,
    color: "var(--star)", padding: "0.55rem 0.8rem", fontSize: "0.88rem",
    outline: "none",
  };
  const labelStyle = {
    display: "block", fontFamily: "'Space Mono', monospace",
    fontSize: "0.62rem", letterSpacing: "0.1em",
    textTransform: "uppercase" as const, color: "var(--muted)", marginBottom: "0.35rem",
  };

  function getRiskLevel(risk: string): "high" | "medium" | "low" {
    if (risk.toLowerCase().includes("extreme") || risk.toLowerCase().includes("heatwave")) return "high";
    if (risk.toLowerCase().includes("heavy") || risk.toLowerCase().includes("high")) return "medium";
    return "low";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
      {/* Input panel */}
      <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.6rem" }}>
        <h3 style={{ color: "var(--teal)", marginBottom: "1.4rem" }}>Input Parameters</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>District</label>
            <select style={inputStyle} value={district} onChange={(e) => setDistrict(e.target.value)}>
              {(districts ?? []).map((d: string) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Rainfall (mm)</label>
            <input type="number" style={inputStyle} value={rainfall} onChange={(e) => setRainfall(parseFloat(e.target.value))} step={0.1} />
          </div>
          <div>
            <label style={labelStyle}>Temperature (°C)</label>
            <input type="number" style={inputStyle} value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} step={0.1} />
          </div>
          <div>
            <label style={labelStyle}>Month</label>
            <input type="number" min={1} max={12} style={inputStyle} value={month} onChange={(e) => setMonth(parseInt(e.target.value))} />
          </div>
          <div>
            <label style={labelStyle}>Day</label>
            <input type="number" min={1} max={31} style={inputStyle} value={day} onChange={(e) => setDay(parseInt(e.target.value))} />
          </div>
        </div>
        <button
          onClick={() => mutation.mutate({ district, rainfall, temperature, month, day })}
          disabled={mutation.isPending}
          style={{
            marginTop: "1.4rem",
            background: mutation.isPending ? "rgba(255,107,43,0.4)" : "linear-gradient(135deg, #FF6B2B, #d44a0b)",
            color: "#fff", border: "none", borderRadius: 8,
            padding: "0.65rem 2rem", fontSize: "0.95rem", fontWeight: 600,
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.08em",
            textTransform: "uppercase", cursor: mutation.isPending ? "not-allowed" : "pointer",
            boxShadow: "0 0 18px rgba(255,107,43,0.25)",
          }}>
          {mutation.isPending ? "Predicting..." : "Predict Next Day Climate →"}
        </button>
      </div>

      {mutation.isPending && <LoadingSpinner text="Running AI prediction..." />}

      {/* Results */}
      {result && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <MetricCard label="Predicted Temperature" value={`${result.predicted_temp} °C`} />
            <MetricCard label="Predicted Rainfall" value={`${result.predicted_rain} mm`} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            <RiskBadge level={getRiskLevel(result.temp_risk)} message={result.temp_risk} />
            <RiskBadge level={getRiskLevel(result.rain_risk)} message={result.rain_risk} />
          </div>
          <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "1.4rem" }}>
            <h3 style={{ color: "var(--teal)", marginBottom: "1rem" }}>Model Performance</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <MetricCard label="Temperature Model R²" value={result.temp_model_r2.toFixed(2)} />
              <MetricCard label="Rainfall Model R²" value={result.rain_model_r2.toFixed(2)} />
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--muted)", fontFamily: "'Space Mono', monospace" }}>
              Models trained on IMD 2024 climate dataset · Random Forest Regressor
            </p>
          </div>
        </>
      )}
    </div>
  );
}
