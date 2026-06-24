import { NavLink } from "react-router-dom";
import { useFilterStore } from "../../store/filterStore";
import { useAuthStore } from "../../store/authStore";
import {
  LayoutDashboard, CloudRain, Thermometer, ScatterChart,
  Database, Map, BrainCircuit, Radio, Cpu, Satellite, LogOut,
} from "lucide-react";

const NAV = [
  { to: "/", icon: LayoutDashboard, label: "Overview" },
  { to: "/rainfall", icon: CloudRain, label: "Rainfall" },
  { to: "/temperature", icon: Thermometer, label: "Temperature" },
  { to: "/relation", icon: ScatterChart, label: "Climate Relation" },
  { to: "/map", icon: Map, label: "Climate Map" },
  { to: "/prediction", icon: BrainCircuit, label: "Prediction" },
  { to: "/live", icon: Radio, label: "Live Monitor" },
  { to: "/satellite", icon: Satellite, label: "Satellite LST" },
  { to: "/rawdata", icon: Database, label: "Raw Data" },
  { to: "/architecture", icon: Cpu, label: "Architecture" },
];

const MONTHS = ["All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DISTRICTS = ["Bhubaneswar", "Cuttack", "Puri", "Sambalpur", "Rourkela", "Balasore"];

export default function Sidebar() {
  const { selectedMonth, selectedDistrict, futureRise, setMonth, setDistrict, setFutureRise } = useFilterStore();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const labelStyle = {
    fontFamily: "'Space Mono', monospace", fontSize: "0.62rem",
    letterSpacing: "0.1em", textTransform: "uppercase" as const,
    color: "var(--muted)", display: "block", marginBottom: "0.35rem",
  };
  const selectStyle = {
    width: "100%", background: "var(--navy-3)",
    border: "1px solid rgba(0,201,200,0.18)", borderRadius: 8,
    color: "var(--star)", padding: "0.45rem 0.7rem", fontSize: "0.82rem",
    outline: "none", cursor: "pointer",
  };

  return (
    <aside style={{
      width: 220, minHeight: "100vh", background: "var(--navy-2)",
      borderRight: "1px solid rgba(0,201,200,0.1)",
      display: "flex", flexDirection: "column", padding: "1.2rem 0",
      position: "fixed", top: 0, left: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "0 1.2rem 1.2rem", borderBottom: "1px solid rgba(0,201,200,0.08)" }}>
        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--star)" }}>
          🌦 TwinNetra
        </p>
        {user && (
          <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.2rem" }}>
            {(user as any).user_name || user.sub}
          </p>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.8rem 0", overflowY: "auto" }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === "/"} style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: "0.7rem",
            padding: "0.55rem 1.2rem", fontSize: "0.84rem", fontWeight: 500,
            color: isActive ? "var(--teal)" : "var(--muted)",
            background: isActive ? "rgba(0,201,200,0.07)" : "transparent",
            borderLeft: isActive ? "2px solid var(--teal)" : "2px solid transparent",
            textDecoration: "none", transition: "all 0.18s",
          })}>
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Filters */}
      <div style={{ padding: "1rem 1.2rem", borderTop: "1px solid rgba(0,201,200,0.08)", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        <div>
          <label style={labelStyle}>Month</label>
          <select style={selectStyle} value={selectedMonth ?? "All"}
            onChange={(e) => setMonth(e.target.value === "All" ? null : parseInt(e.target.value))}>
            {MONTHS.map((m, i) => <option key={m} value={i === 0 ? "All" : i}>{m}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>District</label>
          <select style={selectStyle} value={selectedDistrict}
            onChange={(e) => setDistrict(e.target.value)}>
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Future Rise: +{futureRise}°C</label>
          <input type="range" min={0} max={5} step={0.5} value={futureRise}
            onChange={(e) => setFutureRise(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "var(--saffron)" }} />
        </div>
        <button onClick={logout} style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: "rgba(255,71,87,0.08)", border: "1px solid rgba(255,71,87,0.25)",
          borderRadius: 8, color: "var(--danger)", padding: "0.45rem 0.8rem",
          fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Inter', sans-serif",
          width: "100%",
        }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
