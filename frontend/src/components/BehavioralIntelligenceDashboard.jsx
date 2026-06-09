// src/components/BehavioralIntelligenceDashboard.jsx
import { useState, useEffect } from 'react';
import { calculateBehavioralIntelligence } from '../services/behavioralFusion';

function BehavioralIntelligenceDashboard({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await calculateBehavioralIntelligence(userId);
      console.log("Behavioral Intelligence:", result);
      setData(result);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 24 }}>🧠</div>
        <p>Analyzing behavioral patterns...</p>
        <p style={{ fontSize: 12, color: "#666" }}>Combining Emotion AI + Hidden Emotion + Silence Intelligence + Personality Evolution</p>
      </div>
    );
  }

  if (error || data?.error) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <h3>❌ Error Loading Data</h3>
        <p>{error || data?.error}</p>
        <button onClick={fetchData} style={{ padding: "10px 20px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>
          Retry
        </button>
      </div>
    );
  }

  if (data?.requires_more_data) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <h3>📊 More Data Needed</h3>
        <p>To calculate your Behavioral Intelligence Score, we need:</p>
        <ul style={{ textAlign: "left", display: "inline-block" }}>
          {(!data.components?.emotional_intelligence?.score || data.components.emotional_intelligence.score === 0) && (
            <li>✅ Add more emotion analyses (at least 5 entries)</li>
          )}
          {(!data.components?.personality_balance?.score || data.components.personality_balance.score === 0) && (
            <li>✅ Complete personality assessment</li>
          )}
        </ul>
        <p>Go to <strong>Silence Intelligence</strong> and <strong>Personality Assessment</strong> tabs to add data.</p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 75) return "#4CAF50";
    if (score >= 60) return "#8BC34A";
    if (score >= 45) return "#FFC107";
    if (score >= 30) return "#FF9800";
    return "#F44336";
  };

  const getLevelColor = (level) => {
    if (level === "Excellent") return "#4CAF50";
    if (level === "Good") return "#8BC34A";
    if (level === "Well-Balanced") return "#8BC34A";
    if (level === "Moderate") return "#FFC107";
    if (level === "Balanced") return "#FFC107";
    if (level === "Developing") return "#FF9800";
    return "#F44336";
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1>🧠 Behavioral Intelligence Fusion Engine</h1>
      <p style={{ color: "#666", marginBottom: 30 }}>
        Phase 5: Emotion AI + Hidden Emotion + Silence Intelligence + Personality Evolution = Behavioral Intelligence Score
      </p>
      
      {/* Formula Display */}
      <div style={{
        textAlign: "center",
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 14
      }}>
        <strong>Formula:</strong> Emotion AI (25%) + Hidden Emotion (15%) + Silence Intelligence (30%) + Personality Evolution (30%) = Final Score
      </div>
      
      {/* Main Score Card */}
      <div style={{
        textAlign: "center",
        padding: 40,
        borderRadius: 20,
        background: `linear-gradient(135deg, ${getScoreColor(data.behavioral_intelligence_score)}20, white)`,
        border: `2px solid ${getScoreColor(data.behavioral_intelligence_score)}`,
        marginBottom: 30
      }}>
        <div style={{ fontSize: 20, color: "#666" }}>Behavioral Intelligence Score</div>
        <div style={{ fontSize: 80, fontWeight: "bold", color: getScoreColor(data.behavioral_intelligence_score) }}>
          {data.behavioral_intelligence_score}/100
        </div>
        <div style={{
          display: "inline-block",
          padding: "5px 15px",
          borderRadius: 20,
          backgroundColor: getLevelColor(data.level),
          color: "white",
          marginTop: 10
        }}>
          {data.level}
        </div>
        <p style={{ marginTop: 20, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
          {data.recommendation}
        </p>
      </div>
      
      {/* Insights */}
      {data.insights && data.insights.length > 0 && (
        <div style={{
          backgroundColor: "#e3f2fd",
          padding: 15,
          borderRadius: 12,
          marginBottom: 30
        }}>
          <h3 style={{ margin: 0, marginBottom: 10 }}>💡 Key Insights</h3>
          <ul style={{ margin: 0 }}>
            {data.insights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Component Scores - 4 Components */}
      <h3>📊 Component Analysis</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {/* Emotional Intelligence */}
        <div style={{ flex: 1, minWidth: 220, border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
          <h4 style={{ margin: 0 }}>😊 Emotion AI</h4>
          <div style={{ fontSize: 32, fontWeight: "bold", color: getScoreColor(data.components?.emotional_intelligence?.score || 0) }}>
            {data.components?.emotional_intelligence?.score || 0}/100
          </div>
          <div style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: 12,
            fontSize: 12,
            backgroundColor: getLevelColor(data.components?.emotional_intelligence?.level),
            color: "white",
            marginTop: 5
          }}>
            {data.components?.emotional_intelligence?.level}
          </div>
          <p style={{ fontSize: 14, color: "#666", marginTop: 10 }}>{data.components?.emotional_intelligence?.message}</p>
          <small>Confidence: {data.components?.emotional_intelligence?.confidence}% | Range: {data.components?.emotional_intelligence?.emotion_range} emotions</small>
        </div>
        
        {/* Hidden Emotion Detection - NEW */}
        <div style={{ flex: 1, minWidth: 220, border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
          <h4 style={{ margin: 0 }}>🎭 Hidden Emotion</h4>
          <div style={{ fontSize: 32, fontWeight: "bold", color: getScoreColor(data.components?.hidden_emotion?.score || 0) }}>
            {data.components?.hidden_emotion?.score || 0}/100
          </div>
          <div style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: 12,
            fontSize: 12,
            backgroundColor: getLevelColor(data.components?.hidden_emotion?.level),
            color: "white",
            marginTop: 5
          }}>
            {data.components?.hidden_emotion?.level}
          </div>
          <p style={{ fontSize: 14, color: "#666", marginTop: 10 }}>{data.components?.hidden_emotion?.message}</p>
          <small>
            Suppression: {data.components?.hidden_emotion?.avg_suppression_score || 0}% | 
            Detected in: {data.components?.hidden_emotion?.suppression_percentage || 0}% of messages
          </small>
          {data.components?.hidden_emotion?.common_hidden_emotions?.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
              Common hidden: {data.components?.hidden_emotion?.common_hidden_emotions.join(", ")}
            </div>
          )}
        </div>
        
        {/* Personality Balance */}
        <div style={{ flex: 1, minWidth: 220, border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
          <h4 style={{ margin: 0 }}>🎯 Personality Evolution</h4>
          <div style={{ fontSize: 32, fontWeight: "bold", color: getScoreColor(data.components?.personality_balance?.score || 0) }}>
            {data.components?.personality_balance?.score || 0}/100
          </div>
          <div style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: 12,
            fontSize: 12,
            backgroundColor: getLevelColor(data.components?.personality_balance?.level),
            color: "white",
            marginTop: 5
          }}>
            {data.components?.personality_balance?.level}
          </div>
          <p style={{ fontSize: 14, color: "#666", marginTop: 10 }}>{data.components?.personality_balance?.message}</p>
          <small>Avg trait: {data.components?.personality_balance?.avg_trait_score}% | Balance: {data.components?.personality_balance?.balance}%</small>
        </div>
        
        {/* Engagement Score */}
        <div style={{ flex: 1, minWidth: 220, border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
          <h4 style={{ margin: 0 }}>📊 Silence Intelligence</h4>
          <div style={{ fontSize: 32, fontWeight: "bold", color: getScoreColor(data.components?.engagement_score?.score || 0) }}>
            {data.components?.engagement_score?.score || 0}/100
          </div>
          <div style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: 12,
            fontSize: 12,
            backgroundColor: getLevelColor(data.components?.engagement_score?.level),
            color: "white",
            marginTop: 5
          }}>
            {data.components?.engagement_score?.level}
          </div>
          <p style={{ fontSize: 14, color: "#666", marginTop: 10 }}>{data.components?.engagement_score?.message}</p>
          <small>Silence score: {data.components?.engagement_score?.silence_score || 0} → Engagement: {data.components?.engagement_score?.score || 0}</small>
        </div>
      </div>
      
      {/* Formula Explanation */}
      <div style={{
        marginTop: 30,
        padding: 15,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        textAlign: "center"
      }}>
        <h4 style={{ margin: 0 }}>📐 Behavioral Intelligence Formula</h4>
        <p style={{ margin: "10px 0 0 0", fontSize: 14 }}>
          <strong>Final Score =</strong> (Emotion AI × 0.25) + (Hidden Emotion × 0.15) + (Silence Intelligence × 0.30) + (Personality Evolution × 0.30)
        </p>
        <p style={{ margin: "5px 0 0 0", fontSize: 12, color: "#666" }}>
          Calculated from your emotion analyses, hidden emotion detection, silence patterns, and personality assessment
        </p>
      </div>
      
      {/* Refresh Button */}
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button onClick={fetchData} style={{
          padding: "10px 30px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer"
        }}>
          🔄 Refresh Analysis
        </button>
      </div>
    </div>
  );
}

export default BehavioralIntelligenceDashboard;