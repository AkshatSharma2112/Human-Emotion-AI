// src/pages/PersonalityDashboard.jsx
import { useState, useEffect } from 'react';
import { getPersonalityHistory, detectTraitShifts } from '../services/personalityAssessment';
import PersonalityRadarChart from '../components/PersonalityRadarChart';
import PersonalityTrendChart from '../components/PersonalityTrendChart';

function PersonalityDashboard({ userId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPersonalityHistory(userId);
      console.log("Fetched data:", data);
      setHistory(data);
    } catch (err) {
      console.error("Error fetching:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 40 }}>Loading personality data...</div>;
  
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <h3>❌ Error Loading Data</h3>
        <p>{error}</p>
        <button 
          onClick={fetchHistory}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <h3>📊 No Personality Data Yet</h3>
        <p>Take the personality assessment to start tracking your evolution!</p>
        <p style={{ color: "#666", marginTop: 20 }}>
          Go to <strong>Personality Assessment</strong> tab and complete the assessment.
        </p>
      </div>
    );
  }

  const latest = history[0].scores;
  const shifts = history.length >= 2 ? detectTraitShifts(history) : null;
  const getScoreColor = (score) => {
    if (score >= 70) return "#4CAF50";
    if (score >= 40) return "#FFC107";
    return "#FF9800";
  };

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h2>📈 Personality Evolution Tracker - Phase 4 Complete</h2>
      
      {/* Trait Shift Alerts */}
      {shifts && shifts.has_shifts && (
        <div style={{
          marginBottom: 20,
          padding: 15,
          backgroundColor: "#fff3e0",
          borderRadius: 8,
          borderLeft: "4px solid #ff9800"
        }}>
          <h4 style={{ margin: 0 }}>🔄 Personality Shifts Detected!</h4>
          <p>{shifts.message}</p>
          {shifts.significant_shifts.map((shift, idx) => (
            <div key={idx} style={{ marginTop: 5 }}>
              <strong>{shift.trait.charAt(0).toUpperCase() + shift.trait.slice(1)}</strong>: 
              {shift.direction} by {shift.magnitude} points
              <span style={{ 
                marginLeft: 10,
                color: shift.direction === "increased" ? "#f44336" : "#4CAF50"
              }}>
                {shift.direction === "increased" ? "📈" : "📉"}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Two Column Layout */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {/* Left Column - Radar Chart */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 20,
            backgroundColor: "#fafafa",
            height: "100%"
          }}>
            <h3 style={{ textAlign: "center" }}>🎯 Personality Radar</h3>
            <PersonalityRadarChart scores={latest} />
          </div>
        </div>
        
        {/* Right Column - Current Scores */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 20,
            backgroundColor: "#fafafa"
          }}>
            <h3 style={{ marginTop: 0 }}>📊 Current Profile</h3>
            <p><small>Assessment from: {new Date(history[0].timestamp).toLocaleDateString()}</small></p>
            
            {Object.entries(latest).map(([trait, score]) => (
              <div key={trait} style={{ marginBottom: 15 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{trait.charAt(0).toUpperCase() + trait.slice(1)}</strong>
                  <span>{score}/100</span>
                </div>
                <div style={{ 
                  backgroundColor: "#e0e0e0", 
                  borderRadius: 10, 
                  overflow: "hidden",
                  height: 25
                }}>
                  <div style={{ 
                    width: `${score}%`, 
                    backgroundColor: getScoreColor(score), 
                    height: "100%",
                    transition: "width 0.5s"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Trend Chart */}
      <div style={{
        marginTop: 20,
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 20,
        backgroundColor: "#fafafa"
      }}>
        <h3>📈 Personality Trends Over Time</h3>
        <PersonalityTrendChart history={history} />
      </div>
      
      {/* Weekly Tracking Summary */}
      {history.length > 1 && (
        <div style={{
          marginTop: 20,
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          backgroundColor: "#fafafa"
        }}>
          <h3>📅 Weekly Tracking Summary</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: 10, textAlign: "left", borderBottom: "2px solid #ddd" }}>Week</th>
                  <th style={{ padding: 10, textAlign: "left", borderBottom: "2px solid #ddd" }}>Date</th>
                  <th style={{ padding: 10, textAlign: "left", borderBottom: "2px solid #ddd" }}>Openness</th>
                  <th style={{ padding: 10, textAlign: "left", borderBottom: "2px solid #ddd" }}>Consc.</th>
                  <th style={{ padding: 10, textAlign: "left", borderBottom: "2px solid #ddd" }}>Extra.</th>
                  <th style={{ padding: 10, textAlign: "left", borderBottom: "2px solid #ddd" }}>Agree.</th>
                  <th style={{ padding: 10, textAlign: "left", borderBottom: "2px solid #ddd" }}>Neuro.</th>
                </tr>
              </thead>
              <tbody>
                {history.map((assessment, idx) => {
                  const prev = history[idx + 1];
                  return (
                    <tr key={assessment.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: 10 }}>Week {assessment.week || idx + 1}</td>
                      <td style={{ padding: 10 }}>{new Date(assessment.timestamp).toLocaleDateString()}</td>
                      {Object.entries(assessment.scores).map(([trait, score]) => {
                        let change = null;
                        if (prev) {
                          change = score - prev.scores[trait];
                        }
                        return (
                          <td key={trait} style={{ padding: 10 }}>
                            {score}%
                            {change !== null && change !== 0 && (
                              <span style={{ 
                                marginLeft: 5,
                                fontSize: 12,
                                color: change > 0 ? "#4CAF50" : "#F44336"
                              }}>
                                {change > 0 ? `+${change}` : `${change}`}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonalityDashboard;