// src/components/PredictionDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  predictBurnoutRisk, 
  predictLeadershipPotential, 
  predictStressForecast,
  predictTeamCollaboration 
} from '../services/predictionEngine';

function PredictionDashboard({ userId }) {
  const [activePrediction, setActivePrediction] = useState('burnout');
  const [burnout, setBurnout] = useState(null);
  const [leadership, setLeadership] = useState(null);
  const [stress, setStress] = useState(null);
  const [collaboration, setCollaboration] = useState(null);
  const [loading, setLoading] = useState({
    burnout: true,
    leadership: true,
    stress: true,
    collaboration: true
  });

  useEffect(() => {
    fetchAllPredictions();
  }, [userId]);

  const fetchAllPredictions = async () => {
    // Burnout
    const burnoutResult = await predictBurnoutRisk(userId);
    setBurnout(burnoutResult);
    setLoading(prev => ({ ...prev, burnout: false }));
    
    // Leadership
    const leadershipResult = await predictLeadershipPotential(userId);
    setLeadership(leadershipResult);
    setLoading(prev => ({ ...prev, leadership: false }));
    
    // Stress
    const stressResult = await predictStressForecast(userId);
    setStress(stressResult);
    setLoading(prev => ({ ...prev, stress: false }));
    
    // Collaboration
    const collaborationResult = await predictTeamCollaboration(userId);
    setCollaboration(collaborationResult);
    setLoading(prev => ({ ...prev, collaboration: false }));
  };

  const predictions = {
    burnout: {
      title: "🔥 Burnout Risk Prediction",
      data: burnout,
      loading: loading.burnout,
      color: "#F44336"
    },
    leadership: {
      title: "👔 Leadership Potential",
      data: leadership,
      loading: loading.leadership,
      color: "#2196F3"
    },
    stress: {
      title: "📊 7-Day Stress Forecast",
      data: stress,
      loading: loading.stress,
      color: "#FF9800"
    },
    collaboration: {
      title: "🤝 Team Collaboration Score",
      data: collaboration,
      loading: loading.collaboration,
      color: "#9C27B0"
    }
  };

  const renderBurnoutContent = () => {
    if (loading.burnout) return <div>Analyzing burnout risk...</div>;
    if (!burnout?.success) return <div>Error loading data</div>;
    
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 48, fontWeight: "bold", color: burnout.risk_color }}>
            {burnout.burnout_score}/100
          </div>
          <div style={{
            display: "inline-block",
            padding: "5px 15px",
            borderRadius: 20,
            backgroundColor: burnout.risk_color,
            color: "white",
            marginTop: 10
          }}>
            {burnout.risk_level} Risk
          </div>
          <p style={{ marginTop: 10 }}>{burnout.time_frame}</p>
        </div>
        
        <div style={{ backgroundColor: "#f5f5f5", padding: 15, borderRadius: 8, marginBottom: 15 }}>
          <strong>💡 Recommendation:</strong>
          <p>{burnout.recommendation}</p>
        </div>
        
        {burnout.factors && burnout.factors.length > 0 && (
          <div style={{ marginBottom: 15 }}>
            <strong>⚠️ Risk Factors:</strong>
            <ul>
              {burnout.factors.map((factor, idx) => (
                <li key={idx}>{factor}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <strong>🛡️ Prevention Tips:</strong>
          <ul>
            {burnout.prevention_tips?.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderLeadershipContent = () => {
    if (loading.leadership) return <div>Assessing leadership potential...</div>;
    if (!leadership?.success) return <div>Error loading data</div>;
    
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 48, fontWeight: "bold", color: leadership.color }}>
            {leadership.leadership_score}/100
          </div>
          <div style={{
            display: "inline-block",
            padding: "5px 15px",
            borderRadius: 20,
            backgroundColor: leadership.color,
            color: "white",
            marginTop: 10
          }}>
            {leadership.potential_level}
          </div>
        </div>
        
        <div style={{ backgroundColor: "#f5f5f5", padding: 15, borderRadius: 8, marginBottom: 15 }}>
          <strong>💡 Recommendation:</strong>
          <p>{leadership.recommendation}</p>
        </div>
        
        {leadership.strengths && leadership.strengths.length > 0 && (
          <div style={{ marginBottom: 15 }}>
            <strong>✅ Strengths:</strong>
            <ul>
              {leadership.strengths.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>
        )}
        
        {leadership.weaknesses && leadership.weaknesses.length > 0 && (
          <div style={{ marginBottom: 15 }}>
            <strong>📈 Areas to Develop:</strong>
            <ul>
              {leadership.weaknesses.map((weakness, idx) => (
                <li key={idx}>{weakness}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <strong>🎯 Development Areas:</strong>
          <ul>
            {leadership.development_areas?.map((area, idx) => (
              <li key={idx}>{area}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderStressContent = () => {
    if (loading.stress) return <div>Generating stress forecast...</div>;
    if (!stress?.success) return <div>Error loading data</div>;
    
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 32, fontWeight: "bold", color: stress.current_stress >= 70 ? "#F44336" : stress.current_stress >= 40 ? "#FFC107" : "#4CAF50" }}>
            Current Stress: {stress.current_stress}/100
          </div>
          <div>Trend: {stress.trend}</div>
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <strong>📅 7-Day Forecast:</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {stress.forecast_7day?.map((day, idx) => (
              <div key={idx} style={{
                flex: 1,
                minWidth: 60,
                textAlign: "center",
                padding: 8,
                backgroundColor: `${day.color}20`,
                borderRadius: 8,
                border: `1px solid ${day.color}`
              }}>
                <div><strong>{day.day}</strong></div>
                <div style={{ fontSize: 12 }}>{day.stress_score}%</div>
                <div style={{ fontSize: 10, color: day.color }}>{day.level}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ backgroundColor: "#f5f5f5", padding: 15, borderRadius: 8, marginBottom: 15 }}>
          <strong>💡 Recommendation:</strong>
          <p>{stress.recommendation}</p>
        </div>
        
        {stress.stress_triggers && stress.stress_triggers.length > 0 && (
          <div>
            <strong>🎯 Identified Stress Triggers:</strong>
            <ul>
              {stress.stress_triggers.map((trigger, idx) => (
                <li key={idx}>{trigger}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderCollaborationContent = () => {
    if (loading.collaboration) return <div>Analyzing collaboration potential...</div>;
    if (!collaboration?.success) return <div>Error loading data</div>;
    
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 48, fontWeight: "bold", color: collaboration.color }}>
            {collaboration.collaboration_score}/100
          </div>
          <div style={{
            display: "inline-block",
            padding: "5px 15px",
            borderRadius: 20,
            backgroundColor: collaboration.color,
            color: "white",
            marginTop: 10
          }}>
            {collaboration.level}
          </div>
        </div>
        
        <div style={{ backgroundColor: "#f5f5f5", padding: 15, borderRadius: 8, marginBottom: 15 }}>
          <strong>💡 Recommendation:</strong>
          <p>{collaboration.recommendation}</p>
        </div>
        
        {collaboration.strengths && collaboration.strengths.length > 0 && (
          <div style={{ marginBottom: 15 }}>
            <strong>✅ Collaboration Strengths:</strong>
            <ul>
              {collaboration.strengths.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <strong>📈 Improvement Tips:</strong>
          <ul>
            {collaboration.improvement_tips?.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const getContent = () => {
    switch(activePrediction) {
      case 'burnout': return renderBurnoutContent();
      case 'leadership': return renderLeadershipContent();
      case 'stress': return renderStressContent();
      case 'collaboration': return renderCollaborationContent();
      default: return null;
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>🔮 Prediction Engine - Phase 6</h1>
      <p style={{ color: "#666", marginBottom: 30 }}>
        AI-powered predictions based on your behavioral patterns
      </p>
      
      {/* Prediction Type Selector */}
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: 10, 
        marginBottom: 20,
        borderBottom: "1px solid #ddd",
        paddingBottom: 10
      }}>
        <button
          onClick={() => setActivePrediction('burnout')}
          style={{
            padding: "10px 20px",
            backgroundColor: activePrediction === 'burnout' ? "#F44336" : "#f0f0f0",
            color: activePrediction === 'burnout' ? "white" : "#333",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          🔥 Burnout Risk
        </button>
        <button
          onClick={() => setActivePrediction('leadership')}
          style={{
            padding: "10px 20px",
            backgroundColor: activePrediction === 'leadership' ? "#2196F3" : "#f0f0f0",
            color: activePrediction === 'leadership' ? "white" : "#333",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          👔 Leadership
        </button>
        <button
          onClick={() => setActivePrediction('stress')}
          style={{
            padding: "10px 20px",
            backgroundColor: activePrediction === 'stress' ? "#FF9800" : "#f0f0f0",
            color: activePrediction === 'stress' ? "white" : "#333",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          📊 Stress Forecast
        </button>
        <button
          onClick={() => setActivePrediction('collaboration')}
          style={{
            padding: "10px 20px",
            backgroundColor: activePrediction === 'collaboration' ? "#9C27B0" : "#f0f0f0",
            color: activePrediction === 'collaboration' ? "white" : "#333",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          🤝 Collaboration
        </button>
      </div>
      
      {/* Prediction Content */}
      <div style={{
        border: `2px solid ${predictions[activePrediction].color}`,
        borderRadius: 12,
        padding: 20,
        backgroundColor: "#fff",
        minHeight: 400
      }}>
        <h2 style={{ marginTop: 0, color: predictions[activePrediction].color }}>
          {predictions[activePrediction].title}
        </h2>
        {getContent()}
      </div>
      
      {/* Refresh Button */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button
          onClick={fetchAllPredictions}
          style={{
            padding: "10px 30px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          🔄 Refresh All Predictions
        </button>
      </div>
    </div>
  );
}

export default PredictionDashboard;