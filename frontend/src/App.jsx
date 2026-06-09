import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchSilenceScore();
  }, []);

  const fetchSilenceScore = async () => {
    setLoading(true);
    const result = await calculateSilenceScore("user_001");
    setSilenceData(result);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!text.trim()) return;
    
    setSaving(true);
    try {
      const emotions = ["joy", "fear", "sadness", "anger", "anxiety", "hope"];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomConfidence = 0.7 + Math.random() * 0.25;
      
      await saveAnalysis("user_001", text, randomEmotion, randomConfidence);
      setText('');
      setEntryCount(prev => prev + 1);
      await fetchSilenceScore();
      
      if (entryCount + 1 < 5) {
        alert(`✅ Saved! ${4 - entryCount} more entries needed.`);
      } else {
        alert(`✅ Saved! Analysis updated.`);
      }
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
        <button 
          onClick={() => setActiveTab('silence')}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === 'silence' ? "#2196F3" : "#f0f0f0",
            color: activeTab === 'silence' ? "white" : "#333",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: activeTab === 'silence' ? "bold" : "normal",
            transition: "all 0.2s"
          }}
        >
          🔇 Silence Intelligence (Phase 3)
        </button>
        <button 
          onClick={() => setActiveTab('assessment')}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === 'assessment' ? "#2196F3" : "#f0f0f0",
            color: activeTab === 'assessment' ? "white" : "#333",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: activeTab === 'assessment' ? "bold" : "normal",
            transition: "all 0.2s"
          }}
        >
          🧠 Personality Assessment (Phase 4)
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === 'dashboard' ? "#2196F3" : "#f0f0f0",
            color: activeTab === 'dashboard' ? "white" : "#333",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: activeTab === 'dashboard' ? "bold" : "normal",
            transition: "all 0.2s"
          }}
        >
          📊 Personality Dashboard (Phase 4)
        </button>
        <button 
          onClick={() => setActiveTab('fusion')}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === 'fusion' ? "#2196F3" : "#f0f0f0",
            color: activeTab === 'fusion' ? "white" : "#333",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: activeTab === 'fusion' ? "bold" : "normal",
            transition: "all 0.2s"
          }}
        >
          🧠 Behavioral Fusion (Phase 5)
        </button>
        <button 
          onClick={() => setActiveTab('prediction')}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === 'prediction' ? "#2196F3" : "#f0f0f0",
            color: activeTab === 'prediction' ? "white" : "#333",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: activeTab === 'prediction' ? "bold" : "normal",
            transition: "all 0.2s"
          }}
        >
          🔮 Predictions (Phase 6)
        </button>
        <button 
          onClick={() => setActiveTab('dashboard7')}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === 'dashboard7' ? "#2196F3" : "#f0f0f0",
            color: activeTab === 'dashboard7' ? "white" : "#333",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: activeTab === 'dashboard7' ? "bold" : "normal",
            transition: "all 0.2s"
          }}
        >
          📊 Explainable Dashboard (Phase 7)
        </button>
      </div>
      
      {/* Phase 3 - Silence Intelligence Tab */}
      {activeTab === 'silence' && (
        <>
          {/* Input Section */}
          <div style={{ 
            border: "1px solid #ddd", 
            borderRadius: 12, 
            padding: 20, 
            marginBottom: 20,
            backgroundColor: "#fafafa"
          }}>
            <h3 style={{ marginTop: 0 }}>✏️ Add Your Thought</h3>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="How are you feeling today? Write here..."
              rows={4}
              style={{ 
                width: "100%", 
                padding: 12, 
                fontSize: 14,
                borderRadius: 8,
                border: "1px solid #ccc",
                fontFamily: "inherit"
              }}
            />
            <button
              onClick={handleSave}
              disabled={saving || !text.trim()}
              style={{
                marginTop: 12,
                padding: "10px 24px",
                fontSize: 16,
                backgroundColor: saving ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: saving ? "not-allowed" : "pointer"
              }}
            >
              {saving ? "💾 Saving..." : "💾 Save Analysis"}
            </button>
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