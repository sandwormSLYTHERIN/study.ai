import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data.notes);
    } catch (err) {
      setError("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file");
    setUploading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("tags", tags);
    formData.append("description", description);
    try {
      await api.post("/notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Note uploaded successfully!");
      setTitle("");
      setSubject("");
      setTags("");
      setDescription("");
      setFile(null);
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete("/notes/" + id);
      setNotes(notes.filter((n) => n._id !== id));
      setSuccess("Note deleted successfully");
    } catch (err) {
      setError("Failed to delete note");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>My Notes</h1>

      <div style={{ background: "#f9fafb", padding: "20px", borderRadius: "10px", marginBottom: "30px", border: "1px solid #e5e7eb" }}>
        <h3 style={{ marginBottom: "15px" }}>Upload New Note</h3>

        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#dcfce7", color: "#16a34a", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleUpload}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 1 Notes"
                required
                style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "5px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "5px" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. algebra, calculus"
              style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "5px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "5px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>File * (PDF, Image, DOC - max 10MB)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
              required
              style={{ width: "100%" }}
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            style={{ padding: "10px 25px", background: uploading ? "#93c5fd" : "#3b82f6", color: "white", border: "none", borderRadius: "5px", cursor: uploading ? "not-allowed" : "pointer", fontWeight: "500" }}
          >
            {uploading ? "Uploading..." : "Upload Note"}
          </button>
        </form>
      </div>

      <h3 style={{ marginBottom: "15px" }}>My Notes ({notes.length})</h3>

      {loading ? (
        <p style={{ color: "#6b7280" }}>Loading notes...</p>
      ) : notes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", background: "#f9fafb", borderRadius: "10px" }}>
          <p style={{ fontSize: "1.2em" }}>No notes yet</p>
          <p>Upload your first study material above!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {notes.map((note) => (
            <div
              key={note._id}
              style={{ padding: "15px 20px", border: "1px solid #e5e7eb", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white" }}
            >
              <div>
                <h4 style={{ margin: "0 0 4px 0" }}>{note.title}</h4>
                <p style={{ margin: "0 0 6px 0", color: "#6b7280", fontSize: "0.85em" }}>
                  {note.subject ? "Subject: " + note.subject + " | " : ""}
                  Type: {note.fileType ? note.fileType.toUpperCase() : "N/A"} | Size: {(note.fileSize / 1024).toFixed(1)} KB
                </p>
                {note.tags && note.tags.length > 0 && (
                  <div>
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{ background: "#eff6ff", color: "#3b82f6", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75em", marginRight: "5px" }}
                      >
                        {"#" + tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ padding: "6px 14px", background: "#22c55e", color: "white", borderRadius: "5px", textDecoration: "none", fontSize: "0.85em", fontWeight: "500" }}
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(note._id)}
                  style={{ padding: "6px 14px", background: "#ef4444", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "0.85em", fontWeight: "500" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}