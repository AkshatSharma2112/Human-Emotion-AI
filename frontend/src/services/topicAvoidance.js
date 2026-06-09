// src/services/topicAvoidance.js

// Topics to detect avoidance for
const AVOIDANCE_TOPICS = {
  exam: ['exam', 'test', 'paper', 'quiz', 'assignment', 'deadline', 'study'],
  work: ['work', 'office', 'boss', 'colleague', 'meeting', 'project', 'client'],
  relationship: ['relationship', 'boyfriend', 'girlfriend', 'partner', 'dating', 'breakup'],
  health: ['health', 'doctor', 'hospital', 'sick', 'illness', 'pain', 'mental health'],
  money: ['money', 'bills', 'rent', 'loan', 'expensive', 'budget', 'salary'],
  family: ['family', 'parents', 'mother', 'father', 'brother', 'sister', 'home']
};

// Avoidance indicators (phrases that suggest avoiding a topic)
const AVOIDANCE_PHRASES = [
  "don't want to talk about",
  "not going to discuss",
  "let's not talk about",
  "i'd rather not say",
  "skip that topic",
  "forget about that",
  "doesn't matter",
  "never mind",
  "leave it",
  "not important",
  "don't ask",
  "i don't want to discuss",
  "rather not talk",
  "avoiding",
  "don't want to think about"
];

// Detect if text contains avoidance behavior
export function detectTopicAvoidance(text) {
  const lowerText = text.toLowerCase();
  
  let detectedTopics = [];
  let avoidanceScore = 0;
  
  // Check for avoidance phrases first (strong indicator)
  let hasAvoidancePhrase = false;
  for (const phrase of AVOIDANCE_PHRASES) {
    if (lowerText.includes(phrase)) {
      hasAvoidancePhrase = true;
      avoidanceScore += 30; // Strong signal
      break;
    }
  }
  
  // Detect which topics are being avoided
  for (const [topic, keywords] of Object.entries(AVOIDANCE_TOPICS)) {
    let topicMentioned = false;
    
    // Check if topic keywords appear in text
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        topicMentioned = true;
        break;
      }
    }
    
    if (topicMentioned) {
      detectedTopics.push(topic);
      
      // If topic mentioned AND avoidance phrase present
      if (hasAvoidancePhrase) {
        avoidanceScore += 20;
      }
    }
  }
  
  // Cap at 100
  avoidanceScore = Math.min(avoidanceScore, 100);
  
  let severity = "None";
  if (avoidanceScore >= 70) severity = "High";
  else if (avoidanceScore >= 40) severity = "Medium";
  else if (avoidanceScore >= 15) severity = "Low";
  
  return {
    avoidance_score: avoidanceScore,
    severity: severity,
    detected_topics: detectedTopics,
    has_avoidance_phrase: hasAvoidancePhrase,
    alert: avoidanceScore >= 50 ? "⚠️ Topic avoidance detected - user may be suppressing emotions" : null
  };
}

// Analyze historical topic avoidance patterns
export function analyzeHistoricalAvoidance(analyses) {
  if (!analyses || analyses.length < 3) {
    return { trend: "Insufficient data", increasing: false };
  }
  
  // Split into two halves
  const mid = Math.floor(analyses.length / 2);
  const recent = analyses.slice(0, mid);
  const older = analyses.slice(mid);
  
  // Calculate average avoidance score for each period
  const oldAvg = older.reduce((sum, a) => sum + (a.avoidance_score || 0), 0) / older.length;
  const recentAvg = recent.reduce((sum, a) => sum + (a.avoidance_score || 0), 0) / recent.length;
  
  const increase = recentAvg - oldAvg;
  
  return {
    old_avg: Math.round(oldAvg),
    recent_avg: Math.round(recentAvg),
    trend: increase > 10 ? "Increasing" : increase < -10 ? "Decreasing" : "Stable",
    increasing: increase > 5
  };
}