// src/services/silenceIntelligence.js
import { getLast7DaysAnalyses } from '../config/db.js';
import { detectTopicAvoidance } from './topicAvoidance.js';
import { calculateResponseGaps, getHoursSinceLastResponse } from './responseGap.js';
import { analyzeWritingStyle, compareWritingStyle } from './writingStyle.js';

export async function calculateSilenceScore(userId) {
  // Get last 7 days data
  const analyses = await getLast7DaysAnalyses(userId);
  
  if (analyses.length < 5) {
    return {
      silence_score: null,
      risk: "Insufficient Data",
      alert: `Need at least 5 analyses. Currently have ${analyses.length}`,
      required_more: 5 - analyses.length,
      total_analyses: analyses.length
    };
  }
  
  // First, analyze writing style for each analysis and store
  for (const analysis of analyses) {
    if (analysis.text && !analysis.writing_style) {
      analysis.writing_style = analyzeWritingStyle(analysis.text);
    }
  }
  
  // Split into two halves
  const midPoint = Math.floor(analyses.length / 2);
  const olderAnalyses = analyses.slice(midPoint);
  const newerAnalyses = analyses.slice(0, midPoint);
  
  // 1. Message Count Change
  const oldCount = olderAnalyses.length;
  const newCount = newerAnalyses.length;
  const countChange = oldCount > 0 ? ((oldCount - newCount) / oldCount) * 100 : 0;
  
  // 2. Average Word Length Change
  const oldAvgLength = olderAnalyses.reduce((sum, a) => sum + (a.wordCount || 50), 0) / oldCount;
  const newAvgLength = newerAnalyses.reduce((sum, a) => sum + (a.wordCount || 50), 0) / newCount;
  const lengthChange = oldAvgLength > 0 ? ((oldAvgLength - newAvgLength) / oldAvgLength) * 100 : 0;
  
  // 3. Emotion Variation
  const oldEmotions = [...new Set(olderAnalyses.map(a => a.emotion))];
  const newEmotions = [...new Set(newerAnalyses.map(a => a.emotion))];
  const variationChange = oldEmotions.length - newEmotions.length;
  
  // 4. Topic Avoidance Detection
  let totalAvoidanceScore = 0;
  let avoidanceCount = 0;
  let avoidedTopics = [];
  let highAvoidanceDetected = false;
  
  for (const analysis of newerAnalyses) {
    if (analysis.text) {
      const avoidance = detectTopicAvoidance(analysis.text);
      totalAvoidanceScore += avoidance.avoidance_score;
      avoidanceCount++;
      if (avoidance.detected_topics.length > 0) {
        avoidedTopics.push(...avoidance.detected_topics);
      }
      if (avoidance.avoidance_score > 50) {
        highAvoidanceDetected = true;
      }
    }
  }
  
  const avgAvoidanceScore = avoidanceCount > 0 ? totalAvoidanceScore / avoidanceCount : 0;
  
  // 5. Response Gap Analysis
  const responseGap = calculateResponseGaps(analyses);
  const hoursSinceLast = getHoursSinceLastResponse(analyses);
  
  let gapScore = 0;
  let gapAlert = null;
  if (responseGap.gap_score !== null) {
    gapScore = responseGap.gap_score;
    if (responseGap.severity === "High") {
      gapAlert = responseGap.alert;
    }
  }
  
  // 6. Writing Style Changes
  const writingStyleChange = compareWritingStyle(olderAnalyses, newerAnalyses);
  let styleScore = 0;
  let styleAlert = null;
  
  if (writingStyleChange.style_change_score !== null) {
    styleScore = Math.min(Math.abs(writingStyleChange.style_change_score), 100);
    if (writingStyleChange.trend === "Worsening" && writingStyleChange.style_change_score > 20) {
      styleAlert = "⚠️ Writing style deteriorating - possible mental fatigue";
    }
  }
  
  // Get current writing style metrics
  let currentWritingStyle = null;
  if (newerAnalyses.length > 0 && newerAnalyses[0].writing_style) {
    currentWritingStyle = newerAnalyses[0].writing_style;
  }
  
  // Calculate Silence Score (0-100)
  let silenceScore = 0;
  silenceScore += Math.min(Math.max(countChange, 0), 20);     // Max 20
  silenceScore += Math.min(Math.max(lengthChange, 0), 15);    // Max 15
  silenceScore += Math.min(Math.max(variationChange * 6, 0), 15); // Max 15
  silenceScore += Math.min(avgAvoidanceScore * 0.15, 15);      // Max 15
  silenceScore += Math.min(gapScore * 0.15, 15);               // Max 15
  silenceScore += Math.min(styleScore * 0.2, 20);              // Max 20 (NEW)
  
  // Cap at 100
  silenceScore = Math.min(silenceScore, 100);
  
  // Determine Risk Level
  let risk, alertMsg;
  if (silenceScore < 30) {
    risk = "Low";
    alertMsg = "✅ Normal engagement pattern";
  } else if (silenceScore < 60) {
    risk = "Medium";
    alertMsg = "⚠️ Reduced activity detected - monitor user engagement";
  } else {
    risk = "High";
    alertMsg = "🔴 HIGH SILENCE RISK - Possible burnout or withdrawal";
  }
  
  // Add topic avoidance alert
  if (avgAvoidanceScore > 50) {
    const uniqueTopics = [...new Set(avoidedTopics)].slice(0, 3);
    alertMsg += ` ⚠️ Avoiding: ${uniqueTopics.join(', ')}`;
  }
  
  // Add response gap alert
  if (gapAlert) {
    alertMsg += ` ${gapAlert}`;
  }
  
  // Add writing style alert
  if (styleAlert) {
    alertMsg += ` ${styleAlert}`;
  }
  
  // Create burnout alert if score > 70
  let burnoutAlert = null;
  if (silenceScore > 70) {
    burnoutAlert = {
      level: "CRITICAL",
      message: "🔥 BURNOUT RISK DETECTED! Please take a break and consider seeking support.",
      recommendation: "Take 15-minute break, practice deep breathing, talk to someone"
    };
  } else if (silenceScore > 50) {
    burnoutAlert = {
      level: "ELEVATED",
      message: "⚠️ Burnout risk elevated. Monitor your stress levels.",
      recommendation: "Try reducing workload and getting adequate rest"
    };
  }
  
  // Topic avoidance severity
  let topicSeverity = "None";
  if (avgAvoidanceScore >= 50) topicSeverity = "High";
  else if (avgAvoidanceScore >= 25) topicSeverity = "Medium";
  else if (avgAvoidanceScore >= 10) topicSeverity = "Low";
  
  return {
    silence_score: Math.round(silenceScore),
    risk: risk,
    alert: alertMsg,
    burnout_alert: burnoutAlert,
    metrics: {
      message_count_change: Math.round(countChange) + "%",
      length_change: Math.round(lengthChange) + "%",
      emotion_variation_change: variationChange,
      topic_avoidance_score: Math.round(avgAvoidanceScore),
      response_gap_score: responseGap.gap_score !== null ? responseGap.gap_score : "N/A",
      hours_since_last_response: hoursSinceLast !== null ? `${hoursSinceLast} hours` : "N/A",
      writing_style_change_score: writingStyleChange.style_change_score !== null ? writingStyleChange.style_change_score : "N/A",
      writing_style_trend: writingStyleChange.trend
    },
    topic_avoidance: {
      score: Math.round(avgAvoidanceScore),
      detected_topics: [...new Set(avoidedTopics)],
      severity: topicSeverity,
      high_avoidance_detected: highAvoidanceDetected
    },
    response_gap: {
      score: responseGap.gap_score,
      severity: responseGap.severity,
      trend: responseGap.trend,
      average_gap_hours: responseGap.average_gap_hours,
      gap_increase: responseGap.gap_increase_percentage,
      alert: responseGap.alert
    },
    writing_style: {
      current: currentWritingStyle,
      change: writingStyleChange
    },
    total_analyses: analyses.length,
    period: "last 7 days"
  };
}