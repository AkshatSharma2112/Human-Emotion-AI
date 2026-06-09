// src/components/CompleteDashboard.jsx
import { useState, useEffect } from 'react';
import { getLast7DaysAnalyses } from '../config/db';
import { getPersonalityHistory } from '../services/personalityAssessment';
import { calculateSilenceScore } from '../services/silenceIntelligence';
import { calculateBehavioralIntelligence } from '../services/behavioralFusion';

function CompleteDashboard({ userId }) {
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [personalityHistory, setPersonalityHistory] = useState([]);
  const [silenceData, setSilenceData] = useState(null);
  const [behavioralData, setBehavioralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    fetchAllData();
  }, [userId, timeRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [analyses, personality, silence, behavioral] = await Promise.all([
        getLast7DaysAnalyses(userId),
        getPersonalityHistory(userId, 10),
        calculateSilenceScore(userId),
        calculateBehavioralIntelligence(userId)
      ]);
      
      setEmotionHistory(analyses);
      setPersonalityHistory(personality);
      setSilenceData(silence);
      setBehavioralData(behavioral);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare Emotion Timeline Data
  const getEmotionTimelineData = () => {
    const last30Days = emotionHistory.slice(0, 30).reverse();
    const emotions = ['joy', 'fear', 'sadness', 'anger', 'anxiety', 'hope'];
    const emotionColors = {
      joy: '#4CAF50',
      fear: '#FF9800',
      sadness: '#2196F3',
      anger: '#F44336',
      anxiety: '#9C27B0',
      hope: '#00BCD4'
    };
    
    return last30Days.map(day => ({
      date: new Date(day.timestamp).toLocaleDateString(),
      emotion: day.emotion,
      color: emotionColors[day.emotion] || '#999',
      confidence: Math.round((day.confidence || 0.7) * 100)
    }));
  };

  // Prepare Personality Growth Data
  const getPersonalityGrowthData = () => {
    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    const traitNames = {
      openness: 'Openness',
      conscientiousness: 'Conscientiousness',
      extraversion: 'Extraversion',
      agreeableness: 'Agreeableness',
      neuroticism: 'Neuroticism'
    };
    
    const data = personalityHistory.slice(0, 5).reverse();
    return {
      labels: data.map(item => new Date(item.timestamp).toLocaleDateString()),
      datasets: traits.map(trait => ({
        label: traitNames[trait],
        data: data.map(item => item.scores[trait]),
        borderColor: getTraitColor(trait),
        backgroundColor: getTraitColor(trait) + '20',
        tension: 0.3,
        fill: false
      }))
    };
  };

  const getTraitColor = (trait) => {
    const colors = {
      openness: '#2196F3',
      conscientiousness: '#4CAF50',
      extraversion: '#FF9800',
      agreeableness: '#9C27B0',
      neuroticism: '#F44336'
    };
    return colors[trait];
  };

  // Calculate Historical Trends
  const getHistoricalTrends = () => {
    if (emotionHistory.length < 5) return null;
    
    const recent = emotionHistory.slice(0, 5);
    const past = emotionHistory.slice(5, 10);
    
    const recentJoy = recent.filter(a => a.emotion === 'joy').length / recent.length;
    const pastJoy = past.filter(a => a.emotion === 'joy').length / past.length;
    
    const recentNegative = recent.filter(a => ['fear', 'sadness', 'anger', 'anxiety'].includes(a.emotion)).length / recent.length;
    const pastNegative = past.filter(a => ['fear', 'sadness', 'anger', 'anxiety'].includes(a.emotion)).length / past.length;
    
    return {
      joy_trend: recentJoy > pastJoy ? 'increasing' : recentJoy < pastJoy ? 'decreasing' : 'stable',
      negative_trend: recentNegative > pastNegative ? 'increasing' : recentNegative < pastNegative ? 'decreasing' : 'stable',
      joy_change: Math.round((recentJoy - pastJoy) * 100),
      negative_change: Math.round((recentNegative - pastNegative) * 100)
    };
  };

  const trends = getHistoricalTrends();
  const emotionTimeline = getEmotionTimelineData();
  const personalityGrowth = getPersonalityGrowthData();
  const behavioralScore = behavioralData?.behavioral_intelligence_score || 0;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 24 }}>📊</div>
        <p>Loading your complete dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: "0 auto" }}>
      <h1>📊 Explainable Dashboard - Phase 7 Complete</h1>
      <p style={{ color: "#666", marginBottom: 30 }}>
        Complete view of your behavioral intelligence: Emotion Timeline | Personality Growth | Silence Alerts | Behavioral Gauge
      </p>
      
      {/* Time Range Selector */}
      <div style={{ marginBottom: 20, textAlign: "right" }}>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
        >
          <option value="7days">Last 7 Days</option>
          <option value="14days">Last 14 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>
      
      {/* Row 1: Behavioral Score Gauge + Silence Alerts */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
        
        {/* Behavioral Score Gauge */}
        <div style={{ 
          flex: 1, 
          minWidth: 250, 
          border: "1px solid #ddd", 
          borderRadius: 12, 
          padding: 20,
          background: `linear-gradient(135deg, ${getScoreColor(behavioralScore)}20, white)`
        }}>
          <h3 style={{ marginTop: 0, textAlign: "center" }}>🎯 Behavioral Intelligence Gauge</h3>
          <div style={{ position: "relative", textAlign: "center" }}>
            <div style={{
              width: 180,
              height: 180,
              margin: "0 auto",
              borderRadius: "50%",
              background: `conic-gradient(${getScoreColor(behavioralScore)} 0deg ${behavioralScore * 3.6}deg, #e0e0e0 ${behavioralScore * 3.6}deg 360deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <div style={{ fontSize: 36, fontWeight: "bold", color: getScoreColor(behavioralScore) }}>
                  {behavioralScore}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>/100</div>
                <div style={{ 
                  fontSize: 12, 
                  marginTop: 5,
                  padding: "2px 8px",
                  borderRadius: 12,
                  backgroundColor: getScoreColor(behavioralScore),
                  color: "white"
                }}>
                  {behavioralData?.level || "Moderate"}
                </div>
              </div>
            </div>
            <p style={{ marginTop: 15, fontSize: 14, color: "#666" }}>
              {behavioralData?.recommendation?.substring(0, 80)}...
            </p>
          </div>
        </div>
        
        {/* Silence Alerts Dashboard */}
        <div style={{ 
          flex: 1, 
          minWidth: 250, 
          border: "1px solid #ddd", 
          borderRadius: 12, 
          padding: 20,
          backgroundColor: silenceData?.risk === "High" ? "#ffebee" : silenceData?.risk === "Medium" ? "#fff3e0" : "#e8f5e9"
        }}>
          <h3 style={{ marginTop: 0, textAlign: "center" }}>🔔 Silence Alerts</h3>
          {silenceData?.silence_score !== null ? (
            <>
              <div style={{ textAlign: "center", marginBottom: 15 }}>
                <div style={{ fontSize: 48, fontWeight: "bold", color: getSilenceColor(silenceData.risk) }}>
                  {silenceData.silence_score}/100
                </div>
                <div style={{
                  display: "inline-block",
                  padding: "3px 12px",
                  borderRadius: 16,
                  backgroundColor: getSilenceColor(silenceData.risk),
                  color: "white",
                  fontSize: 14
                }}>
                  Risk: {silenceData.risk}
                </div>
              </div>
              
              {silenceData.risk === "High" && (
                <div style={{ backgroundColor: "#f44336", color: "white", padding: 10, borderRadius: 8, marginBottom: 10 }}>
                  ⚠️ HIGH SILENCE RISK - Immediate attention needed!
                </div>
              )}
              
              {silenceData.topic_avoidance?.score > 30 && (
                <div style={{ backgroundColor: "#ff9800", color: "white", padding: 10, borderRadius: 8, marginBottom: 10 }}>
                  🔍 Topic avoidance detected: {silenceData.topic_avoidance.detected_topics?.join(", ")}
                </div>
              )}
              
              <div style={{ fontSize: 14, color: "#666" }}>
                {silenceData.alert}
              </div>
            </>
          ) : (
            <p style={{ textAlign: "center", color: "#999" }}>Insufficient data for alerts</p>
          )}
        </div>
      </div>
      
      {/* Row 2: Emotion Timeline Chart */}
      <div style={{ 
        border: "1px solid #ddd", 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 20,
        backgroundColor: "#fafafa"
      }}>
        <h3 style={{ marginTop: 0 }}>📅 Emotion Timeline</h3>
        {emotionTimeline.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "flex", gap: 8, minWidth: 600 }}>
              {emotionTimeline.map((item, idx) => (
                <div key={idx} style={{ textAlign: "center", minWidth: 60 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: item.color,
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 20
                  }}>
                    {getEmotionIcon(item.emotion)}
                  </div>
                  <div style={{ fontSize: 10, marginTop: 5 }}>{item.date}</div>
                  <div style={{ fontSize: 10, color: "#666" }}>{item.confidence}%</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>No emotion data available</p>
        )}
      </div>
      
      {/* Row 3: Personality Growth Charts */}
      <div style={{ 
        border: "1px solid #ddd", 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 20,
        backgroundColor: "#fafafa"
      }}>
        <h3 style={{ marginTop: 0 }}>📈 Personality Growth Charts</h3>
        {personalityHistory.length > 1 ? (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 15, marginBottom: 20 }}>
              {personalityGrowth.datasets?.map((trait, idx) => (
                <div key={idx} style={{ flex: 1, minWidth: 150 }}>
                  <div style={{ fontWeight: "bold", color: trait.borderColor }}>{trait.label}</div>
                  <div style={{ 
                    height: 100, 
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 8,
                    marginTop: 10
                  }}>
                    {trait.data.slice(-5).map((value, i) => (
                      <div key={i} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{
                          height: `${value}px`,
                          backgroundColor: trait.borderColor,
                          borderRadius: 4,
                          transition: "height 0.5s"
                        }} />
                        <div style={{ fontSize: 10, marginTop: 5 }}>W{i+1}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, textAlign: "center", marginTop: 5 }}>
                    Current: {trait.data[trait.data.length - 1]}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>Take at least 2 assessments to see personality growth</p>
        )}
      </div>
      
      {/* Row 4: Historical Trends */}
      {trends && (
        <div style={{ 
          border: "1px solid #ddd", 
          borderRadius: 12, 
          padding: 20,
          backgroundColor: "#fafafa"
        }}>
          <h3 style={{ marginTop: 0 }}>📉 Historical Trends (Last 10 entries vs Previous 10)</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 32, color: trends.joy_trend === 'increasing' ? '#4CAF50' : trends.joy_trend === 'decreasing' ? '#F44336' : '#FFC107' }}>
                {trends.joy_trend === 'increasing' ? '📈' : trends.joy_trend === 'decreasing' ? '📉' : '➡️'}
              </div>
              <div><strong>Joy Trend</strong></div>
              <div>{trends.joy_trend} ({trends.joy_change > 0 ? `+${trends.joy_change}` : trends.joy_change}%)</div>
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 32, color: trends.negative_trend === 'increasing' ? '#F44336' : trends.negative_trend === 'decreasing' ? '#4CAF50' : '#FFC107' }}>
                {trends.negative_trend === 'increasing' ? '📈' : trends.negative_trend === 'decreasing' ? '📉' : '➡️'}
              </div>
              <div><strong>Negative Emotion Trend</strong></div>
              <div>{trends.negative_trend} ({trends.negative_change > 0 ? `+${trends.negative_change}` : trends.negative_change}%)</div>
            </div>
          </div>
          <div style={{ marginTop: 15, padding: 10, backgroundColor: "#e3f2fd", borderRadius: 8 }}>
            <strong>💡 Insight:</strong>
            {trends.negative_trend === 'increasing' && " Negative emotions are increasing. Consider stress management techniques."}
            {trends.negative_trend === 'decreasing' && " Great job! Negative emotions are decreasing."}
            {trends.joy_trend === 'increasing' && " Your positive emotions are growing! Keep it up!"}
            {trends.joy_trend === 'decreasing' && " Try incorporating more activities that bring you joy."}
          </div>
        </div>
      )}
      
      {/* Refresh Button */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button
          onClick={fetchAllData}
          style={{
            padding: "10px 30px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          🔄 Refresh Dashboard
        </button>
      </div>
    </div>
  );
}

// Helper Functions
function getScoreColor(score) {
  if (score >= 75) return "#4CAF50";
  if (score >= 60) return "#8BC34A";
  if (score >= 45) return "#FFC107";
  if (score >= 30) return "#FF9800";
  return "#F44336";
}

function getSilenceColor(risk) {
  if (risk === "Low") return "#4CAF50";
  if (risk === "Medium") return "#FF9800";
  return "#F44336";
}

function getEmotionIcon(emotion) {
  const icons = {
    joy: '😊',
    fear: '😨',
    sadness: '😢',
    anger: '😠',
    anxiety: '😰',
    hope: '🌟',
    neutral: '😐'
  };
  return icons[emotion] || '😐';
}

export default CompleteDashboard;