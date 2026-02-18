import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Documents() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [studyGuide, setStudyGuide] = useState(null);
  const [asking, setAsking] = useState(false);
  const [activeTab, setActiveTab] = useState("ask");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data.notes);
    } catch (err) {
      console.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!selectedNote) return;
    setAsking(true);
    setAiResponse("");
    try {
      const res = await api.post("/ai/analyze-document/" + selectedNote._id, { question });
      setAiResponse(res.data.aiResponse);
    } catch (err) {
      setAiResponse("Failed to get AI response. Please try again.");
    } finally {
      setAsking(false);
    }
  };

  const handleStudyGuide = async () => {
    if (!selectedNote) return;
    setAsking(true);
    setStudyGuide(null);
    try {
      const res = await api.post("/ai/study-guide/" + selectedNote._id);
      setStudyGuide(res.data.studyGuide);
    } catch (err) {
      setStudyGuide({ error: "Failed to generate study guide." });
    } finally {
      setAsking(false);
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setAiResponse("");
    setStudyGuide(null);
    setQuestion("");
  };

  return (
    <div style={{
  padding: "20px",
  maxWidth: "1000px",
  margin: "0 auto",
  color: "#111827"
}}>

      <h1>Document AI Assistant</h1>
      <p style={{ color: "#6b7280", marginBottom: "25px" }}>
        Select a document and ask AI questions about it
      </p>

      {loading ? (
        <p>Loading documents...</p>
      ) : notes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "#f9fafb", borderRadius: "10px", color: "#6b7280" }}>
          <p style={{ fontSize: "1.3em" }}>No documents uploaded yet</p>
          <a
            href="/notes"
            style={{ display: "inline-block", marginTop: "15px", padding: "10px 20px", background: "#3b82f6", color: "white", borderRadius: "5px", textDecoration: "none", fontWeight: "500" }}
          >
            Upload Notes First
          </a>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px" }}>

          <div>
            <h3 style={{ marginBottom: "10px" }}>Your Documents</h3>
            <div style={{ display: "grid", gap: "8px" }}>
              {notes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => handleSelectNote(note)}
                  style={{ padding: "12px 15px", border: "2px solid " + (selectedNote && selectedNote._id === note._id ? "#3b82f6" : "#e5e7eb"), borderRadius: "8px", cursor: "pointer", background: selectedNote && selectedNote._id === note._id ? "#eff6ff" : "white" }}
                >
                  <p style={{ margin: "0 0 3px 0", fontWeight: "600", fontSize: "0.9em" }}>
                    {note.title}
                  </p>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "0.8em" }}>
                    {note.subject || "No subject"} | {note.fileType ? note.fileType.toUpperCase() : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            {!selectedNote ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px", background: "#f9fafb", borderRadius: "10px", color: "#6b7280", border: "2px dashed #e5e7eb" }}>
                <p>Select a document to get started</p>
              </div>
            ) : (
              <div>
                <div style={{ padding: "15px", background: "#eff6ff", borderRadius: "8px", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: "0 0 3px 0" }}>{selectedNote.title}</h4>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85em" }}>
                      {selectedNote.subject} | {selectedNote.fileType ? selectedNote.fileType.toUpperCase() : ""}
                    </p>
                  </div>
                  <a
                    href={selectedNote.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: "6px 14px", background: "#22c55e", color: "white", borderRadius: "5px", textDecoration: "none", fontSize: "0.85em", fontWeight: "500" }}
                  >
                    View File
                  </a>
                </div>

                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                  <button
                    onClick={() => setActiveTab("ask")}
                    style={{ padding: "8px 18px", background: activeTab === "ask" ? "#3b82f6" : "#f3f4f6", color: activeTab === "ask" ? "white" : "#374151", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "500" }}
                  >
                    Ask AI
                  </button>
                  <button
                    onClick={() => { setActiveTab("guide"); if (!studyGuide) handleStudyGuide(); }}
                    style={{ padding: "8px 18px", background: activeTab === "guide" ? "#a855f7" : "#f3f4f6", color: activeTab === "guide" ? "white" : "#374151", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "500" }}
                  >
                    Study Guide
                  </button>
                </div>

                {activeTab === "ask" && (
                  <div>
                    <form onSubmit={handleAskAI}>
                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask anything about this document..."
                        required
                        rows={3}
                        style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "5px", fontSize: "0.9em", resize: "vertical", marginBottom: "10px", fontFamily: "inherit" }}
                      />
                      <button
                        type="submit"
                        disabled={asking}
                        style={{ width: "100%", padding: "10px", background: asking ? "#93c5fd" : "#3b82f6", color: "white", border: "none", borderRadius: "5px", cursor: asking ? "not-allowed" : "pointer", fontWeight: "500" }}
                      >
                        {asking ? "Thinking..." : "Ask AI"}
                      </button>
                    </form>

                    {aiResponse && (
                      <div style={{ marginTop: "15px", padding: "15px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", lineHeight: "1.6" }}>
                        <strong>AI Response:</strong>
                        <p style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>{aiResponse}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "guide" && (
                  <div>
                    {asking ? (
                      <p style={{ color: "#6b7280" }}>Generating study guide...</p>
                    ) : studyGuide ? (
                      <div>
                        {studyGuide.error && (
                          <p style={{ color: "#dc2626" }}>{studyGuide.error}</p>
                        )}
                        {studyGuide.overview && (
                          <div style={{ marginBottom: "15px" }}>
                            <strong>Overview:</strong>
                            <p style={{ marginTop: "5px" }}>{studyGuide.overview}</p>
                          </div>
                        )}
                        {studyGuide.keyTopics && studyGuide.keyTopics.length > 0 && (
                          <div style={{ marginBottom: "15px" }}>
                            <strong>Key Topics:</strong>
                            <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                              {studyGuide.keyTopics.map((topic, i) => (
                                <li key={i} style={{ marginBottom: "3px" }}>{topic}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {studyGuide.studyQuestions && studyGuide.studyQuestions.length > 0 && (
                          <div style={{ marginBottom: "15px" }}>
                            <strong>Study Questions:</strong>
                            {studyGuide.studyQuestions.map((q, i) => (
                              <div key={i} style={{ background: "#f9fafb", padding: "10px", borderRadius: "5px", marginTop: "8px", border: "1px solid #e5e7eb" }}>
                                <p style={{ margin: "0 0 3px 0", fontWeight: "500", fontSize: "0.9em" }}>{q.question}</p>
                                <span style={{ background: "#fef9c3", color: "#ca8a04", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75em" }}>
                                  {q.difficulty}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        {studyGuide.studyTips && studyGuide.studyTips.length > 0 && (
                          <div style={{ marginBottom: "15px" }}>
                            <strong>Study Tips:</strong>
                            <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                              {studyGuide.studyTips.map((tip, i) => (
                                <li key={i} style={{ marginBottom: "3px", fontSize: "0.9em" }}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {studyGuide.estimatedStudyTime && (
                          <div style={{ background: "#fef9c3", padding: "10px", borderRadius: "5px", display: "inline-block" }}>
                            Estimated Study Time: {studyGuide.estimatedStudyTime} hours
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}