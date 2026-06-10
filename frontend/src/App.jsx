import { useState, useEffect, useRef } from 'react';
import { calculateSilenceScore } from './services/silenceIntelligence';
import { saveAnalysis } from './config/db';
import PersonalityAssessment from './pages/PersonalityAssessment';
import PersonalityDashboard from './pages/PersonalityDashboard';
import BehavioralIntelligenceDashboard from './components/BehavioralIntelligenceDashboard';
import PredictionDashboard from './components/PredictionDashboard';
import CompleteDashboard from './components/CompleteDashboard';

function App() {
  const [silenceData, setSilenceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [entryCount, setEntryCount] = useState(0);
  const [activeTab, setActiveTab] = useState('silence');

  // --- VOICE MODE STATES & REFS ---
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    fetchSilenceScore();
  }, []);

  const fetchSilenceScore = async () => {
    setLoading(true);
    const result = await calculateSilenceScore("user_001");
    setSilenceData(result);
    setLoading(false);
  };

  // --- RECORDING CONTROLS ---
  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied or error:", err);
      alert("Microphone access is required for Voice Mode.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Track lines ko explicitly close karna system memory ke liye safe rehta hai
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // --- COMBINED HANDLE SAVE (TEXT + AUDIO BACKEND ROUTING) ---
  const handleSave = async () => {
    // Agar dono khali hain toh return ho jao
    if (!text.trim() && !audioBlob) return;
    
    setSaving(true);
    try {
      if (audioBlob) {
        // --- ROUTING TO YOUR FASTAPI AUDIO BACKEND ---
        const formData = new FormData();
        formData.append("file", audioBlob, `voice_entry_${Date.now()}.wav`);

        const response = await fetch("http://127.0.0.1:8000/predict-audio", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Backend server error while processing audio");
        
        const data = await response.json();
        
        // Whisper ka mila hua text input box mein dikha do aur save pipeline run karo
        if (data.transcribed_text) {
          await saveAnalysis(
            "user_001", 
            data.transcribed_text, 
            data.text_analysis.emotion, 
            data.text_analysis.confidence
          );
          alert(`🎤 Voice Processed!\nText: "${data.transcribed_text}"\nResult: ${data.final_decision}`);
        }
      } else {
        // --- OLD TEXT ONLY LOGIC (KEEPING YOUR ORIGINAL SCORING ENGINE SAFE) ---
        const emotions = ["joy", "fear", "sadness", "anger", "anxiety", "hope"];
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        const randomConfidence = 0.7 + Math.random() * 0.25;
        
        await saveAnalysis("user_001", text, randomEmotion, randomConfidence);
      }

      // Cleanup & Refresh States
      setText('');
      setAudioBlob(null);
      setEntryCount(prev => prev + 1);
      await fetchSilenceScore();
      
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const getColor = () => {
    if (!silenceData) return "#ccc";
    if (silenceData.risk === "Low") return "#4CAF50";
    if (silenceData.risk === "Medium") return "#FF9800";
    return "#F44336";
  };

  const getTopicColor = () => {
    if (!silenceData?.topic_avoidance) return "#ccc";
    if (silenceData.topic_avoidance.severity === "High") return "#F44336";
    if (silenceData.topic_avoidance.severity === "Medium") return "#FF9800";
    if (silenceData.topic_avoidance.severity === "Low") return "#FFC107";
    return "#4CAF50";
  };

  const getGapColor = () => {
    if (!silenceData?.response_gap) return "#ccc";
    if (silenceData.response_gap.severity === "High") return "#F44336";
    if (silenceData.response_gap.severity === "Medium") return "#FF9800";
    return "#4CAF50";
  };

  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: "0 auto" }}>
      <h1>🧠 Behavioral Intelligence AI - FYP</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Complete Behavioral Intelligence System: Emotion Detection | Silence Intelligence | Personality Tracking | Behavioral Fusion | Predictions | Explainable Dashboard
      </p>
      
      {/* Tab Navigation */}
      <div style={{ 
        display: "flex", 
        gap: 10, 
        marginBottom: 20, 
        borderBottom: "2px solid #ddd", 
        paddingBottom: 10,
        flexWrap: "wrap"
      }}>
        {['silence', 'assessment', 'dashboard', 'fusion', 'prediction', 'dashboard7'].map((tab) => {
          const tabLabels = {
            silence: "🔇 Silence Intelligence (Phase 3)",
            assessment: "🧠 Personality Assessment (Phase 4)",
            dashboard: "📊 Personality Dashboard (Phase 4)",
            fusion: "🧠 Behavioral Fusion (Phase 5)",
            prediction: "🔮 Predictions (Phase 6)",
            dashboard7: "📊 Explainable Dashboard (Phase 7)"
          };
          return (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                backgroundColor: activeTab === tab ? "#2196F3" : "#f0f0f0",
                color: activeTab === tab ? "white" : "#333",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: activeTab === tab ? "bold" : "normal",
                transition: "all 0.2s"
              }}
            >
              {tabLabels[tab]}
            </button>
          );
        })}
      </div>
      
      {/* Phase 3 - Silence Intelligence Tab */}
      {activeTab === 'silence' && (
        <>
          {/* Input Section Upgraded with Voice Mode */}
          <div style={{ 
            border: "1px solid #ddd", 
            borderRadius: 12, 
            padding: 20, 
            marginBottom: 20,
            backgroundColor: "#fafafa"
          }}>
            <h3 style={{ marginTop: 0 }}>✏️ Add Your Thought / Record Voice</h3>
            
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  backgroundColor: isRecording ? "#f44336" : "#4CAF50",
                  color: "white",
                  animation: isRecording ? "pulse 1.5s infinite" : "none"
                }}
              >
                {isRecording ? "🛑 Stop Mic" : "🎙️ Start Mic"}
              </button>
              
              {audioBlob && !isRecording && (
                <span style={{ color: "#4CAF50", fontSize: "14px", fontWeight: "bold" }}>
                  ✅ Audio captured and ready to analyze!
                </span>
              )}
              {isRecording && (
                <span style={{ color: "#f44336", fontSize: "14px", fontWeight: "bold" }}>
                  🔴 Recording... Speak now.
                </span>
              )}
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isRecording || audioBlob !== null}
              placeholder={audioBlob ? "Audio locked. Click 'Save Analysis' to upload." : "How are you feeling today? Write here or use the mic..."}
              rows={4}
              style={{ 
                width: "100%", 
                padding: 12, 
                fontSize: 14,
                borderRadius: 8,
                border: "1px solid #ccc",
                fontFamily: "inherit",
                backgroundColor: (isRecording || audioBlob) ? "#f0f0f0" : "#fff"
              }}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: 12 }}>
              <button
                onClick={handleSave}
                disabled={saving || (!text.trim() && !audioBlob) || isRecording}
                style={{
                  padding: "10px 24px",
                  fontSize: 16,
                  backgroundColor: (saving || (!text.trim() && !audioBlob) || isRecording) ? "#ccc" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: (saving || (!text.trim() && !audioBlob) || isRecording) ? "not-allowed" : "pointer"
                }}
              >
                {saving ? "💾 Saving..." : "💾 Save Analysis"}
              </button>

              {audioBlob && (
                <button
                  onClick={() => { setAudioBlob(null); setText(''); }}
                  style={{
                    padding: "10px 16px",
                    fontSize: 14,
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    cursor: "pointer"
                  }}
                >
                  🔄 Clear Audio
                </button>
              )}
            </div>

            {entryCount > 0 && entryCount < 5 && (
              <p style={{ marginTop: 12, color: "#ff9800" }}>
                📊 {entryCount}/5 entries added. {5 - entryCount} more needed for baseline!
              </p>
            )}
          </div>
          
          {/* Silence Score Display */}
          <div style={{
            border: `2px solid ${getColor()}`,
            borderRadius: 12,
            padding: 20,
            backgroundColor: "#fff"
          }}>
            <h2 style={{ marginTop: 0, textAlign: "center" }}>📊 Silence Score Report</h2>
            
            {/* Burnout Alert Section */}
            {silenceData?.burnout_alert && (
              <div style={{
                marginBottom: 20,
                padding: 15,
                borderRadius: 8,
                backgroundColor: silenceData.burnout_alert.level === "CRITICAL" ? "#ffebee" : "#fff3e0",
                border: `2px solid ${silenceData.burnout_alert.level === "CRITICAL" ? "#f44336" : "#ff9800"}`,
                textAlign: "center"
              }}>
                <h3 style={{ margin: 0, color: silenceData.burnout_alert.level === "CRITICAL" ? "#f44336" : "#ff9800" }}>
                  {silenceData.burnout_alert.level === "CRITICAL" ? "🔥 " : "⚠️ "}
                  {silenceData.burnout_alert.message}
                </h3>
                <p style={{ margin: "10px 0 0 0" }}>
                  💡 {silenceData.burnout_alert.recommendation}
                </p>
              </div>
            )}
            
            {loading ? (
              <p style={{ textAlign: "center" }}>Loading...</p>
            ) : silenceData?.silence_score !== null ? (
              <>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 64, fontWeight: "bold", color: getColor() }}>
                    {silenceData.silence_score}/100
                  </div>
                  <div style={{ fontSize: 24, fontWeight: "bold", color: getColor() }}>
                    Risk: {silenceData.risk}
                  </div>
                  <p style={{ fontSize: 16 }}>{silenceData.alert}</p>
                </div>
                
                {/* Metrics Section */}
                {silenceData.metrics && (
                  <div style={{ marginTop: 15, padding: 10, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
                    <h4 style={{ margin: "0 0 10px 0" }}>📈 Metrics</h4>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
                      <li>Message Count Change: {silenceData.metrics.message_count_change}</li>
                      <li>Message Length Change: {silenceData.metrics.length_change}</li>
                      <li>Emotion Variation Change: {silenceData.metrics.emotion_variation_change}</li>
                      <li>Topic Avoidance Score: {silenceData.metrics.topic_avoidance_score}/100</li>
                      <li>Response Gap Score: {silenceData.metrics.response_gap_score}/100</li>
                      <li>Hours Since Last Response: {silenceData.metrics.hours_since_last_response}</li>
                      <li>Writing Style Change: {silenceData.metrics.writing_style_change_score} points ({silenceData.metrics.writing_style_trend})</li>
                    </ul>
                  </div>
                )}
                
                {/* Topic Avoidance Section */}
                {silenceData.topic_avoidance && silenceData.topic_avoidance.score > 0 && (
                  <div style={{
                    marginTop: 15,
                    padding: 12,
                    backgroundColor: "#fff3e0",
                    borderRadius: 8,
                    borderLeft: `4px solid ${getTopicColor()}`
                  }}>
                    <h4 style={{ margin: 0 }}>🔍 Topic Avoidance</h4>
                    <p style={{ margin: "5px 0" }}>
                      Score: {silenceData.topic_avoidance.score}/100 
                      <span style={{ 
                        marginLeft: 10, 
                        padding: "2px 8px", 
                        borderRadius: 12, 
                        fontSize: 12,
                        backgroundColor: getTopicColor(),
                        color: "white"
                      }}>
                        {silenceData.topic_avoidance.severity}
                      </span>
                    </p>
                    {silenceData.topic_avoidance.detected_topics.length > 0 && (
                      <p style={{ margin: "5px 0", fontSize: 14 }}>
                        Avoiding: <strong>{silenceData.topic_avoidance.detected_topics.join(", ")}</strong>
                      </p>
                    )}
                  </div>
                )}
                
                {/* Response Gap Section */}
                {silenceData.response_gap && silenceData.response_gap.score !== null && (
                  <div style={{
                    marginTop: 15,
                    padding: 12,
                    backgroundColor: "#e8f4f8",
                    borderRadius: 8,
                    borderLeft: `4px solid ${getGapColor()}`
                  }}>
                    <h4 style={{ margin: 0 }}>⏱️ Response Gap</h4>
                    <p style={{ margin: "5px 0" }}>
                      Gap Score: {silenceData.response_gap.score}/100
                      <span style={{ 
                        marginLeft: 10, 
                        padding: "2px 8px", 
                        borderRadius: 12, 
                        fontSize: 12,
                        backgroundColor: getGapColor(),
                        color: "white"
                      }}>
                        {silenceData.response_gap.severity}
                      </span>
                    </p>
                    <p style={{ margin: "5px 0", fontSize: 14 }}>
                      Trend: {silenceData.response_gap.trend} 
                      {silenceData.response_gap.gap_increase !== 0 && ` (${silenceData.response_gap.gap_increase > 0 ? "+" : ""}${silenceData.response_gap.gap_increase}% change)`}
                    </p>
                    <p style={{ margin: "5px 0", fontSize: 13 }}>
                      Avg gap: {silenceData.response_gap.average_gap_hours} hours
                    </p>
                  </div>
                )}
                
                {/* Writing Style Section */}
                {silenceData.writing_style && silenceData.writing_style.current && (
                  <div style={{
                    marginTop: 15,
                    padding: 12,
                    backgroundColor: "#f0f8ff",
                    borderRadius: 8,
                    borderLeft: "4px solid #2196F3"
                  }}>
                    <h4 style={{ margin: 0 }}>✍️ Writing Style</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                      <div style={{ flex: 1, minWidth: 100 }}>
                        <small>Sentence Len</small>
                        <p style={{ margin: 0, fontWeight: "bold" }}>{silenceData.writing_style.current.sentence_length} words</p>
                      </div>
                      <div style={{ flex: 1, minWidth: 100 }}>
                        <small>Punctuation</small>
                        <p style={{ margin: 0, fontWeight: "bold" }}>! {silenceData.writing_style.current.exclamation_count} | ? {silenceData.writing_style.current.question_count}</p>
                      </div>
                      <div style={{ flex: 1, minWidth: 100 }}>
                        <small>Emojis</small>
                        <p style={{ margin: 0, fontWeight: "bold" }}>{silenceData.writing_style.current.emoji_count} used</p>
                      </div>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <strong>Style Score:</strong> {silenceData.writing_style.current.overall_score}/100
                      <span style={{ 
                        marginLeft: 10, 
                        padding: "2px 8px", 
                        borderRadius: 12, 
                        fontSize: 12,
                        backgroundColor: silenceData.writing_style.current.overall_score >= 50 ? "#f44336" : silenceData.writing_style.current.overall_score >= 30 ? "#ff9800" : "#4CAF50",
                        color: "white"
                      }}>
                        {silenceData.writing_style.current.severity}
                      </span>
                    </div>
                  </div>
                )}
                
                <hr style={{ margin: "15px 0" }} />
                <small style={{ color: "#666" }}>
                  Based on {silenceData.total_analyses} analyses | {silenceData.period}
                </small>
              </>
            ) : (
              <div style={{ textAlign: "center", color: "#ff9800" }}>
                <h3>⚠️ {silenceData?.alert || "Insufficient Data"}</h3>
                <p>Need at least 5 analyses to calculate silence score.</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Phase 4 - Personality Assessment Tab */}
      {activeTab === 'assessment' && (
        <PersonalityAssessment 
          userId="user_001" 
          onComplete={() => setActiveTab('dashboard')} 
        />
      )}
      
      {/* Phase 4 - Personality Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <PersonalityDashboard userId="user_001" />
      )}
      
      {/* Phase 5 - Behavioral Fusion Tab */}
      {activeTab === 'fusion' && (
        <BehavioralIntelligenceDashboard userId="user_001" />
      )}
      
      {/* Phase 6 - Prediction Engine Tab */}
      {activeTab === 'prediction' && (
        <PredictionDashboard userId="user_001" />
      )}
      
      {/* Phase 7 - Explainable Dashboard Tab */}
      {activeTab === 'dashboard7' && (
        <CompleteDashboard userId="user_001" />
      )}
    </div>
  );
}

export default App;