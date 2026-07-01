import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("voice"); // 'voice' | 'quiz' | 'behavior' | 'predictions' | 'diagnostics'
  const [username, setUsername] = useState("Alex Mercer");
  const [userInitials, setUserInitials] = useState("AM");

  // 🎙️ Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textStream, setTextStream] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  // 🧠 Personality Quiz States
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const quizQuestions = [
    { q: "Do you feel sudden mood variations during long audio recording periods?", a1: "Yes, frequently", a2: "Rarely" },
    { q: "How do you handle immediate stress when working under crunch pipelines?", a1: "Calm & Collected", a2: "Anxious / Panicked" },
    { q: "Does interactive AI telemetry help you understand your cognitive focus?", a1: "Absolutely", a2: "Not really" }
  ];

  // Fetch real authenticated user profile telemetry data
  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const parsed = JSON.parse(localUser);
      // Firebase displayName check, fallback to email prefix or static
      const fullName = parsed.displayName || parsed.email?.split("@")[0] || "User Matrix";
      setUsername(fullName);
      
      // Extract Initials
      const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
      setUserInitials(initials || "US");
    } else if (auth.currentUser) {
      const fullName = auth.currentUser.displayName || "User Matrix";
      setUsername(fullName);
      setUserInitials(fullName.slice(0,2).toUpperCase());
    }
  }, []);

  // Timer counter hook simulation for recording clock
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
        // Randomly simulate text streaming while speaking
        const phrases = ["Analyzing voice waves... ", "Acoustic signatures matching... ", "Whisper pipeline mapping... ", "Energy metrics balanced... "];
        setTextStream((prev) => prev + phrases[Math.floor(Math.random() * phrases.length)]);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      alert("Logged out securely.");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setRecordingTime(0);
      setTextStream("");
      setAnalysisResult(null);
    }
  };

  const analyzeVoicePipeline = () => {
    if (recordingTime === 0 && !textStream) {
      alert("Please record something or type thoughts first to process pipeline analytics!");
      return;
    }
    setIsRecording(false);
    setAnalysisResult({
      stress: Math.floor(Math.random() * 40) + 10,
      focus: Math.floor(Math.random() * 50) + 50,
      dominantEmotion: ["Calm", "Energetic", "Focused", "Happy"][Math.floor(Math.random() * 4)]
    });
  };

  const handleQuizAnswer = (isOptionOne) => {
    if (isOptionOne) setQuizScore(quizScore + 10);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
    }
  };

  return (
    <div style={{ backgroundColor: "#070d19", color: "#ffffff", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex" }}>
      
      {/* 🔮 Embedded Animation Effects */}
      <style>{`
        .nav-item { transition: all 0.2s ease-in-out; cursor: pointer; }
        .nav-item:hover { background-color: rgba(255,255,255,0.04); color: #fff; }
        @keyframes waveSim {
          0%, 100% { height: 10px; }
          50% { height: 45px; }
        }
      `}</style>

      {/* 🧭 LEFT SIDEBAR NAVIGATION */}
      <aside style={{ width: "260px", backgroundColor: "#0b1329", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "30px 20px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}></div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "15px", letterSpacing: "0.5px" }}>EMOTION AI</div>
            <div style={{ fontSize: "10px", color: "#6b7280" }}>Human Emotion AI System</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          {[
            { id: "voice", label: "Voice Analyzer", phase: "Phase 3 Core", icon: "🎙️" },
            { id: "quiz", label: "Personality Quiz", phase: "Phase 4 System", icon: "🧠" },
            { id: "behavior", label: "Behavioral Fusion", phase: "Phase 5 Core", icon: "⚙️" },
            { id: "predictions", label: "Predictions Engine", phase: "Phase 6 Core", icon: "🔮" },
            { id: "diagnostics", label: "Diagnostics Hub", phase: "Phase 7 View", icon: "📊" }
          ].map((tab) => {
            const isSel = activeTab === tab.id;
            return (
              <div 
                key={tab.id} 
                className="nav-item"
                onClick={() => setActiveTab(tab.id)}
                style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "12px", backgroundColor: isSel ? "rgba(59,130,246,0.15)" : "transparent", borderLeft: isSel ? "4px solid #3b82f6" : "4px solid transparent", color: isSel ? "#60a5fa" : "#9ca3af" }}
              >
                <span style={{ fontSize: "18px" }}>{tab.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>{tab.label}</div>
                  <div style={{ fontSize: "10px", color: "#52525b" }}>{tab.phase}</div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* 🖥️ MAIN WORKSPACE WORKBENCH */}
      <main style={{ flex: 1, padding: "30px 40px", display: "flex", flexDirection: "column", gap: "25px" }}>
        
        {/* TOP STATUS BAR ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* USER CHIP PROFILE BOX CARD */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#0b1329", border: "1px solid rgba(255,255,255,0.06)", padding: "12px 24px", borderRadius: "16px", minWidth: "260px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#fff", fontSize: "16px" }}>
              {userInitials}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: "700", fontSize: "15px" }}>{username}</div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>Authorized Session Personnel</div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            style={{ padding: "10px 20px", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", color: "#ef4444", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            Logout Securely 🔐
          </button>
        </div>

        {/* 📑 DYNAMIC CARD VIEWS CONTROLLER */}
        <div style={{ flex: 1, backgroundColor: "#0b1329", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "40px", textAlign: "left", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
          
          {/* VIEW A: VOICE ANALYZER MATRIX PANEL */}
          {activeTab === "voice" && (
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px", margin: "0 0 8px 0", color: "#3b82f6" }}>
                🎙️ Live Whisper & Acoustic Energy Engine
              </h3>
              <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 30px 0" }}>Real-time mic capture pipeline. No file uploads required.</p>

              {/* Simulation Visual Recording Box */}
              <div style={{ height: "140px", border: "2px dashed rgba(255,255,255,0.08)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "15px", backgroundColor: "rgba(3,7,18,0.2)", marginBottom: "25px", position: "relative" }}>
                {isRecording ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "50px" }}>
                      {[...Array(9)].map((_, i) => (
                        <div key={i} style={{ width: "4px", backgroundColor: "#3b82f6", borderRadius: "2px", animation: "waveSim 0.6s infinite ease-in-out", animationDelay: `${i * 0.08}s` }} />
                      ))}
                    </div>
                    <span style={{ fontSize: "14px", color: "#ef4444", fontWeight: "600", letterSpacing: "0.5px" }}>🔴 RECORDING TELEMETRY: {recordingTime}s</span>
                  </>
                ) : (
                  <>
                    <button onClick={startVoiceRecording} style={{ padding: "12px 28px", backgroundColor: "#ef4444", border: "none", borderRadius: "10px", color: "#fff", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 15px rgba(239,68,68,0.3)" }}>🎤 Start Recording</button>
                    <span style={{ fontSize: "12px", color: "#52525b" }}>Click to engage acoustic spectrum engine initialization capture.</span>
                  </>
                )}
              </div>

              {/* Real-time thoughts string terminal box */}
              <div style={{ marginBottom: "25px" }}>
                <textarea 
                  value={textStream}
                  onChange={(e) => setTextStream(e.target.value)}
                  placeholder="Or type your thoughts stream here for full validation analytics..."
                  style={{ width: "100%", height: "110px", backgroundColor: "#030712", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", padding: "15px", outline: "none", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>

              <button onClick={analyzeVoicePipeline} style={{ padding: "14px 28px", backgroundColor: "#3b82f6", border: "none", borderRadius: "10px", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 15px rgba(59,130,246,0.3)" }}>
                Analyze Pipeline Matrix
              </button>

              {/* Computed Simulation Target Results Panel */}
              {analysisResult && (
                <div style={{ marginTop: "30px", padding: "20px", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "12px", display: "flex", justifyContent: "space-around" }}>
                  <div><span style={{ color: "#6b7280", fontSize: "12px" }}>DOMINANT EMOTION</span><div style={{ fontSize: "20px", fontWeight: "700", color: "#10b981" }}>{analysisResult.dominantEmotion}</div></div>
                  <div><span style={{ color: "#6b7280", fontSize: "12px" }}>STRESS FACTOR</span><div style={{ fontSize: "20px", fontWeight: "700", color: "#ef4444" }}>{analysisResult.stress}%</div></div>
                  <div><span style={{ color: "#6b7280", fontSize: "12px" }}>FOCUS FREQUENCY</span><div style={{ fontSize: "20px", fontWeight: "700", color: "#3b82f6" }}>{analysisResult.focus}%</div></div>
                </div>
              )}
            </div>
          )}

          {/* VIEW B: PERSONALITY ASSESSMENT QUIZ ENGINE */}
          {activeTab === "quiz" && (
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px", margin: "0 0 8px 0", color: "#d946ef" }}>
                🧠 Personality Assessment Engine
              </h3>
              <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 35px 0" }}>Interactive dynamic trait classification scoring mechanism.</p>

              {!quizComplete ? (
                <div style={{ background: "rgba(3,7,18,0.3)", border: "1px solid rgba(255,255,255,0.05)", padding: "30px", borderRadius: "14px" }}>
                  <div style={{ color: "#d946ef", fontSize: "12px", fontWeight: "700", marginBottom: "10px", textTransform: "uppercase" }}>Question {currentQuestion + 1} of {quizQuestions.length}</div>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "600", margin: "0 0 25px 0" }}>{quizQuestions[currentQuestion].q}</h4>
                  
                  <div style={{ display: "flex", gap: "15px" }}>
                    <button onClick={() => handleQuizAnswer(true)} style={{ padding: "12px 24px", backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: "600" }}>
                      {quizQuestions[currentQuestion].a1}
                    </button>
                    <button onClick={() => handleQuizAnswer(false)} style={{ padding: "12px 24px", backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: "600" }}>
                      {quizQuestions[currentQuestion].a2}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(217,70,239,0.05)", border: "1px solid rgba(217,70,239,0.2)", borderRadius: "14px" }}>
                  <div style={{ fontSize: "40px", marginBottom: "15px" }}>🎯</div>
                  <h4 style={{ fontSize: "1.4rem", fontWeight: "700", margin: "0 0 10px 0" }}>Matrix Processing Finished!</h4>
                  <p style={{ color: "#9ca3af", fontSize: "14px", margin: "0 0 25px 0" }}>Your compiled psychological alignment index score: <strong>{quizScore} pts</strong></p>
                  <button onClick={() => { setCurrentQuestion(0); setQuizScore(0); setQuizComplete(false); }} style={{ padding: "10px 20px", backgroundColor: "#d946ef", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "700", cursor: "pointer" }}>Restart Assessment</button>
                </div>
              )}
            </div>
          )}

          {/* VIEW C, D, E: UNDER DEVELOPMENT FALLBACK HOOKS */}
          {["behavior", "predictions", "diagnostics"].includes(activeTab) && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "45px", marginBottom: "20px" }}>⚡</div>
              <h4 style={{ fontSize: "1.5rem", fontWeight: "700", margin: "0 0 10px 0" }}>System Core Initializing</h4>
              <p style={{ color: "#9ca3af", fontSize: "14px", maxWidth: "400px", margin: "0 auto" }}>
                This data telemetry pipeline layer is locked under security validation parameters. Readying multi-modal sync engine.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}