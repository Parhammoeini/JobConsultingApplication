import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/resumes";

const BrainIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/>
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
  </svg>
);

const SparkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
  </svg>
);

export default function App() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [tab, setTab] = useState("pdf");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/candidates`);
      setCandidates(res.data);
    } catch {
      // silently fail
    }
  };

  const handleUpload = async () => {
    if (!name || !content) return;
    setUploadLoading(true);
    try {
      await axios.post(`${API_BASE}/upload?name=${encodeURIComponent(name)}`, content, {
        headers: { "Content-Type": "text/plain" },
      });
      setUploadSuccess(true);
      setContent("");
      await fetchCandidates();
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch {
      alert("Upload failed.");
    }
    setUploadLoading(false);
  };

  const handlePdfUpload = async () => {
    if (!name || !file) return;
    setUploadLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    try {
      await axios.post(`${API_BASE}/upload-pdf`, formData);
      setUploadSuccess(true);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchCandidates();
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch {
      alert("PDF upload failed.");
    }
    setUploadLoading(false);
  };

  const getAdvice = async () => {
    if (!query.trim() || loading) return;
    const q = query.trim();
    setLoading(true);
    setChat((prev) => [...prev, { role: "user", text: q }]);
    setQuery("");
    try {
      const params = { query: q };
      if (selectedCandidate) params.candidate = selectedCandidate;
      const res = await axios.get(`${API_BASE}/advice`, { params });
      setChat((prev) => [...prev, { role: "ai", text: res.data }]);
    } catch {
      setChat((prev) => [...prev, { role: "ai", text: "Connection error. Is the server running?" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e8e6f0",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Instrument+Serif:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2840; border-radius: 4px; }
        .glow-orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; backdrop-filter: blur(12px); }
        .tab-btn { flex: 1; padding: 8px 12px; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; background: transparent; color: #6b6880; }
        .tab-btn.active { background: rgba(139,92,246,0.15); color: #c4b5fd; border: 1px solid rgba(139,92,246,0.25); }
        .input-field { width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: #e8e6f0; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .input-field::placeholder { color: #4a4760; }
        .input-field:focus { border-color: rgba(139,92,246,0.4); }
        .candidate-chip { display: inline-flex; align-items: center; gap: 5px; padding: 5px 11px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03); color: #6b6880; font-family: 'DM Sans', sans-serif; }
        .candidate-chip:hover { border-color: rgba(139,92,246,0.3); color: #c4b5fd; }
        .candidate-chip.active { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.4); color: #c4b5fd; }
        .btn-primary { width: 100%; padding: 12px; background: linear-gradient(135deg, #7c3aed, #6d28d9); border: none; border-radius: 12px; color: white; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(124,58,237,0.4); }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .btn-primary.success { background: linear-gradient(135deg, #059669, #047857); }
        .btn-ghost { width: 100%; padding: 11px; background: transparent; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: #9794a8; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.16); color: #e8e6f0; }
        .drop-zone { border: 1.5px dashed rgba(139,92,246,0.25); border-radius: 14px; padding: 24px 16px; text-align: center; cursor: pointer; transition: all 0.2s; background: rgba(139,92,246,0.03); }
        .drop-zone:hover, .drop-zone.has-file { border-color: rgba(139,92,246,0.5); background: rgba(139,92,246,0.07); }
        .chat-bubble-user { background: linear-gradient(135deg, #7c3aed, #6d28d9); border-radius: 18px 18px 4px 18px; padding: 12px 16px; max-width: 78%; align-self: flex-end; font-size: 14px; line-height: 1.6; }
        .chat-bubble-ai { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px 18px 18px 4px; padding: 14px 18px; max-width: 85%; align-self: flex-start; font-size: 14px; line-height: 1.7; color: #ccc8db; }
        .send-btn { width: 44px; height: 44px; border-radius: 12px; border: none; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
        .send-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 4px 16px rgba(124,58,237,0.5); }
        .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .typing-dot { width: 6px; height: 6px; border-radius: 50%; background: #7c3aed; animation: blink 1.2s infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0%,80%,100%{opacity:0.2} 40%{opacity:1} }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
        .logo-text { font-family: 'Instrument Serif', serif; font-size: 22px; letter-spacing: -0.3px; }
        .logo-accent { font-style: italic; color: #a78bfa; }
        .label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #4a4760; margin-bottom: 10px; display: block; }
        .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: #3a3750; text-align: center; padding: 40px; }
        .empty-icon { width: 56px; height: 56px; border-radius: 16px; background: rgba(124,58,237,0.08); border: 1px solid rgba(124,58,237,0.15); display: flex; align-items: center; justify-content: center; color: #5b3fa0; margin-bottom: 4px; }
      `}</style>

      <div className="glow-orb" style={{ width: 400, height: 400, background: "rgba(109,40,217,0.12)", top: -100, right: -100 }} />
      <div className="glow-orb" style={{ width: 300, height: 300, background: "rgba(59,130,246,0.07)", bottom: 100, left: -80 }} />

      {/* Header */}
      <header style={{ padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c4b5fd" }}>
            <BrainIcon />
          </div>
          <span className="logo-text">Career<span className="logo-accent">Flow</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4a4760" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
          AI Online
        </div>
      </header>

      <main style={{ flex: 1, display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, padding: "24px 32px", maxWidth: 1200, width: "100%", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Left Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Upload Card */}
          <div className="card" style={{ padding: 22 }}>
            <span className="label">Upload Resume</span>
            <input className="input-field" placeholder="Candidate full name" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: 14 }} />
            <div style={{ display: "flex", gap: 6, padding: 4, background: "rgba(0,0,0,0.3)", borderRadius: 12, marginBottom: 16 }}>
              <button className={`tab-btn ${tab === "pdf" ? "active" : ""}`} onClick={() => setTab("pdf")}>PDF Upload</button>
              <button className={`tab-btn ${tab === "text" ? "active" : ""}`} onClick={() => setTab("text")}>Paste Text</button>
            </div>
            {tab === "pdf" ? (
              <>
                <div className={`drop-zone ${file ? "has-file" : ""}`} onClick={() => fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
                  <div style={{ color: file ? "#a78bfa" : "#3a3750", marginBottom: 8 }}><FileIcon /></div>
                  {file ? (
                    <><div style={{ fontSize: 13, color: "#c4b5fd", fontWeight: 500 }}>{file.name}</div><div style={{ fontSize: 11, color: "#6b6880", marginTop: 4 }}>{(file.size / 1024).toFixed(1)} KB</div></>
                  ) : (
                    <><div style={{ fontSize: 13, color: "#4a4760", fontWeight: 500 }}>Drop PDF or click to browse</div><div style={{ fontSize: 11, color: "#3a3750", marginTop: 4 }}>Extracts & embeds automatically</div></>
                  )}
                </div>
                <div style={{ marginTop: 12 }}>
                  <button className={`btn-primary ${uploadSuccess ? "success" : ""}`} onClick={handlePdfUpload} disabled={uploadLoading || !file || !name}>
                    {uploadSuccess ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><CheckIcon /> Embedded!</span> : uploadLoading ? "Processing..." : "Analyze & Embed PDF"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <textarea className="input-field" placeholder="Paste resume text here..." value={content} onChange={(e) => setContent(e.target.value)} style={{ height: 130, resize: "none", marginBottom: 12 }} />
                <button className={`btn-primary ${uploadSuccess ? "success" : ""}`} onClick={handleUpload} disabled={uploadLoading || !content || !name}>
                  {uploadSuccess ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><CheckIcon /> Stored!</span> : uploadLoading ? "Storing..." : "Ingest Resume"}
                </button>
              </>
            )}
          </div>

          {/* Candidate Selector */}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="label" style={{ marginBottom: 0 }}>Active Candidate</span>
              <button onClick={fetchCandidates} style={{ background: "none", border: "none", color: "#4a4760", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>
                <RefreshIcon /> Refresh
              </button>
            </div>
            {candidates.length === 0 ? (
              <div style={{ fontSize: 12, color: "#3a3750", textAlign: "center", padding: "12px 0" }}>No candidates yet — upload a resume</div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button className={`candidate-chip ${selectedCandidate === "" ? "active" : ""}`} onClick={() => { setSelectedCandidate(""); setChat([]); }}>All</button>
                {candidates.map((c) => (
                  <button key={c} className={`candidate-chip ${selectedCandidate === c ? "active" : ""}`} onClick={() => { setSelectedCandidate(c); setChat([]); }}>
                    <UserIcon /> {c}
                  </button>
                ))}
              </div>
            )}
            {selectedCandidate && (
              <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(139,92,246,0.08)", borderRadius: 10, fontSize: 12, color: "#a78bfa" }}>
                Asking about <strong>{selectedCandidate}</strong>
              </div>
            )}
          </div>

          {/* Hints */}
          <div className="card" style={{ padding: 18 }}>
            <span className="label" style={{ marginBottom: 12 }}>Try asking</span>
            {["What jobs fit my background?", "How can I improve my resume?", "What skills am I missing for a PM role?"].map((hint) => (
              <button key={hint} className="btn-ghost" style={{ marginBottom: 8, textAlign: "left", padding: "9px 14px", fontSize: 12 }} onClick={() => setQuery(hint)}>
                <span style={{ color: "#5b3fa0", marginRight: 6 }}><SparkIcon /></span>{hint}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ color: "#7c3aed" }}><BrainIcon /></div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e6f0" }}>AI Career Consultant</div>
                <div style={{ fontSize: 11, color: "#4a4760" }}>Powered by RAG · Groq · pgvector</div>
              </div>
            </div>
            {selectedCandidate && (
              <div style={{ fontSize: 12, color: "#7c3aed", background: "rgba(124,58,237,0.1)", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(124,58,237,0.2)" }}>
                {selectedCandidate}
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "24px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
            {chat.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><BrainIcon /></div>
                <div style={{ fontSize: 15, fontWeight: 500, color: "#4a4760" }}>
                  {selectedCandidate ? `Consulting on ${selectedCandidate}` : "Select a candidate to begin"}
                </div>
                <div style={{ fontSize: 13, color: "#2e2c3d", maxWidth: 280, lineHeight: 1.6 }}>
                  {selectedCandidate ? "Ask anything about their background, skills, or career path." : "Upload a resume and pick a candidate from the left panel."}
                </div>
              </div>
            ) : (
              chat.map((msg, i) => (
                <div key={i} className="fade-up" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
                    <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div style={{ display: "flex", gap: 5, padding: "12px 16px", alignSelf: "flex-start" }}>
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 10, alignItems: "center" }}>
            <input
              className="input-field"
              style={{ flex: 1, margin: 0 }}
              placeholder={selectedCandidate ? `Ask about ${selectedCandidate}...` : "Select a candidate first..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && getAdvice()}
            />
            <button className="send-btn" onClick={getAdvice} disabled={loading || !query.trim()}>
              <SendIcon />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
