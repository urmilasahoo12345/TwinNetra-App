export default function HeroBanner() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0B1120 0%, #1A2540 55%, #0d1f35 100%)",
      border: "1px solid rgba(0,201,200,0.18)",
      borderRadius: 16,
      padding: "2rem 2.4rem 1.6rem",
      marginBottom: "1.4rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* scan-lines overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, rgba(0,201,200,0.022) 0px, rgba(0,201,200,0.022) 1px, transparent 1px, transparent 4px)",
      }} />
      {/* orange glow */}
      <div style={{
        position: "absolute", top: -60, right: -60,
        width: 320, height: 320,
        background: "radial-gradient(circle, rgba(255,107,43,0.11) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.2em", color: "var(--teal)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
        ISRO HACKATHON 2026 · CLIMATE INTELLIGENCE SYSTEM · ODISHA, INDIA
      </p>

      <h1 style={{
        fontFamily: "'Rajdhani', sans-serif", fontSize: "3rem", fontWeight: 700, lineHeight: 1.05,
        background: "linear-gradient(90deg, #F0F4FF 0%, #00C9C8 55%, #FF6B2B 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        margin: "0 0 0.3rem",
      }}>
        TwinNetra
      </h1>

      <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
        AI-Powered Digital Twin of Odisha's Climate &nbsp;·&nbsp; Historical · Live · Predictive
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: "1rem", flexWrap: "wrap" }}>
        {[
          { label: "● SYSTEM ONLINE", orange: false },
          { label: "● INSAT-3DR INTEGRATED", orange: false },
          { label: "IMD DATASET 2024", orange: true },
          { label: "OPEN-METEO LIVE API", orange: true },
        ].map(({ label, orange }) => (
          <span key={label} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "'Space Mono', monospace", fontSize: "0.62rem",
            background: orange ? "rgba(255,107,43,0.08)" : "rgba(0,201,200,0.08)",
            border: `1px solid ${orange ? "rgba(255,107,43,0.28)" : "rgba(0,201,200,0.28)"}`,
            color: orange ? "var(--saffron)" : "var(--teal)",
            padding: "4px 12px", borderRadius: 20, letterSpacing: "0.1em",
          }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
