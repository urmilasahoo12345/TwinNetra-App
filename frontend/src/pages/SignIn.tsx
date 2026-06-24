import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginApi } from "../api/auth";
import toast from "react-hot-toast";

export default function SignIn() {
  // Empty default states so you can type whatever you want
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      login(data.access_token, { sub: data.user_email, role: data.role, user_name: data.user_name } as any);
      toast.success(`Welcome, ${data.user_name}!`);
      navigate("/");
    } catch {
      // Removed the hardcoded admin hint
      toast.error("Login failed. Check your connection to the backend.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%", background: "var(--navy-3)",
    border: "1px solid rgba(0,201,200,0.2)", borderRadius: 8,
    color: "var(--star)", padding: "0.65rem 1rem", fontSize: "0.9rem",
    outline: "none", fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--navy)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background glows */}
      <div style={{ position: "absolute", top: "15%", left: "20%", width: 400, height: 400, background: "radial-gradient(circle, rgba(0,201,200,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "20%", width: 350, height: 350, background: "radial-gradient(circle, rgba(255,107,43,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        width: "100%", maxWidth: 440,
        background: "var(--navy-2)",
        border: "1px solid rgba(0,201,200,0.18)",
        borderRadius: 16, padding: "2.8rem 2.4rem",
        position: "relative", overflow: "hidden",
        boxShadow: "0 0 60px rgba(0,201,200,0.07)",
      }}>
        {/* Top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #00C9C8, #FF6B2B)" }} />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>🌦</p>
          <h1 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "2.2rem", fontWeight: 700, background: "linear-gradient(90deg, #F0F4FF, #00C9C8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            TwinNetra
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: "0.3rem" }}>
            Climate Intelligence System · Guest Access
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.4rem" }}>
              Email / Username
            </label>
            {/* 👇 FIX: Changed type="email" to type="text" so the browser allows random values */}
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
              required style={inputStyle} placeholder="Enter anything..." />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.4rem" }}>
              Password
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required style={inputStyle} placeholder="Enter anything..." />
          </div>
          <button type="submit" disabled={loading} style={{
            marginTop: "0.5rem",
            background: loading ? "rgba(255,107,43,0.4)" : "linear-gradient(135deg, #FF6B2B 0%, #d44a0b 100%)",
            color: "#fff", border: "none", borderRadius: 8,
            padding: "0.7rem", fontSize: "0.95rem", fontWeight: 600,
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.08em",
            textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 0 18px rgba(255,107,43,0.25)",
            transition: "all 0.2s",
          }}>
            {loading ? "Authenticating..." : "Enter Dashboard →"}
          </button>
        </form>
      </div>
    </div>
  );
}