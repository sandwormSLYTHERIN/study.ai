import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Summarize() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summaries, setSummaries] = useState([]);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const res = await api.get("/ai/summaries");
      setSummaries(res.data.summaries);
    } catch (err) {
      console.error("Failed to fetch summaries");
    }
  };

  const handleSummarize = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCurrentSummary(null);
    try {
      const res = await api.post("/ai/summarize", { youtubeUrl: url, isPublic: false });
      setCurrentSummary(res.data.videoSummary);
      setUrl("");
      fetchSummaries();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to summarize. Make sure the video has English captions.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this summary?")) return;
    try {
      await api.delete("/ai/summaries/" + id);
      setSummaries(summaries.filter((s) => s._id !== id));
      if (selectedSummary && selectedSummary._id === id) setSelectedSummary(null);
    } catch (err) {
      console.error("Failed to delete");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>AI Video Summarizer</h1>
      <p style={{ color: "#6b7280", marginBottom: "25px" }}>
        Paste a YouTube URL with English captions to get an AI-generated summary
      </p>

      <div style={{ background: "#f9fafb", padding: "20px", borderRadius: "10px", marginBottom: "30px", border: "1px solid #e5e7eb" }}>
        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSummarize} style={{ display: "flex", gap: "10px" }}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            style={{ flex: 1, padding: "10px", border: "1px solid #d1d5db", borderRadius: "5px", fontSize: "1em" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "10px 20px", background: loading ? "#86efac" : "#22c55e", color: "white", border: "none", borderRadius: "5px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "500", whiteSpace: "nowrap" }}
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </form>

        {loading && (
          <p style={{ color: "#6b7280", marginTop: "10px", fontSize: "0.9em" }}>
            Fetching transcript and generating summary... This may take 20-30 seconds.
          </p>
        )}
      </div>

      {currentSummary && (
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "20px", borderRadius: "10px", marginBottom: "30px" }}>
          <h3>Summary Generated!</h3>

          <div style={{ marginBottom: "15px" }}>
            <strong>Summary:</strong>
            <p style={{ marginTop: "5px", lineHeight: "1.6" }}>{currentSummary.summary}</p>
          </div>

          {currentSummary.keyPoints && currentSummary.keyPoints.length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              <strong>Key Points:</strong>
              <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                {currentSummary.keyPoints.map((point, i) => (
                  <li key={i} style={{ marginBottom: "4px" }}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {currentSummary.expectedQuestions && currentSummary.expectedQuestions.length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              <strong>Expected Questions:</strong>
              {currentSummary.expectedQuestions.map((q, i) => (
                <div key={i} style={{ background: "white", padding: "12px", borderRadius: "5px", marginTop: "8px", border: "1px solid #d1d5db" }}>
                  <p style={{ margin: "0 0 5px 0", fontWeight: "500" }}>Q{i + 1}: {q.question}</p>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9em" }}>{q.suggestedAnswer}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {currentSummary.difficulty && (
              <span style={{ background: "#eff6ff", color: "#3b82f6", padding: "4px 12px", borderRadius: "10px", fontSize: "0.85em" }}>
                {currentSummary.difficulty}
              </span>
            )}
            {currentSummary.estimatedStudyTime && (
              <span style={{ background: "#fef9c3", color: "#ca8a04", padding: "4px 12px", borderRadius: "10px", fontSize: "0.85em" }}>
                {currentSummary.estimatedStudyTime} mins
              </span>
            )}
          </div>
        </div>
      )}

      <h3 style={{ marginBottom: "15px" }}>Past Summaries ({summaries.length})</h3>

      {summaries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", background: "#f9fafb", borderRadius: "10px" }}>
          <p>No summaries yet. Paste a YouTube URL above to get started!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {summaries.map((s) => (
            <div
              key={s._id}
              style={{ padding: "15px 20px", border: "1px solid " + (selectedSummary && selectedSummary._id === s._id ? "#22c55e" : "#e5e7eb"), borderRadius: "10px", background: "white", cursor: "pointer" }}
              onClick={() => setSelectedSummary(selectedSummary && selectedSummary._id === s._id ? null : s)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 5px 0", fontWeight: "500", fontSize: "0.9em", color: "#3b82f6" }}>
                    {s.youtubeUrl}
                  </p>
                  <p style={{ margin: "0 0 8px 0", color: "#374151", fontSize: "0.9em" }}>
                    {s.summary ? s.summary.substring(0, 120) + "..." : ""}
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {s.difficulty && (
                      <span style={{ background: "#eff6ff", color: "#3b82f6", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75em" }}>
                        {s.difficulty}
                      </span>
                    )}
                    {s.estimatedStudyTime && (
                      <span style={{ background: "#fef9c3", color: "#ca8a04", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75em" }}>
                        {s.estimatedStudyTime} mins
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(s._id); }}
                  style={{ padding: "5px 10px", background: "#ef4444", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "0.8em", marginLeft: "10px", flexShrink: 0 }}
                >
                  Delete
                </button>
              </div>

              {selectedSummary && selectedSummary._id === s._id && (
                <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #e5e7eb" }}>
                  <div style={{ marginBottom: "10px" }}>
                    <strong>Key Points:</strong>
                    <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                      {s.keyPoints && s.keyPoints.map((p, i) => (
                        <li key={i} style={{ fontSize: "0.9em", marginBottom: "3px" }}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Questions:</strong>
                    {s.expectedQuestions && s.expectedQuestions.map((q, i) => (
                      <div key={i} style={{ background: "#f9fafb", padding: "8px", borderRadius: "5px", marginTop: "6px", fontSize: "0.85em" }}>
                        <p style={{ margin: "0 0 3px 0", fontWeight: "500" }}>Q: {q.question}</p>
                        <p style={{ margin: 0, color: "#6b7280" }}>A: {q.suggestedAnswer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}