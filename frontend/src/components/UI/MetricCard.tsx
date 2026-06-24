interface Props {
  label: string;
  value: string;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
}

export default function MetricCard({ label, value, delta, deltaType = "neutral" }: Props) {
  const deltaColor =
    deltaType === "positive" ? "var(--success)" :
    deltaType === "negative" ? "var(--danger)" :
    "var(--muted)";

  return (
    <div style={{
      background: "var(--navy-3)",
      border: "1px solid rgba(0,201,200,0.14)",
      borderRadius: 12,
      padding: "1.1rem 1.3rem",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 0 16px rgba(0,201,200,0.08)",
      transition: "border-color 0.22s, box-shadow 0.22s",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, #00C9C8, #FF6B2B)",
      }} />
      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.62rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--muted)",
        marginBottom: "0.4rem",
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: "1.9rem",
        fontWeight: 700,
        color: "var(--star)",
        lineHeight: 1.1,
      }}>
        {value}
      </p>
      {delta && (
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", color: deltaColor, marginTop: "0.3rem" }}>
          {delta}
        </p>
      )}
    </div>
  );
}
