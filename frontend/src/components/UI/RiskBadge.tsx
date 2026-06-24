type Level = "high" | "medium" | "low";

interface Props {
  level: Level;
  message: string;
}

const styles: Record<Level, { bg: string; border: string; color: string; icon: string }> = {
  high:   { bg: "rgba(255,71,87,0.08)",   border: "#FF4757", color: "#FF4757", icon: "⚠" },
  medium: { bg: "rgba(255,184,48,0.08)",  border: "#FFB830", color: "#FFB830", icon: "⚠" },
  low:    { bg: "rgba(46,213,115,0.08)",  border: "#2ED573", color: "#2ED573", icon: "✓" },
};

export default function RiskBadge({ level, message }: Props) {
  const s = styles[level];
  return (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 10,
      padding: "0.75rem 1.2rem",
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
      color: s.color,
      fontFamily: "'Inter', sans-serif",
      fontSize: "0.88rem",
      fontWeight: 500,
    }}>
      <span>{s.icon}</span>
      <span>{message}</span>
    </div>
  );
}
