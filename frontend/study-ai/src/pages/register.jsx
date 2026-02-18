import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    const result = await register(name, email, password);
    if (result.success) {
      navigate("/dash");
    } else {
      setError(result.message);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", color: "#fff", fontSize: "0.95em",
    fontFamily: "system-ui, sans-serif", transition: "all 0.2s ease",
    outline: "none"
  };

  const labelStyle = {
    display: "block", marginBottom: "8px", color: "rgba(255,255,255,0.6)",
    fontSize: "0.85em", fontFamily: "system-ui, sans-serif", fontWeight: "500",
    textTransform: "uppercase", letterSpacing: "0.05em"
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 20px", position: "relative", overflow: "hidden"
    }}>

      {/* Background effects */}
      <div style={{
        position: "fixed", top: "-150px", right: "-150px", width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
        borderRadius: "50%", zIndex: 0
      }} />
      <div style={{
        position: "fixed", bottom: "-150px", left: "-100px", width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
        borderRadius: "50%", zIndex: 0
      }} />
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reg-input:focus {
          border-color: rgba(34,197,94,0.6) !important;
          background: rgba(34,197,94,0.05) !important;
        }
        .reg-btn:hover {
          opacity: 0.9 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 30px rgba(34,197,94,0.3) !important;
        }
      `}</style>

      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: "420px",
        animation: "fadeUp 0.6s ease forwards"
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{
            fontSize: "2rem", fontFamily: "'Georgia', serif",
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            margin: "0 0 8px 0"
          }}>
            StudyAI
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "system-ui, sans-serif", fontSize: "0.95em" }}>
            Create your account and start studying smarter.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px", padding: "40px"
        }}>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171", padding: "12px 16px", borderRadius: "10px",
              marginBottom: "20px", fontSize: "0.9em", fontFamily: "system-ui, sans-serif"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Full Name</label>
              <input
                className="reg-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Email</label>
              <input
                className="reg-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Password</label>
              <input
                className="reg-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                className="reg-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
                style={inputStyle}
              />
            </div>

            <button
              className="reg-btn"
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "rgba(34,197,94,0.4)" : "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "white", border: "none", borderRadius: "10px",
                fontSize: "1em", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "system-ui, sans-serif", transition: "all 0.2s ease"
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p style={{
            marginTop: "24px", textAlign: "center",
            color: "rgba(255,255,255,0.4)", fontFamily: "system-ui, sans-serif",
            fontSize: "0.9em"
          }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#a5b4fc", fontWeight: "500" }}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}