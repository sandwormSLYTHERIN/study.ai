import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      padding: "0 40px", height: "64px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: "rgba(10,10,15,0.8)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      position: "sticky", top: 0, zIndex: 100
    }}>
      <style>{`
        .nav-link:hover { color: #fff !important; }
        .nav-link.active { color: #a5b4fc !important; }
        .logout-btn:hover { background: rgba(239,68,68,0.2) !important; border-color: rgba(239,68,68,0.4) !important; }
      `}</style>

      {/* Logo */}
      <Link
        to="/"
        style={{
          fontSize: "1.3em", fontWeight: "700", color: "#fff",
          textDecoration: "none", fontFamily: "'Georgia', serif",
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}
      >
        StudyAI
      </Link>

      {/* Center Nav Links */}
      {isAuthenticated && (
        <div style={{ display: "flex", gap: "4px" }}>
          {[
            { path: "/dash", label: "Dashboard" },
            { path: "/notes", label: "Notes" },
            { path: "/summarize", label: "AI Summarize" },
            { path: "/documents", label: "Documents" },
            { path: "/about", label: "About" }
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={"nav-link" + (isActive(item.path) ? " active" : "")}
              style={{
                padding: "6px 14px", borderRadius: "8px",
                color: isActive(item.path) ? "#a5b4fc" : "rgba(255,255,255,0.5)",
                textDecoration: "none", fontSize: "0.9em",
                fontFamily: "system-ui, sans-serif",
                background: isActive(item.path) ? "rgba(99,102,241,0.1)" : "transparent",
                transition: "color 0.2s ease"
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Right Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isAuthenticated ? (
          <>
            <span style={{
              color: "rgba(255,255,255,0.5)", fontSize: "0.85em",
              fontFamily: "system-ui, sans-serif"
            }}>
              {user?.name}
            </span>
            <button
              className="logout-btn"
              onClick={handleLogout}
              style={{
                padding: "7px 16px", background: "rgba(239,68,68,0.1)",
                color: "#f87171", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "8px", cursor: "pointer",
                fontFamily: "system-ui, sans-serif", fontSize: "0.85em",
                transition: "all 0.2s ease"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                padding: "7px 16px", color: "rgba(255,255,255,0.7)",
                textDecoration: "none", fontFamily: "system-ui, sans-serif",
                fontSize: "0.9em", borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.2s ease"
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                padding: "7px 16px",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                color: "white", textDecoration: "none",
                fontFamily: "system-ui, sans-serif", fontSize: "0.9em",
                borderRadius: "8px", fontWeight: "500"
              }}
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}