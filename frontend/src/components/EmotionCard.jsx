import React from 'react';

export default function EmotionCard({ sentiment, riskScore, voiceMetrics }) {
  // Determine emotion label based on sentiment + risk
  const getEmotionLabel = () => {
    if (sentiment.is_crisis || riskScore >= 70) {
      return { label: '⚠️ CRISIS', color: '#ff0000', emoji: '🔴' };
    }
    if (riskScore >= 60) {
      return { label: 'SEVERE DISTRESS', color: '#ff6600', emoji: '🟠' };
    }
    if (riskScore >= 40) {
      return { label: 'MODERATE ANXIETY', color: '#ffcc00', emoji: '🟡' };
    }
    if (riskScore >= 20) {
      return { label: 'MILD CONCERN', color: '#66cc66', emoji: '🟢' };
    }
    return { label: 'STABLE', color: '#3399ff', emoji: '🔵' };
  };
  
  const emotion = getEmotionLabel();
  
  return (
    <div style={{
      backgroundColor: emotion.color,
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      margin: '15px 0'
    }}>
      <h2>{emotion.emoji} {emotion.label}</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <strong>Risk Score:</strong> {riskScore}/100
        </div>
        <div>
          <strong>Crisis Level:</strong> {sentiment.crisis_level}
        </div>
        <div>
          <strong>Voice Distress:</strong> {voiceMetrics?.voice_emotion_score || 'N/A'}/100
        </div>
      </div>
      
      {sentiment.suggestion && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}>
          💡 {sentiment.suggestion}
        </div>
      )}
    </div>
  );
}