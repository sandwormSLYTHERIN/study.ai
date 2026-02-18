import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Georgia', serif", overflow: "hidden" }}>

      {/* Animated background grid */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        animation: "gridPulse 8s ease-in-out infinite"
      }} />

      {/* Glowing orbs */}
      <div style={{
        position: "fixed", top: "-200px", left: "-200px", width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        borderRadius: "50%", zIndex: 0, animation: "float1 10s ease-in-out infinite"
      }} />
      <div style={{
        position: "fixed", bottom: "-200px", right: "-100px", width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
        borderRadius: "50%", zIndex: 0, animation: "float2 12s ease-in-out infinite"
      }} />
      <div style={{
        position: "fixed", top: "40%", left: "60%", width: "300px", height: "300px",
        background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
        borderRadius: "50%", zIndex: 0, animation: "float3 15s ease-in-out infinite"
      }} />

      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(80px, 60px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-60px, -80px) scale(1.15); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(40px, -40px); }
          66% { transform: translate(-30px, 30px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(99,102,241,0); }
        }
        .hero-btn:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 20px 40px rgba(99,102,241,0.4) !important;
        }
        .hero-btn-secondary:hover {
          transform: translateY(-3px) !important;
          border-color: rgba(255,255,255,0.6) !important;
          background: rgba(255,255,255,0.05) !important;
        }
        .feature-card:hover {
          transform: translateY(-8px) !important;
          border-color: rgba(99,102,241,0.5) !important;
          background: rgba(99,102,241,0.08) !important;
        }
        .stat-item:hover {
          transform: scale(1.05) !important;
        }
      `}</style>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Hero Section */}
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center",
          padding: "80px 40px"
        }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "50px", padding: "6px 16px", marginBottom: "40px",
            animation: "fadeUp 0.6s ease forwards",
            fontSize: "0.85em", color: "#a5b4fc", letterSpacing: "0.05em"
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
            AI-Powered Study Platform
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: "700", lineHeight: "1.05",
            margin: "0 0 24px 0", animation: "fadeUp 0.8s ease 0.1s both",
            fontFamily: "'Georgia', serif"
          }}>
            <span style={{ display: "block", color: "#fff" }}>Study</span>
            <span style={{
              display: "block",
              background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899, #6366f1)",
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite, fadeUp 0.8s ease 0.2s both"
            }}>
              Smarter.
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2.5vw, 1.3rem)", color: "rgba(255,255,255,0.6)",
            maxWidth: "600px", lineHeight: "1.7", margin: "0 0 48px 0",
            animation: "fadeUp 0.8s ease 0.3s both", fontFamily: "system-ui, sans-serif"
          }}>
            Upload your notes, summarize YouTube lectures with AI, and get personalized study guides — all in one place.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center",
            animation: "fadeUp 0.8s ease 0.4s both"
          }}>
            <button
              className="hero-btn"
              onClick={() => navigate(isAuthenticated ? "/dash" : "/register")}
              style={{
                padding: "16px 36px", background: "linear-gradient(135deg, #6366f1, #a855f7)",
                color: "white", border: "none", borderRadius: "12px", fontSize: "1.05em",
                fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease",
                fontFamily: "system-ui, sans-serif", letterSpacing: "0.02em"
              }}
            >
              {isAuthenticated ? "Go to Dashboard →" : "Get Started Free →"}
            </button>
            <button
              className="hero-btn-secondary"
              onClick={() => navigate("/about")}
              style={{
                padding: "16px 36px", background: "transparent",
                color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px", fontSize: "1.05em", fontWeight: "500",
                cursor: "pointer", transition: "all 0.3s ease",
                fontFamily: "system-ui, sans-serif"
              }}
            >
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: "60px", marginTop: "80px", flexWrap: "wrap", justifyContent: "center",
            animation: "fadeUp 0.8s ease 0.5s both"
          }}>
            {[
              { number: "3x", label: "Faster Learning" },
              { number: "AI", label: "Powered Summaries" },
              { number: "∞", label: "Study Materials" }
            ].map((stat) => (
              <div key={stat.label} className="stat-item" style={{ textAlign: "center", transition: "transform 0.3s ease", cursor: "default" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#6366f1", fontFamily: "'Georgia', serif" }}>
                  {stat.number}
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85em", marginTop: "4px", fontFamily: "system-ui, sans-serif" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div style={{ padding: "80px 40px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)", margin: "0 0 16px 0",
              background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.6))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontFamily: "'Georgia', serif"
            }}>
              Everything you need to excel
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1em", fontFamily: "system-ui, sans-serif" }}>
              Three powerful tools. One seamless experience.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {[
              {
                icon: "📚",
                title: "Smart Note Storage",
                desc: "Upload PDFs, images, and documents. Organized, tagged, and accessible anywhere with Cloudinary's global CDN.",
                color: "#6366f1",
                bg: "rgba(99,102,241,0.05)"
              },
              {
                icon: "🤖",
                title: "AI Video Summarizer",
                desc: "Paste any YouTube lecture URL. Our AI extracts transcripts, generates summaries, key points, and study questions instantly.",
                color: "#a855f7",
                bg: "rgba(168,85,247,0.05)"
              },
              {
                icon: "📄",
                title: "Document Intelligence",
                desc: "Ask AI anything about your uploaded documents. Get study guides, analysis, and personalized learning paths.",
                color: "#22c55e",
                bg: "rgba(34,197,94,0.05)"
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="feature-card"
                style={{
                  padding: "32px", borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: feature.bg, transition: "all 0.3s ease", cursor: "default"
                }}
              >
                <div style={{
                  fontSize: "2.5rem", marginBottom: "20px",
                  width: "64px", height: "64px", borderRadius: "16px",
                  background: "rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  margin: "0 0 12px 0", fontSize: "1.2rem", color: feature.color,
                  fontFamily: "'Georgia', serif"
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  margin: 0, color: "rgba(255,255,255,0.55)", lineHeight: "1.7",
                  fontFamily: "system-ui, sans-serif", fontSize: "0.95em"
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div style={{ padding: "80px 40px", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "60px",
            background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.6))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            fontFamily: "'Georgia', serif"
          }}>
            How it works
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px" }}>
            {[
              { step: "01", title: "Create Account", desc: "Sign up in seconds. No credit card needed." },
              { step: "02", title: "Upload Materials", desc: "Add your PDFs, notes, and study documents." },
              { step: "03", title: "AI Analysis", desc: "Let AI summarize videos and analyze your docs." },
              { step: "04", title: "Study Smarter", desc: "Use AI-generated guides and questions to master topics." }
            ].map((item) => (
              <div key={item.step} style={{ position: "relative" }}>
                <div style={{
                  fontSize: "3rem", fontWeight: "800", color: "rgba(99,102,241,0.2)",
                  fontFamily: "'Georgia', serif", lineHeight: 1, marginBottom: "12px"
                }}>
                  {item.step}
                </div>
                <h4 style={{
                  margin: "0 0 8px 0", color: "#fff", fontSize: "1rem",
                  fontFamily: "'Georgia', serif"
                }}>
                  {item.title}
                </h4>
                <p style={{
                  margin: 0, color: "rgba(255,255,255,0.45)", fontSize: "0.85em",
                  lineHeight: "1.6", fontFamily: "system-ui, sans-serif"
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ padding: "80px 40px", textAlign: "center" }}>
          <div style={{
            maxWidth: "600px", margin: "0 auto",
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))",
            border: "1px solid rgba(99,102,241,0.3)", borderRadius: "24px", padding: "60px 40px"
          }}>
            <h2 style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)", margin: "0 0 16px 0",
              color: "#fff", fontFamily: "'Georgia', serif"
            }}>
              Ready to transform how you study?
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.55)", marginBottom: "32px",
              fontFamily: "system-ui, sans-serif", lineHeight: "1.6"
            }}>
              Join students already using StudyAI to learn faster and smarter.
            </p>
            <button
              className="hero-btn"
              onClick={() => navigate(isAuthenticated ? "/dash" : "/register")}
              style={{
                padding: "16px 40px", background: "linear-gradient(135deg, #6366f1, #a855f7)",
                color: "white", border: "none", borderRadius: "12px", fontSize: "1.05em",
                fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease",
                fontFamily: "system-ui, sans-serif"
              }}
            >
              {isAuthenticated ? "Go to Dashboard →" : "Start for Free →"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center", padding: "40px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.3)", fontSize: "0.85em",
          fontFamily: "system-ui, sans-serif"
        }}>
          © 2025 StudyAI. Built with React, Node.js, MongoDB & Llama AI.
        </div>

      </div>
    </div>
  );
}