// src/services/predictionEngine.js
import { getLast7DaysAnalyses } from '../config/db';
import { getPersonalityHistory } from './personalityAssessment';
import { calculateSilenceScore } from './silenceIntelligence';
import { calculateBehavioralIntelligence } from './behavioralFusion';

// Predict Burnout Risk (0-100)
export async function predictBurnoutRisk(userId) {
  try {
    const [analyses, personalityHistory, silenceData, behavioralData] = await Promise.all([
      getLast7DaysAnalyses(userId),
      getPersonalityHistory(userId, 1),
      calculateSilenceScore(userId),
      calculateBehavioralIntelligence(userId)
    ]);
    
    let burnoutScore = 0;
    let factors = [];
    
    // Factor 1: Silence Score (high silence = high burnout risk)
    const silenceScore = silenceData?.silence_score || 0;
    burnoutScore += silenceScore * 0.35;
    if (silenceScore > 50) {
      factors.push(`High silence score (${silenceScore}/100) indicates withdrawal`);
    }
    
    // Factor 2: Neuroticism (high neuroticism = higher burnout risk)
    const neuroticism = personalityHistory[0]?.scores?.neuroticism || 50;
    burnoutScore += (neuroticism * 0.25);
    if (neuroticism > 70) {
      factors.push(`High neuroticism (${neuroticism}/100) increases stress vulnerability`);
    } else if (neuroticism < 30) {
      factors.push(`Low neuroticism (${neuroticism}/100) provides emotional resilience`);
    }
    
    // Factor 3: Topic Avoidance (avoiding topics = coping mechanism)
    const topicAvoidance = silenceData?.topic_avoidance?.score || 0;
    burnoutScore += topicAvoidance * 0.20;
    if (topicAvoidance > 40) {
      factors.push(`Topic avoidance patterns detected (${topicAvoidance}/100)`);
    }
    
    // Factor 4: Engagement Drop (recent vs past)
    const engagementChange = silenceData?.metrics?.message_count_change || "0%";
    const changeValue = parseInt(engagementChange) || 0;
    if (changeValue > 20) {
      burnoutScore += 15;
      factors.push(`Significant engagement drop (${changeValue}%)`);
    }
    
    // Factor 5: Writing Style Deterioration
    const writingStyle = silenceData?.writing_style?.current?.overall_score || 0;
    if (writingStyle > 40) {
      burnoutScore += writingStyle * 0.10;
      factors.push(`Deteriorating writing style (${writingStyle}/100)`);
    }
    
    // Factor 6: Low Emotional Intelligence
    const emotionalIQ = behavioralData?.components?.emotional_intelligence?.score || 70;
    if (emotionalIQ < 50) {
      burnoutScore += (100 - emotionalIQ) * 0.15;
      factors.push(`Low emotional intelligence (${emotionalIQ}/100)`);
    }
    
    // Cap at 100
    burnoutScore = Math.min(Math.round(burnoutScore), 100);
    
    // Determine risk level
    let riskLevel = "Low";
    let riskColor = "#4CAF50";
    let recommendation = "";
    let timeFrame = "";
    
    if (burnoutScore >= 70) {
      riskLevel = "Critical";
      riskColor = "#F44336";
      timeFrame = "Immediate action recommended";
      recommendation = "🔥 Take immediate action: Schedule a break, talk to someone, reduce workload";
    } else if (burnoutScore >= 50) {
      riskLevel = "High";
      riskColor = "#FF9800";
      timeFrame = "Next 1-2 weeks";
      recommendation = "⚠️ High burnout risk: Prioritize self-care, set boundaries, take regular breaks";
    } else if (burnoutScore >= 30) {
      riskLevel = "Moderate";
      riskColor = "#FFC107";
      timeFrame = "Next 2-4 weeks";
      recommendation = "📊 Monitor your stress levels: Practice mindfulness, maintain work-life balance";
    } else {
      riskLevel = "Low";
      riskColor = "#4CAF50";
      timeFrame = "Low risk currently";
      recommendation = "✅ Keep up healthy habits: Regular breaks, social connections, adequate sleep";
    }
    
    return {
      success: true,
      burnout_score: burnoutScore,
      risk_level: riskLevel,
      risk_color: riskColor,
      time_frame: timeFrame,
      recommendation: recommendation,
      factors: factors,
      contributing_factors: {
        silence_score: silenceScore,
        neuroticism: neuroticism,
        topic_avoidance: topicAvoidance,
        engagement_drop: changeValue,
        writing_style_issue: writingStyle
      },
      prevention_tips: getBurnoutPreventionTips(burnoutScore)
    };
    
  } catch (error) {
    console.error("Error predicting burnout:", error);
    return { success: false, error: error.message };
  }
}

// Predict Leadership Potential (0-100)
export async function predictLeadershipPotential(userId) {
  try {
    const [analyses, personalityHistory, silenceData, behavioralData] = await Promise.all([
      getLast7DaysAnalyses(userId),
      getPersonalityHistory(userId, 1),
      calculateSilenceScore(userId),
      calculateBehavioralIntelligence(userId)
    ]);
    
    let leadershipScore = 0;
    let strengths = [];
    let weaknesses = [];
    
    const personality = personalityHistory[0]?.scores || {};
    
    // Factor 1: Conscientiousness (organization, reliability)
    const conscientiousness = personality.conscientiousness || 50;
    leadershipScore += conscientiousness * 0.25;
    if (conscientiousness >= 70) strengths.push("Highly organized and reliable");
    else if (conscientiousness < 40) weaknesses.push("Needs improvement in organization");
    
    // Factor 2: Extraversion (social energy, communication)
    const extraversion = personality.extraversion || 50;
    leadershipScore += extraversion * 0.20;
    if (extraversion >= 70) strengths.push("Outgoing and socially confident");
    else if (extraversion < 40) weaknesses.push("May prefer solitary work over team leadership");
    
    // Factor 3: Openness (adaptability, innovation)
    const openness = personality.openness || 50;
    leadershipScore += openness * 0.15;
    if (openness >= 70) strengths.push("Open to new ideas and adaptable");
    
    // Factor 4: Emotional Intelligence (empathy, self-awareness)
    const emotionalIQ = behavioralData?.components?.emotional_intelligence?.score || 70;
    leadershipScore += emotionalIQ * 0.20;
    if (emotionalIQ >= 70) strengths.push("Strong emotional intelligence");
    
    // Factor 5: Low Neuroticism (stress management)
    const neuroticism = personality.neuroticism || 50;
    const stressManagement = 100 - neuroticism;
    leadershipScore += stressManagement * 0.20;
    if (neuroticism <= 30) strengths.push("Excellent stress management");
    else if (neuroticism >= 70) weaknesses.push("May struggle with stress in leadership roles");
    
    // Cap at 100
    leadershipScore = Math.min(Math.round(leadershipScore), 100);
    
    let potentialLevel = "Emerging";
    let color = "#FFC107";
    let recommendation = "";
    
    if (leadershipScore >= 75) {
      potentialLevel = "Exceptional";
      color = "#4CAF50";
      recommendation = "You have strong leadership qualities. Seek leadership roles and mentorship opportunities.";
    } else if (leadershipScore >= 60) {
      potentialLevel = "Strong";
      color = "#8BC34A";
      recommendation = "Good leadership foundation. Focus on developing your weaker areas.";
    } else if (leadershipScore >= 45) {
      potentialLevel = "Developing";
      color = "#FFC107";
      recommendation = "Leadership potential is developing. Take on small leadership roles to build experience.";
    } else {
      potentialLevel = "Emerging";
      color = "#FF9800";
      recommendation = "Focus on building core skills first: communication, organization, and emotional awareness.";
    }
    
    return {
      success: true,
      leadership_score: leadershipScore,
      potential_level: potentialLevel,
      color: color,
      recommendation: recommendation,
      strengths: strengths,
      weaknesses: weaknesses,
      development_areas: getLeadershipDevelopmentAreas(leadershipScore, personality)
    };
    
  } catch (error) {
    console.error("Error predicting leadership:", error);
    return { success: false, error: error.message };
  }
}

// Predict Stress Forecast (Next 7 days)
export async function predictStressForecast(userId) {
  try {
    const [analyses, personalityHistory, silenceData] = await Promise.all([
      getLast7DaysAnalyses(userId),
      getPersonalityHistory(userId, 1),
      calculateSilenceScore(userId)
    ]);
    
    // Calculate current stress indicators
    let currentStress = 0;
    
    // Factor 1: Neuroticism (baseline stress proneness)
    const neuroticism = personalityHistory[0]?.scores?.neuroticism || 50;
    currentStress += neuroticism * 0.30;
    
    // Factor 2: Recent negative emotions
    const recentAnalyses = analyses.slice(0, 5);
    const negativeEmotions = recentAnalyses.filter(a => 
      ['fear', 'sadness', 'anger', 'anxiety'].includes(a.emotion)
    ).length;
    const negativeRatio = recentAnalyses.length > 0 ? (negativeEmotions / recentAnalyses.length) * 100 : 0;
    currentStress += negativeRatio * 0.35;
    
    // Factor 3: Silence/withdrawal
    const silenceScore = silenceData?.silence_score || 0;
    currentStress += silenceScore * 0.35;
    
    currentStress = Math.min(Math.round(currentStress), 100);
    
    // Generate 7-day forecast
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const forecast = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      let dayStress = currentStress;
      
      // Weekend effect (lower stress on weekends)
      const dayOfWeek = (today.getDay() + i) % 7;
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayStress = Math.max(0, dayStress - 15);
      }
      
      // Mid-week peak (Wednesday/Thursday higher stress)
      if (dayOfWeek === 3 || dayOfWeek === 4) {
        dayStress = Math.min(100, dayStress + 10);
      }
      
      // Trend adjustment (if stress is increasing)
      if (silenceScore > 50) {
        dayStress = Math.min(100, dayStress + (i * 3));
      }
      
      let level = "Low";
      let color = "#4CAF50";
      if (dayStress >= 70) {
        level = "High";
        color = "#F44336";
      } else if (dayStress >= 40) {
        level = "Moderate";
        color = "#FFC107";
      }
      
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      forecast.push({
        day: days[dayOfWeek],
        date: date.toLocaleDateString(),
        stress_score: Math.round(dayStress),
        level: level,
        color: color
      });
    }
    
    let trend = "Stable";
    if (forecast[0].stress_score < forecast[6].stress_score) trend = "Increasing";
    else if (forecast[0].stress_score > forecast[6].stress_score) trend = "Decreasing";
    
    let recommendation = "";
    if (trend === "Increasing") {
      recommendation = "📈 Stress expected to rise. Plan relaxation activities mid-week.";
    } else if (trend === "Decreasing") {
      recommendation = "📉 Stress expected to decrease. Weekend may provide relief.";
    } else {
      recommendation = "➡️ Stress levels expected to remain stable.";
    }
    
    return {
      success: true,
      current_stress: currentStress,
      trend: trend,
      forecast_7day: forecast,
      recommendation: recommendation,
      stress_triggers: getStressTriggers(analyses)
    };
    
  } catch (error) {
    console.error("Error predicting stress:", error);
    return { success: false, error: error.message };
  }
}

// Predict Team Collaboration Score
export async function predictTeamCollaboration(userId) {
  try {
    const [analyses, personalityHistory, silenceData] = await Promise.all([
      getLast7DaysAnalyses(userId),
      getPersonalityHistory(userId, 1),
      calculateSilenceScore(userId)
    ]);
    
    let collaborationScore = 0;
    let traits = [];
    
    const personality = personalityHistory[0]?.scores || {};
    
    // Agreeableness (cooperation, empathy)
    const agreeableness = personality.agreeableness || 50;
    collaborationScore += agreeableness * 0.30;
    if (agreeableness >= 70) traits.push("Highly cooperative and empathetic");
    
    // Extraversion (communication, team engagement)
    const extraversion = personality.extraversion || 50;
    collaborationScore += extraversion * 0.25;
    if (extraversion >= 70) traits.push("Strong team communicator");
    
    // Conscientiousness (reliability)
    const conscientiousness = personality.conscientiousness || 50;
    collaborationScore += conscientiousness * 0.20;
    if (conscientiousness >= 70) traits.push("Reliable team member");
    
    // Low Neuroticism (stable under pressure)
    const neuroticism = personality.neuroticism || 50;
    const stability = 100 - neuroticism;
    collaborationScore += stability * 0.15;
    if (neuroticism <= 30) traits.push("Calm under pressure");
    
    // Low topic avoidance (open communication)
    const topicAvoidance = silenceData?.topic_avoidance?.score || 0;
    collaborationScore += (100 - topicAvoidance) * 0.10;
    if (topicAvoidance < 20) traits.push("Open communicator");
    
    collaborationScore = Math.min(Math.round(collaborationScore), 100);
    
    let level = "Good";
    let color = "#8BC34A";
    let recommendation = "";
    
    if (collaborationScore >= 75) {
      level = "Excellent";
      color = "#4CAF50";
      recommendation = "You would be an excellent team player. Natural collaborator with strong interpersonal skills.";
    } else if (collaborationScore >= 60) {
      level = "Good";
      color = "#8BC34A";
      recommendation = "Good team collaboration skills. Continue building trust and communication.";
    } else if (collaborationScore >= 45) {
      level = "Moderate";
      color = "#FFC107";
      recommendation = "Work on active listening and expressing your ideas openly.";
    } else {
      level = "Needs Improvement";
      color = "#FF9800";
      recommendation = "Focus on communication skills and being more open with team members.";
    }
    
    return {
      success: true,
      collaboration_score: collaborationScore,
      level: level,
      color: color,
      recommendation: recommendation,
      strengths: traits,
      improvement_tips: getCollaborationTips(collaborationScore)
    };
    
  } catch (error) {
    console.error("Error predicting collaboration:", error);
    return { success: false, error: error.message };
  }
}

// Helper functions
function getBurnoutPreventionTips(score) {
  if (score >= 70) {
    return ["Take an immediate break", "Talk to a friend or counselor", "Reduce workload", "Practice deep breathing"];
  } else if (score >= 50) {
    return ["Schedule regular breaks", "Set work boundaries", "Practice mindfulness", "Get adequate sleep"];
  } else if (score >= 30) {
    return ["Maintain work-life balance", "Stay connected with colleagues", "Take short walks"];
  }
  return ["Continue healthy habits", "Regular self-care", "Stay socially connected"];
}

function getLeadershipDevelopmentAreas(score, personality) {
  const areas = [];
  if (personality.conscientiousness < 60) areas.push("Organization and planning");
  if (personality.extraversion < 60) areas.push("Communication and public speaking");
  if (personality.openness < 60) areas.push("Adaptability to new ideas");
  if (personality.neuroticism > 50) areas.push("Stress management under pressure");
  if (areas.length === 0) areas.push("Continue developing existing strengths");
  return areas;
}

function getStressTriggers(analyses) {
  const recentAnalyses = analyses.slice(0, 10);
  const triggers = [];
  
  const stressKeywords = {
    deadline: ["deadline", "due", "submission", "timeline"],
    workload: ["overwhelmed", "too much", "busy", "swamped"],
    relationship: ["argument", "conflict", "fight", "disagree"],
    health: ["tired", "exhausted", "sick", "fatigue"],
    uncertainty: ["confused", "unsure", "don't know", "maybe"]
  };
  
  for (const analysis of recentAnalyses) {
    if (analysis.text) {
      const lowerText = analysis.text.toLowerCase();
      for (const [trigger, keywords] of Object.entries(stressKeywords)) {
        for (const keyword of keywords) {
          if (lowerText.includes(keyword)) {
            if (!triggers.includes(trigger)) {
              triggers.push(trigger);
            }
            break;
          }
        }
      }
    }
  }
  
  return triggers.slice(0, 3);
}

function getCollaborationTips(score) {
  if (score < 50) {
    return ["Practice active listening", "Share ideas openly", "Ask for feedback", "Participate in team activities"];
  } else if (score < 70) {
    return ["Initiate team discussions", "Offer help to colleagues", "Celebrate team wins"];
  }
  return ["Mentor new team members", "Lead team initiatives", "Share best practices"];
}