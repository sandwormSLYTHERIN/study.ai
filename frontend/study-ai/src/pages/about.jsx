import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Georgia', serif" }}>

      {/* Background effects */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px"
      }} />
      <div style={{
        position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
        borderRadius: "50%", zIndex: 0
      }} />
      <div style={{
        position: "fixed", bottom: "0", left: "-100px", width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
        borderRadius: "50%", zIndex: 0
      }} />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .tech-card:hover {
          transform: translateY(-4px) !important;
          border-color: rgba(99,102,241,0.4) !important;
          background: rgba(99,102,241,0.08) !important;
        }
        .team-card:hover {
          transform: translateY(-6px) !important;
          border-color: rgba(168,85,247,0.4) !important;
        }
        .back-btn:hover {
          background: rgba(99,102,241,0.2) !important;
          border-color: rgba(99,102,241,0.5) !important;
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Back Button */}
        <div style={{ padding: "30px 40px" }}>
          <button
            className="back-btn"
            onClick={() => navigate("/")}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)", padding: "8px 20px", borderRadius: "8px",
              cursor: "pointer", fontFamily: "system-ui, sans-serif", fontSize: "0.9em",
              transition: "all 0.3s ease"
            }}
          >
            ← Back to Home
          </button>
        </div>

        {/* Hero */}
        <div style={{
          textAlign: "center", padding: "40px 40px 80px",
          animation: "fadeUp 0.8s ease forwards"
        }}>
          <div style={{
            display: "inline-block", background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.3)", borderRadius: "50px",
            padding: "6px 16px", marginBottom: "30px",
            fontSize: "0.85em", color: "#a5b4fc", fontFamily: "system-ui, sans-serif"
          }}>
            About StudyAI
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)", margin: "0 0 24px 0", lineHeight: "1.1"
          }}>
            Built for{" "}
            <span style={{
              background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899, #6366f1)",
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite"
            }}>
              students
            </span>
            ,<br />by a student.
          </h1>

          <p style={{
            fontSize: "1.15em", color: "rgba(255,255,255,0.55)", maxWidth: "580px",
            margin: "0 auto", lineHeight: "1.8", fontFamily: "system-ui, sans-serif"
          }}>
            StudyAI was born from a simple frustration — spending hours watching lecture videos
            and manually creating study notes. We built the tool we always wished existed.
          </p>
        </div>

        {/* Mission */}
        <div style={{
          maxWidth: "900px", margin: "0 auto 80px", padding: "0 40px"
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.05))",
            border: "1px solid rgba(99,102,241,0.2)", borderRadius: "24px", padding: "48px"
          }}>
            <h2 style={{ fontSize: "1.8rem", margin: "0 0 20px 0", color: "#a5b4fc" }}>
              Our Mission
            </h2>
            <p style={{
              fontSize: "1.1em", color: "rgba(255,255,255,0.65)", lineHeight: "1.8",
              margin: 0, fontFamily: "system-ui, sans-serif"
            }}>
              To make quality education accessible and efficient for every student.
              We believe AI should reduce the time spent on passive learning and increase
              the time spent on active understanding. StudyAI automates the tedious parts
              of studying so you can focus on what matters — truly understanding the material.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{ maxWidth: "1000px", margin: "0 auto 80px", padding: "0 40px" }}>
          <h2 style={{
            textAlign: "center", fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            marginBottom: "40px",
            background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.6))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            Built with modern technology
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
            {[
              { name: "React.js", desc: "Frontend", icon: "⚛️", color: "#61dafb" },
              { name: "Node.js", desc: "Backend", icon: "🟢", color: "#22c55e" },
              { name: "MongoDB", desc: "Database", icon: "🍃", color: "#4db33d" },
              { name: "Llama 3.3", desc: "AI Model", icon: "🦙", color: "#f59e0b" },
              { name: "Cloudinary", desc: "File Storage", icon: "☁️", color: "#6366f1" },
              { name: "GROQ", desc: "AI Inference", icon: "⚡", color: "#a855f7" }
            ].map((tech) => (
              <div
                key={tech.name}
                className="tech-card"
                style={{
                  padding: "24px 20px", textAlign: "center",
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px", transition: "all 0.3s ease", cursor: "default"
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{tech.icon}</div>
                <div style={{ fontWeight: "600", color: tech.color, fontSize: "0.95em", marginBottom: "4px", fontFamily: "system-ui, sans-serif" }}>
                  {tech.name}
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8em", fontFamily: "system-ui, sans-serif" }}>
                  {tech.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Detail */}
        <div style={{ maxWidth: "900px", margin: "0 auto 80px", padding: "0 40px" }}>
          <h2 style={{
            textAlign: "center", fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            marginBottom: "40px",
            background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.6))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            What makes StudyAI different
          </h2>

          <div style={{ display: "grid", gap: "16px" }}>
            {[
              {
                title: "🔐 Secure Authentication",
                desc: "JWT-based authentication with role-based access control. Your data is private and protected.",
                color: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)"
              },
              {
                title: "⚡ Lightning Fast AI",
                desc: "Powered by GROQ's inference engine running Llama 3.3 70B — one of the fastest AI inference platforms available.",
                color: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)"
              },
              {
                title: "☁️ Cloud-Native Storage",
                desc: "All files stored on Cloudinary's global CDN. Access your study materials from anywhere, instantly.",
                color: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)"
              },
              {
                title: "🧠 Smart Caching",
                desc: "Already summarized a video? We cache results in MongoDB so you never wait for the same content twice.",
                color: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)"
              }
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "24px 28px", borderRadius: "16px",
                  background: item.color, border: "1px solid " + item.border,
                  display: "flex", alignItems: "flex-start", gap: "16px"
                }}
              >
                <div>
                  <h4 style={{
                    margin: "0 0 8px 0", fontSize: "1rem", color: "#fff",
                    fontFamily: "'Georgia', serif"
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "0.9em",
                    lineHeight: "1.6", fontFamily: "system-ui, sans-serif"
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "40px 40px 80px" }}>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "16px 40px", background: "linear-gradient(135deg, #6366f1, #a855f7)",
              color: "white", border: "none", borderRadius: "12px", fontSize: "1.05em",
              fontWeight: "600", cursor: "pointer", fontFamily: "system-ui, sans-serif",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Start Studying Smarter →
          </button>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center", padding: "30px 40px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.3)", fontSize: "0.85em",
          fontFamily: "system-ui, sans-serif"
        }}>
          © 2025 StudyAI. Made with ❤️ for students everywhere.
        </div>

      </div>
    </div>
  );
}