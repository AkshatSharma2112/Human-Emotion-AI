import { useState, useEffect } from 'react';
import { getPersonalityHistory, detectTraitShifts, savePersonalityAssessment } from '../services/personalityAssessment';
import PersonalityRadarChart from '../components/PersonalityRadarChart';
import PersonalityTrendChart from '../components/PersonalityTrendChart';
import PersonalityReport from '../components/PersonalityReport';

function PersonalityDashboard({ userId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showDemoAlert, setShowDemoAlert] = useState(false);

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

  const addDemoAssessment = async () => {
    // Create a second assessment with different scores to show shifts
    const demoScores = {
      openness: 75,
      conscientiousness: 65,
      extraversion: 55,
      agreeableness: 80,
      neuroticism: 45
    };
    
    const demoAnswers = {
      openness: [4, 2, 4, 4],
      conscientiousness: [3, 3, 4, 3],
      extraversion: [3, 2, 3, 2],
      agreeableness: [4, 2, 4, 4],
      neuroticism: [2, 3, 2, 2]
    };
    
    await savePersonalityAssessment(userId, demoScores, demoAnswers);
    await fetchHistory();
    setShowDemoAlert(true);
    setTimeout(() => setShowDemoAlert(false), 3000);
  };

  if (loading) return <div style={{ textAlign: "center", padding: 40 }}>Loading personality data...</div>;
  
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <h3>❌ Error Loading Data</h3>
        <p>{error}</p>
        <button onClick={fetchHistory} style={{ padding: "10px 20px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>Retry</button>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <h3>📊 No Personality Data Yet</h3>
        <p>Take the personality assessment to start tracking your evolution!</p>
        <p style={{ color: "#666", marginTop: 20 }}>Go to <strong>Personality Assessment</strong> tab and complete the assessment.</p>
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

  const getComparisonText = (score) => {
    if (score >= 70) return "Higher than average";
    if (score >= 50) return "Average range";
    if (score >= 30) return "Below average";
    return "Significantly lower";
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <h2>📈 Personality Evolution Tracker - Phase 4 Complete</h2>
        <button
          onClick={() => setShowReport(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          📄 Generate Report
        </button>
      </div>
      
      {/* Demo Data Button - Only show if only 1 assessment */}
      {history.length === 1 && (
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={addDemoAssessment}
            style={{
              padding: "8px 16px",
              backgroundColor: "#FF9800",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14
            }}
          >
            🎯 Add Demo Data (Test Trait Shifts)
          </button>
          <span style={{ marginLeft: 10, color: "#666", fontSize: 14 }}>
            Or take another assessment in 2 weeks
          </span>
        </div>
      )}
      
      {/* Demo Success Alert */}
      {showDemoAlert && (
        <div style={{
          marginBottom: 20,
          padding: 10,
          backgroundColor: "#4CAF50",
          color: "white",
          borderRadius: 8,
          textAlign: "center"
        }}>
          ✅ Demo assessment added! Now you can see trait shift detection!
        </div>
      )}
      
      {/* Coming Soon / Next Assessment Reminder */}
      {history.length === 1 && (
        <div style={{
          marginBottom: 20,
          padding: 15,
          backgroundColor: "#e3f2fd",
          borderRadius: 8,
          borderLeft: "4px solid #2196F3",
          textAlign: "center"
        }}>
          <h4 style={{ margin: 0 }}>📊 Tracking in Progress</h4>
          <p>Take another assessment to see:</p>
          <ul style={{ textAlign: "left", display: "inline-block", margin: "10px 0" }}>
            <li>🔄 How your personality traits change over time</li>
            <li>📈 Trait shift detection alerts</li>
            <li>📊 Compare current vs previous assessment</li>
          </ul>
          <p>
            <strong>Next assessment recommended:</strong> {new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString()}
          </p>
        </div>
      )}
      
      {/* Trait Shift Alerts */}
      {shifts && shifts.has_shifts && (
        <div style={{ marginBottom: 20, padding: 15, backgroundColor: "#fff3e0", borderRadius: 8, borderLeft: "4px solid #ff9800" }}>
          <h4 style={{ margin: 0 }}>🔄 Personality Shifts Detected!</h4>
          <p>{shifts.message}</p>
          {shifts.significant_shifts.map((shift, idx) => (
            <div key={idx} style={{ marginTop: 5 }}>
              <strong>{shift.trait.charAt(0).toUpperCase() + shift.trait.slice(1)}</strong>: {shift.direction} by {shift.magnitude} points
              <span style={{ marginLeft: 10, color: shift.direction === "increased" ? "#f44336" : "#4CAF50" }}>
                {shift.direction === "increased" ? "📈" : "📉"}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Two Column Layout */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {/* Left Column - Radar Chart */}
        <div style={{ flex: 1, minWidth: 350, border: "1px solid #ddd", borderRadius: 12, padding: 20, backgroundColor: "#fafafa" }}>
          <h3 style={{ textAlign: "center" }}>🎯 Personality Radar</h3>
          <PersonalityRadarChart scores={latest} />
        </div>
        
        {/* Right Column - Current Scores */}
        <div style={{ flex: 1, minWidth: 250, border: "1px solid #ddd", borderRadius: 12, padding: 20, backgroundColor: "#fafafa" }}>
          <h3 style={{ marginTop: 0 }}>📊 Current Profile</h3>
          <p><small>Assessment from: {new Date(history[0].timestamp).toLocaleDateString()}</small></p>
          {Object.entries(latest).map(([trait, score]) => (
            <div key={trait} style={{ marginBottom: 15 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{trait.charAt(0).toUpperCase() + trait.slice(1)}</strong>
                <div>
                  <span>{score}/100</span>
                  <span style={{ marginLeft: 10, fontSize: 12, color: getScoreColor(score) }}>
                    ({getComparisonText(score)})
                  </span>
                </div>
              </div>
              <div style={{ backgroundColor: "#e0e0e0", borderRadius: 10, overflow: "hidden", height: 25 }}>
                <div style={{ width: `${score}%`, backgroundColor: getScoreColor(score), height: "100%", transition: "width 0.5s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Trend Chart */}
      <div style={{ marginTop: 20, border: "1px solid #ddd", borderRadius: 12, padding: 20, backgroundColor: "#fafafa" }}>
        <h3>📈 Personality Trends Over Time</h3>
        <PersonalityTrendChart history={history} />
      </div>
      
      {/* Weekly Tracking Summary */}
      {history.length > 1 && (
        <div style={{ marginTop: 20, border: "1px solid #ddd", borderRadius: 12, padding: 20, backgroundColor: "#fafafa", overflowX: "auto" }}>
          <h3>📅 Weekly Tracking Summary</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: 10, textAlign: "left" }}>Week</th>
                <th style={{ padding: 10, textAlign: "left" }}>Date</th>
                <th style={{ padding: 10, textAlign: "left" }}>Openness</th>
                <th style={{ padding: 10, textAlign: "left" }}>Consc.</th>
                <th style={{ padding: 10, textAlign: "left" }}>Extra.</th>
                <th style={{ padding: 10, textAlign: "left" }}>Agree.</th>
                <th style={{ padding: 10, textAlign: "left" }}>Neuro.</th>
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
                      let changeColor = "#666";
                      let changeSymbol = "";
                      if (prev) {
                        change = score - prev.scores[trait];
                        if (change > 0) { changeColor = "#4CAF50"; changeSymbol = `+${change}`; }
                        else if (change < 0) { changeColor = "#F44336"; changeSymbol = `${change}`; }
                      }
                      return (
                        <td key={trait} style={{ padding: 10 }}>
                          {score}%
                          {change !== null && change !== 0 && (
                            <span style={{ marginLeft: 5, fontSize: 12, color: changeColor }}>
                              ({changeSymbol})
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
      )}
      
      {/* Report Modal */}
      {showReport && (
        <PersonalityReport 
          scores={latest}
          history={history}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}

export default PersonalityDashboard;