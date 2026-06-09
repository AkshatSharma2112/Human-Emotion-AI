// src/services/behavioralFusion.js
import { getLast7DaysAnalyses } from '../config/db';
import { getPersonalityHistory } from './personalityAssessment';
import { calculateSilenceScore } from './silenceIntelligence';
import { calculateHiddenEmotionScore } from './hiddenEmotion';

// Calculate Emotional Intelligence Score from emotion analyses
function calculateEmotionalIntelligence(analyses) {
  if (!analyses || analyses.length === 0) {
    return { score: 0, confidence: 0, message: "Insufficient emotion data", level: "Unknown" };
  }

  // 1. Emotion Detection Accuracy (average confidence)
  const avgConfidence = analyses.reduce((sum, a) => sum + (a.confidence || 0.7), 0) / analyses.length;
  
  // 2. Emotion Range (variety of emotions detected)
  const uniqueEmotions = [...new Set(analyses.map(a => a.emotion))];
  const emotionRange = Math.min(uniqueEmotions.length / 6 * 100, 100);
  
  // 3. Emotion Stability (low volatility = higher score)
  let volatility = 0;
  for (let i = 1; i < analyses.length; i++) {
    const emotions = ['joy', 'fear', 'sadness', 'anger', 'anxiety', 'hope'];
    const prevIndex = emotions.indexOf(analyses[i-1].emotion);
    const currIndex = emotions.indexOf(analyses[i].emotion);
    if (prevIndex !== -1 && currIndex !== -1) {
      volatility += Math.abs(prevIndex - currIndex);
    }
  }
  const avgVolatility = analyses.length > 1 ? volatility / (analyses.length - 1) : 0;
  const stabilityScore = Math.max(0, 100 - (avgVolatility * 12));
  
  // Weighted final score
  let emotionalScore = (avgConfidence * 100 * 0.4) + (emotionRange * 0.3) + (stabilityScore * 0.3);
  emotionalScore = Math.min(Math.max(emotionalScore, 0), 100);
  
  let level = "Moderate";
  if (emotionalScore >= 70) level = "High";
  else if (emotionalScore >= 40) level = "Moderate";
  else level = "Low";
  
  return {
    score: Math.round(emotionalScore),
    level: level,
    confidence: Math.round(avgConfidence * 100),
    emotion_range: uniqueEmotions.length,
    stability: Math.round(stabilityScore),
    message: `Emotional awareness is ${level.toLowerCase()} with ${uniqueEmotions.length} different emotions detected`
  };
}

// Calculate Personality Balance Score
function calculatePersonalityBalance(personalityScores) {
  if (!personalityScores) {
    return { score: 0, level: "Unknown", message: "No personality data available", balance: 0, strength: 0, avg_trait_score: 0 };
  }
  
  const scores = Object.values(personalityScores);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // Calculate balance (low variance = more balanced)
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / scores.length;
  const balanceScore = Math.max(0, 100 - (variance / 1.5));
  
  // Personality strength (higher average = stronger personality)
  const strengthScore = avgScore;
  
  // Combined personality score (balance + strength)
  let personalityScore = (balanceScore * 0.5) + (strengthScore * 0.5);
  personalityScore = Math.min(Math.max(personalityScore, 0), 100);
  
  let level = "Balanced";
  if (personalityScore >= 70) level = "Well-Balanced";
  else if (personalityScore >= 40) level = "Balanced";
  else level = "Developing";
  
  return {
    score: Math.round(personalityScore),
    level: level,
    balance: Math.round(balanceScore),
    strength: Math.round(strengthScore),
    avg_trait_score: Math.round(avgScore),
    message: `Personality is ${level.toLowerCase()} with ${Math.round(avgScore)}% average trait strength`
  };
}

// Calculate Engagement Score from silence data
function calculateEngagementScore(silenceData) {
  if (!silenceData || silenceData.silence_score === null) {
    return { score: 50, level: "Moderate", message: "Insufficient engagement data", silence_score: 0 };
  }
  
  // Silence score is inverse of engagement
  // Low silence score = High engagement
  const engagementScore = 100 - silenceData.silence_score;
  
  let level = "Moderate";
  if (engagementScore >= 70) level = "High";
  else if (engagementScore >= 40) level = "Moderate";
  else level = "Low";
  
  let message = `Engagement is ${level.toLowerCase()}`;
  if (silenceData.topic_avoidance?.score > 30) {
    message += ` with some topic avoidance detected`;
  }
  
  return {
    score: Math.round(engagementScore),
    level: level,
    silence_score: silenceData.silence_score,
    message: message
  };
}

// Main Fusion Function - Combine Everything (Including Hidden Emotion)
export async function calculateBehavioralIntelligence(userId) {
  try {
    // Fetch all data in parallel
    const [analyses, personalityHistory, silenceData] = await Promise.all([
      getLast7DaysAnalyses(userId),
      getPersonalityHistory(userId, 1),
      calculateSilenceScore(userId)
    ]);
    
    // Calculate individual scores
    const emotional = calculateEmotionalIntelligence(analyses);
    const hiddenEmotion = calculateHiddenEmotionScore(analyses);
    const personality = calculatePersonalityBalance(personalityHistory[0]?.scores);
    const engagement = calculateEngagementScore(silenceData);
    
    // Final Behavioral Intelligence Score (weighted average with Hidden Emotion)
    // Formula: Emotion AI (25%) + Hidden Emotion (15%) + Silence (30%) + Personality (30%)
    let finalScore = (
      emotional.score * 0.25 +
      hiddenEmotion.score * 0.15 +
      personality.score * 0.30 +
      engagement.score * 0.30
    );
    finalScore = Math.round(finalScore);
    
    // Determine overall level
    let level = "Moderate";
    let color = "#FFC107";
    let recommendation = "";
    
    if (finalScore >= 75) {
      level = "Excellent";
      color = "#4CAF50";
      recommendation = "Your behavioral intelligence is outstanding! Continue your self-awareness practices and consider mentoring others.";
    } else if (finalScore >= 60) {
      level = "Good";
      color = "#8BC34A";
      recommendation = "You have solid behavioral awareness. Focus on areas with lower scores for further growth.";
    } else if (finalScore >= 45) {
      level = "Moderate";
      color = "#FFC107";
      recommendation = "You're on the right track. Try mindfulness practices to improve emotional awareness.";
    } else if (finalScore >= 30) {
      level = "Developing";
      color = "#FF9800";
      recommendation = "Consider regular self-reflection and emotional journaling to improve awareness.";
    } else {
      level = "Needs Attention";
      color = "#F44336";
      recommendation = "Start with small steps: daily mood tracking and setting personal goals.";
    }
    
    // Generate insights
    const insights = [];
    if (emotional.score < 50) insights.push("🧠 Emotional awareness could be improved");
    if (hiddenEmotion.score < 50) insights.push("🎭 Emotional suppression detected - practice authentic expression");
    if (personality.score < 50) insights.push("🎯 Personality development is in early stages");
    if (engagement.score < 50) insights.push("📊 Engagement levels are lower than optimal");
    if (emotional.emotion_range < 3) insights.push("🎭 Limited emotional range detected");
    if (silenceData?.topic_avoidance?.score > 40) insights.push("🚫 Topic avoidance patterns detected");
    if (hiddenEmotion.suppression_detected_count > 0) {
      insights.push(`🔍 Hidden emotions detected in ${hiddenEmotion.suppression_percentage}% of messages`);
    }
    
    return {
      success: true,
      behavioral_intelligence_score: finalScore,
      level: level,
      color: color,
      recommendation: recommendation,
      insights: insights,
      components: {
        emotional_intelligence: emotional,
        hidden_emotion: hiddenEmotion,
        personality_balance: personality,
        engagement_score: engagement
      },
      formula: {
        weights: {
          emotional_intelligence: "25%",
          hidden_emotion: "15%",
          personality_balance: "30%",
          engagement: "30%"
        }
      },
      timestamp: new Date().toISOString(),
      requires_more_data: analyses.length < 5 || personalityHistory.length === 0
    };
    
  } catch (error) {
    console.error("Error calculating behavioral intelligence:", error);
    return {
      success: false,
      error: error.message,
      requires_more_data: true
    };
  }
}

// Get historical behavioral intelligence trends
export async function getBehavioralHistory(userId, days = 30) {
  const current = await calculateBehavioralIntelligence(userId);
  return {
    current: current,
    history: [],
    trend: "stable"
  };
}