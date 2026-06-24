export default function Architecture() {
  const nodes = [
    { label: "IMD Rainfall Dataset", color: "#00C9C8", icon: "🌧" },
    { label: "IMD Temperature Dataset", color: "#00C9C8", icon: "🌡" },
    { label: "Data Processing Layer", color: "#FFB830", icon: "⚙" },
    { label: "Climate Analytics Engine", color: "#FFB830", icon: "📊" },
    { label: "Open-Meteo Live API", color: "#2ED573", icon: "📡" },
    { label: "Random Forest Prediction", color: "#FF6B2B", icon: "🧠" },
    { label: "INSAT-3DR / MOSDAC", color: "#7B8CDE", icon: "🛰" },
    { label: "FastAPI Backend", color: "#FF6B2B", icon: "⚡" },
    { label: "React + Plotly Dashboard", color: "#00C9C8", icon: "🖥" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12, padding: "2rem" }}>
        <h3 style={{ color: "var(--teal)", marginBottom: "2rem" }}>TwinNetra System Architecture</h3>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          {nodes.map((node, i) => (
            <div key={node.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                background: `${node.color}11`,
                border: `1px solid ${node.color}44`,
                borderRadius: 10, padding: "0.8rem 2rem",
                textAlign: "center", minWidth: 280,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
              }}>
                <span style={{ fontSize: "1.1rem" }}>{node.icon}</span>
                <span style={{ color: node.color, fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", fontWeight: 500 }}>
                  {node.label}
                </span>
              </div>
              {i < nodes.length - 1 && (
                <div style={{ height: 28, width: 2, background: "rgba(0,201,200,0.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <span style={{ position: "absolute", bottom: -8, color: "var(--teal)", fontSize: "0.7rem" }}>↓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(0,201,200,0.04)", border: "1px solid rgba(0,201,200,0.14)", borderRadius: 12, padding: "1.6rem" }}>
        <h3 style={{ color: "var(--teal)", marginBottom: "1rem" }}>Data Sources</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          {[
            { title: "IMD 2024 Dataset", desc: "Historical rainfall and temperature across Odisha grid points", icon: "📁" },
            { title: "Open-Meteo API", desc: "Real-time weather for all 6 major Odisha districts", icon: "🌐" },
            { title: "INSAT-3DR / MOSDAC", desc: "Satellite Land Surface Temperature (.h5 format)", icon: "🛰" },
            { title: "Random Forest Models", desc: "Trained ML models for temperature and rainfall prediction", icon: "🧠" },
          ].map(({ title, desc, icon }) => (
            <div key={title} style={{ background: "var(--navy-3)", border: "1px solid rgba(0,201,200,0.1)", borderRadius: 10, padding: "1rem 1.2rem", display: "flex", gap: "0.8rem" }}>
              <span style={{ fontSize: "1.4rem" }}>{icon}</span>
              <div>
                <p style={{ fontWeight: 600, color: "var(--star)", fontSize: "0.88rem" }}>{title}</p>
                <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.2rem" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
