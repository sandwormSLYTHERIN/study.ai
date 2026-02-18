import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ color: "#fff", fontFamily: "system-ui, sans-serif" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dash-card:hover {
          transform: translateY(-6px) !important;
          border-color: rgba(99,102,241,0.4) !important;
        }
        .dash-btn:hover {
          opacity: 0.9 !important;
          transform: translateY(-2px) !important;
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: "40px", animation: "fadeUp 0.6s ease forwards"
      }}>
        <div>
          <h1 style={{
            fontSize: "2.2rem", margin: "0 0 6px 0",
            fontFamily: "'Georgia', serif",
            background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.7))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            Welcome back, {user?.name || "Student"} 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: "0.95em" }}>
            What would you like to study today?
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 20px", background: "rgba(239,68,68,0.1)",
            color: "#f87171", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "8px", cursor: "pointer", fontSize: "0.9em",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
        >
          Logout
        </button>
      </div>

      {/* Feature Cards */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px", marginBottom: "40px"
      }}>
        {[
          {
            icon: "📚",
            title: "Notes",
            desc: "Upload and manage your study materials",
            btn: "Go to Notes",
            path: "/notes",
            color: "#6366f1",
            bg: "rgba(99,102,241,0.08)",
            border: "rgba(99,102,241,0.2)",
            btnBg: "linear-gradient(135deg, #6366f1, #4f46e5)"
          },
          {
            icon: "🤖",
            title: "AI Summaries",
            desc: "Summarize YouTube videos with AI",
            btn: "Summarize Video",
            path: "/summarize",
            color: "#22c55e",
            bg: "rgba(34,197,94,0.08)",
            border: "rgba(34,197,94,0.2)",
            btnBg: "linear-gradient(135deg, #22c55e, #16a34a)"
          },
          {
            icon: "📄",
            title: "Documents",
            desc: "Ask AI about your uploaded documents",
            btn: "View Documents",
            path: "/documents",
            color: "#a855f7",
            bg: "rgba(168,85,247,0.08)",
            border: "rgba(168,85,247,0.2)",
            btnBg: "linear-gradient(135deg, #a855f7, #9333ea)"
          }
        ].map((card, i) => (
          <div
            key={card.title}
            className="dash-card"
            style={{
              padding: "32px 28px", borderRadius: "20px",
              background: card.bg, border: "1px solid " + card.border,
              transition: "all 0.3s ease", textAlign: "center",
              animation: "fadeUp 0.6s ease " + (i * 0.1) + "s both"
            }}
          >
            <div style={{
              fontSize: "2.8rem", marginBottom: "16px",
              width: "72px", height: "72px", borderRadius: "18px",
              background: "rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              {card.icon}
            </div>
            <h3 style={{
              margin: "0 0 10px 0", fontSize: "1.2rem",
              color: card.color, fontFamily: "'Georgia', serif"
            }}>
              {card.title}
            </h3>
            <p style={{
              margin: "0 0 24px 0", color: "rgba(255,255,255,0.5)",
              fontSize: "0.9em", lineHeight: "1.5"
            }}>
              {card.desc}
            </p>
            <button
              className="dash-btn"
              onClick={() => navigate(card.path)}
              style={{
                padding: "10px 24px", background: card.btnBg,
                color: "white", border: "none", borderRadius: "10px",
                cursor: "pointer", fontWeight: "600", fontSize: "0.9em",
                transition: "all 0.2s ease", fontFamily: "system-ui, sans-serif"
              }}
            >
              {card.btn}
            </button>
          </div>
        ))}
      </div>

      {/* Profile Card */}
      <div style={{
        padding: "28px 32px", borderRadius: "20px",
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
        animation: "fadeUp 0.6s ease 0.4s both"
      }}>
        <h3 style={{
          margin: "0 0 20px 0", fontSize: "1rem",
          color: "rgba(255,255,255,0.5)", textTransform: "uppercase",
          letterSpacing: "0.1em", fontFamily: "system-ui, sans-serif",
          fontWeight: "600"
        }}>
          Your Profile
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {[
            { label: "Name", value: user?.name },
            { label: "Email", value: user?.email },
            { label: "Role", value: user?.role || "student" }
          ].map((item) => (
            <div key={item.label} style={{
              padding: "16px 20px", borderRadius: "12px",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)"
            }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8em", marginBottom: "6px", fontFamily: "system-ui, sans-serif" }}>
                {item.label}
              </div>
              <div style={{ color: "#fff", fontWeight: "500", fontFamily: "system-ui, sans-serif" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}