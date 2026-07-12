import React, { useState, useEffect } from "react";

export default function VoiceAnalyzer() {
  // Voice Recording States (Ab ye sirf isi file ke andar hain)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textStream, setTextStream] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  // Timer & Simulation Logic
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
        const phrases = ["Analyzing voice waves... ", "Acoustic signatures matching... ", "Whisper pipeline mapping... "];
        setTextStream((prev) => prev + phrases[Math.floor(Math.random() * phrases.length)]);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setRecordingTime(0);
      setTextStream("");
      setAnalysisResult(null);
    }
  };

  const analyzeVoicePipeline = () => {
    if (recordingTime === 0) return alert("Please record something first!");
    setIsRecording(false);
    setAnalysisResult({
      stress: Math.floor(Math.random() * 40) + 10,
      focus: Math.floor(Math.random() * 50) + 50,
      dominantEmotion: ["Calm", "Energetic", "Focused", "Happy"][Math.floor(Math.random() * 4)]
    });
  };

  return (
    <div>
      <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3b82f6", marginBottom: "8px" }}>
        🎙️ Live Whisper & Acoustic Energy Engine
      </h3>
      <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "30px" }}>Real-time mic capture pipeline.</p>

      {/* Recording Box */}
      <div style={{ height: "140px", border: "2px dashed rgba(255,255,255,0.08)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "15px" }}>
        {isRecording ? (
          <span style={{ fontSize: "14px", color: "#ef4444", fontWeight: "600" }}>🔴 RECORDING: {recordingTime}s</span>
        ) : (
          <button onClick={startVoiceRecording} style={{ padding: "12px 28px", backgroundColor: "#ef4444", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer" }}>
            🎤 Start Recording
          </button>
        )}
      </div>

      <textarea 
        value={textStream}
        onChange={(e) => setTextStream(e.target.value)}
        placeholder="Validation stream..."
        style={{ width: "100%", height: "110px", marginTop: "20px", backgroundColor: "#030712", color: "#fff", padding: "15px", borderRadius: "10px" }}
      />

      <button onClick={analyzeVoicePipeline} style={{ marginTop: "20px", padding: "14px 28px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer" }}>
        Analyze Pipeline Matrix
      </button>

      {/* Results */}
      {analysisResult && (
        <div style={{ marginTop: "30px", padding: "20px", background: "rgba(59,130,246,0.05)", borderRadius: "12px" }}>
          <div>Emotion: {analysisResult.dominantEmotion}</div>
          <div>Stress: {analysisResult.stress}%</div>
        </div>
      )}
    </div>
  );
}