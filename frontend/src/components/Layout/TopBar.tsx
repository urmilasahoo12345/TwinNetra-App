import { useAuthStore } from "../../store/authStore";
import { useFilterStore } from "../../store/filterStore";

export default function TopBar({ title }: { title: string }) {
  const user = useAuthStore((s) => s.user);
  const district = useFilterStore((s) => s.selectedDistrict);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.8rem 2rem", borderBottom: "1px solid rgba(0,201,200,0.08)",
      background: "var(--navy-2)", position: "sticky", top: 0, zIndex: 50,
    }}>
      <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--star)" }}>
        {title}
      </h2>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", color: "var(--teal)" }}>
          📍 {district}
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", color: "var(--muted)" }}>
          {(user as any)?.user_name ?? user?.sub}
        </span>
      </div>
    </div>
  );
}
