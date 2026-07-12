// src/services/api.js
import axios from 'axios';

// ✅ Backend API URL (Port 5001)
const API_BASE = 'http://localhost:5001/api';

// ============ VOICE ANALYSIS ============
export const analyzeVoice = async (text) => {
  try {
    const response = await axios.post(`${API_BASE}/voice/analyze`, { text });
    return response.data;
  } catch (error) {
    console.error('Voice analysis error:', error);
    throw error;
  }
};

// ============ EMOTION ANALYSIS ============
export const analyzeEmotion = async (text) => {
  try {
    const response = await axios.post(`${API_BASE}/analyze`, { text });
    return response.data;
  } catch (error) {
    console.error('Emotion analysis error:', error);
    throw error;
  }
};

// ============ PERSONALITY ============
export const getPersonalityTraits = async () => {
  try {
    const response = await axios.get(`${API_BASE}/personality/traits`);
    return response.data;
  } catch (error) {
    console.error('Personality traits error:', error);
    throw error;
  }
};

export const assessPersonality = async (responses) => {
  try {
    const response = await axios.post(`${API_BASE}/personality/assess`, { responses });
    return response.data;
  } catch (error) {
    console.error('Personality assessment error:', error);
    throw error;
  }
};

// ============ DASHBOARD ============
export const getDashboardData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/dashboard/overview`);
    return response.data;
  } catch (error) {
    console.error('Dashboard data error:', error);
    throw error;
  }
};

// ============ SILENCE INTELLIGENCE ============
export const analyzeSilence = async (audioData) => {
  try {
    const response = await axios.post(`${API_BASE}/silence/analyze`, audioData);
    return response.data;
  } catch (error) {
    console.error('Silence analysis error:', error);
    throw error;
  }
};

export const getSilenceMetrics = async () => {
  try {
    const response = await axios.get(`${API_BASE}/silence/metrics`);
    return response.data;
  } catch (error) {
    console.error('Silence metrics error:', error);
    throw error;
  }
};

// ============ BEHAVIORAL FUSION ============
export const analyzeBehavior = async (metrics) => {
  try {
    const response = await axios.post(`${API_BASE}/behavioral/fusion`, metrics);
    return response.data;
  } catch (error) {
    console.error('Behavioral analysis error:', error);
    throw error;
  }
};

// ============ PREDICTIONS ============
export const getPredictions = async () => {
  try {
    const response = await axios.get(`${API_BASE}/predictions/current`);
    return response.data;
  } catch (error) {
    console.error('Predictions error:', error);
    throw error;
  }
};

export const getPredictionTrends = async () => {
  try {
    const response = await axios.get(`${API_BASE}/predictions/trends`);
    return response.data;
  } catch (error) {
    console.error('Prediction trends error:', error);
    throw error;
  }
};

// ============ EMOTION HISTORY ============
export const getEmotionHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE}/history`);
    return response.data;
  } catch (error) {
    console.error('Emotion history error:', error);
    throw error;
  }
};

export const getEmotionStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/stats`);
    return response.data;
  } catch (error) {
    console.error('Emotion stats error:', error);
    throw error;
  }
};

export const getEmotionTrends = async (period = 'week') => {
  try {
    const response = await axios.get(`${API_BASE}/trends?period=${period}`);
    return response.data;
  } catch (error) {
    console.error('Emotion trends error:', error);
    throw error;
  }
};

// ============ AUTHENTICATION ============
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${API_BASE}/auth/logout`);
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// ============ COMBINED ANALYSIS ============
export const analyzeAll = async (audioData, text, behaviorMetrics) => {
  try {
    // Run all three analyses in parallel
    const [voiceResult, sentimentResult, behaviorResult] = await Promise.all([
      analyzeSilence(audioData),
      analyzeEmotion(text),
      analyzeBehavior(behaviorMetrics)
    ]);
    
    // Calculate final risk
    const finalScore = calculateFinalRisk({
      voiceScore: voiceResult?.data?.silence_score || 50,
      sentimentScore: sentimentResult?.data?.confidence || 50,
      behavioralScore: behaviorResult?.data?.final_score || 50
    });
    
    return {
      voice: voiceResult,
      sentiment: sentimentResult,
      behavior: behaviorResult,
      finalRisk: finalScore,
      isCrisis: finalScore >= 70
    };
  } catch (error) {
    console.error('Combined analysis failed:', error);
    throw error;
  }
};

// ============ RISK CALCULATOR ============
function calculateFinalRisk({ voiceScore, sentimentScore, behavioralScore }) {
  const weights = {
    sentiment: 0.5,
    behavioral: 0.3,
    voice: 0.2
  };
  
  return Math.round(
    (sentimentScore * weights.sentiment) +
    (behavioralScore * weights.behavioral) +
    (voiceScore * weights.voice)
  );
}

// ============ DEFAULT EXPORT ============
export default {
  analyzeVoice,
  analyzeEmotion,
  getPersonalityTraits,
  assessPersonality,
  getDashboardData,
  analyzeSilence,
  getSilenceMetrics,
  analyzeBehavior,
  getPredictions,
  getPredictionTrends,
  getEmotionHistory,
  getEmotionStats,
  getEmotionTrends,
  login,
  register,
  logout,
  analyzeAll
};