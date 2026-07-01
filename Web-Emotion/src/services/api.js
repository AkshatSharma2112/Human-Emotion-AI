import axios from 'axios';

const API_BASE = 'http://localhost:8000'; // Your Python backend

// Existing API calls
export const analyzeSilence = async (audioData) => {
  // Agar audioData khali hai to gracefully dummy data handle karein taaki parallel promise crash na ho
  if (!audioData) return { voice_emotion_score: 0, silence_score: 0 };
  const response = await axios.post(`${API_BASE}/silence-intelligence/analyze-voice`, audioData);
  return response.data;
};

export const analyzeSentiment = async (text) => {
  // 💡 FIXED: Yahan pehle backticks nahi lage the
  const response = await axios.post(`${API_BASE}/hidden-emotion-ai/analyze`, { text });
  return response.data;
};

export const analyzeBehavior = async (metrics) => {
  // 💡 FIXED: Yahan bhi backticks missing the
  const response = await axios.post(`${API_BASE}/behavioral-fusion-engine/analyze`, metrics);
  return response.data;
};

// NEW: Combined analysis
export const analyzeAll = async (audioData, text, behaviorMetrics) => {
  try {
    // Run all three analyses in parallel
    const [voiceResult, sentimentResult, behaviorResult] = await Promise.all([
      analyzeSilence(audioData),
      analyzeSentiment(text || "No content provided"), // Empty handling safe check
      analyzeBehavior(behaviorMetrics)
    ]);
    
    // Calculate final risk
    const finalScore = calculateFinalRisk({
      voiceScore: voiceResult?.voice_emotion_score || voiceResult?.silence_score || 0,
      sentimentScore: sentimentResult?.score || 0,
      behavioralScore: behaviorResult?.behavioral_risk_score || 0
    });
    
    return {
      voice: voiceResult,
      sentiment: sentimentResult,
      behavior: behaviorResult,
      finalRisk: finalScore,
      isCrisis: sentimentResult?.is_crisis || finalScore >= 70
    };
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
};

// NEW: Risk calculator
function calculateFinalRisk({ voiceScore, sentimentScore, behavioralScore }) {
  const weights = {
    sentiment: 0.5,   // 50% weight
    behavioral: 0.3,  // 30% weight  
    voice: 0.2        // 20% weight
  };
  
  return Math.round(
    (sentimentScore * weights.sentiment) +
    (behavioralScore * weights.behavioral) +
    (voiceScore * weights.voice)
  );
}