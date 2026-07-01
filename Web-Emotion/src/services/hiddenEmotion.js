// src/services/hiddenEmotion.js

// Keywords that indicate emotional suppression
const SUPPRESSION_KEYWORDS = [
  { word: "i'm fine", weight: 20, hiddenEmotion: "sadness" },
  { word: "it's okay", weight: 15, hiddenEmotion: "sadness" },
  { word: "don't worry", weight: 10, hiddenEmotion: "anxiety" },
  { word: "no problem", weight: 10, hiddenEmotion: "fear" },
  { word: "whatever", weight: 15, hiddenEmotion: "anger" },
  { word: "i guess", weight: 10, hiddenEmotion: "uncertainty" },
  { word: "maybe", weight: 8, hiddenEmotion: "anxiety" },
  { word: "kind of", weight: 8, hiddenEmotion: "uncertainty" },
  { word: "sort of", weight: 8, hiddenEmotion: "uncertainty" },
  { word: "not really", weight: 12, hiddenEmotion: "sadness" },
  { word: "i suppose", weight: 10, hiddenEmotion: "resignation" }
];

// Contradiction detection
const CONTRADICTION_PAIRS = [
  { positive: ["happy", "great", "wonderful", "excellent"], negative: ["actually", "but", "however", "honestly"] },
  { positive: ["fine", "okay", "alright"], negative: ["stressed", "tired", "overwhelmed", "busy"] }
];

// Micro-expression cues
const MICRO_EXPRESSIONS = [
  "i think",
  "i feel",
  "maybe i should",
  "perhaps",
  "honestly",
  "to be honest",
  "if that makes sense",
  "i don't know",
  "does that make sense"
];

export function detectHiddenEmotion(text, detectedEmotion, confidence) {
  const lowerText = text.toLowerCase();
  
  let suppressionScore = 0;
  let hiddenEmotions = [];
  let contradictions = [];
  
  // 1. Check for suppression keywords
  for (const item of SUPPRESSION_KEYWORDS) {
    if (lowerText.includes(item.word)) {
      suppressionScore += item.weight;
      hiddenEmotions.push({
        emotion: item.hiddenEmotion,
        confidence: item.weight / 20, // Normalize to 0-1
        indicator: `Used "${item.word}"`
      });
    }
  }
  
  // 2. Check for contradictions
  for (const pair of CONTRADICTION_PAIRS) {
    let hasPositive = false;
    let hasNegative = false;
    
    for (const pos of pair.positive) {
      if (lowerText.includes(pos)) hasPositive = true;
    }
    for (const neg of pair.negative) {
      if (lowerText.includes(neg)) hasNegative = true;
    }
    
    if (hasPositive && hasNegative) {
      contradictions.push({
        type: "emotional_contradiction",
        message: "Says positive but shows negative cues"
      });
      suppressionScore += 25;
    }
  }
  
  // 3. Check for micro-expressions
  let microExpressionCount = 0;
  for (const expr of MICRO_EXPRESSIONS) {
    if (lowerText.includes(expr)) {
      microExpressionCount++;
      suppressionScore += 5;
    }
  }
  
  // 4. Emotion confidence mismatch (high emotion but uncertain language)
  if (confidence > 0.8 && microExpressionCount > 1) {
    suppressionScore += 20;
    hiddenEmotions.push({
      emotion: "anxiety",
      confidence: 0.6,
      indicator: "High confidence but uncertain language"
    });
  }
  
  // Cap suppression score at 100
  suppressionScore = Math.min(suppressionScore, 100);
  
  // Determine if emotion is suppressed
  let suppressionLevel = "None";
  let primaryHiddenEmotion = null;
  
  if (suppressionScore >= 60) {
    suppressionLevel = "High";
  } else if (suppressionScore >= 30) {
    suppressionLevel = "Medium";
  } else if (suppressionScore >= 15) {
    suppressionLevel = "Low";
  }
  
  // Get most likely hidden emotion
  if (hiddenEmotions.length > 0) {
    const grouped = {};
    for (const he of hiddenEmotions) {
      if (!grouped[he.emotion]) {
        grouped[he.emotion] = { count: 0, totalConfidence: 0 };
      }
      grouped[he.emotion].count++;
      grouped[he.emotion].totalConfidence += he.confidence;
    }
    
    let maxCount = 0;
    for (const [emotion, data] of Object.entries(grouped)) {
      if (data.count > maxCount) {
        maxCount = data.count;
        primaryHiddenEmotion = emotion;
      }
    }
  }
  
  return {
    hidden_emotion_detected: suppressionScore >= 15,
    suppression_score: suppressionScore,
    suppression_level: suppressionLevel,
    primary_hidden_emotion: primaryHiddenEmotion,
    hidden_emotions: hiddenEmotions,
    contradictions: contradictions,
    micro_expression_count: microExpressionCount,
    alert: suppressionScore >= 50 ? "⚠️ Emotional suppression detected - user may not be expressing true feelings" : null
  };
}

// Calculate overall hidden emotion score for behavioral intelligence
export function calculateHiddenEmotionScore(analyses) {
  if (!analyses || analyses.length === 0) {
    return { score: 0, level: "Unknown", message: "No data for hidden emotion analysis" };
  }
  
  let totalSuppression = 0;
  let suppressionCount = 0;
  let hiddenEmotionsDetected = [];
  
  for (const analysis of analyses) {
    if (analysis.text && analysis.emotion) {
      const hidden = detectHiddenEmotion(analysis.text, analysis.emotion, analysis.confidence);
      if (hidden.hidden_emotion_detected) {
        totalSuppression += hidden.suppression_score;
        suppressionCount++;
        if (hidden.primary_hidden_emotion) {
          hiddenEmotionsDetected.push(hidden.primary_hidden_emotion);
        }
      }
    }
  }
  
  const avgSuppression = suppressionCount > 0 ? totalSuppression / suppressionCount : 0;
  
  // Hidden emotion score (inverse of suppression - lower suppression = better emotional awareness)
  let hiddenEmotionScore = 100 - avgSuppression;
  hiddenEmotionScore = Math.max(0, Math.min(100, hiddenEmotionScore));
  
  let level = "Good";
  if (hiddenEmotionScore >= 80) level = "Excellent";
  else if (hiddenEmotionScore >= 60) level = "Good";
  else if (hiddenEmotionScore >= 40) level = "Moderate";
  else level = "Needs Attention";
  
  return {
    score: Math.round(hiddenEmotionScore),
    level: level,
    avg_suppression_score: Math.round(avgSuppression),
    suppression_detected_count: suppressionCount,
    common_hidden_emotions: [...new Set(hiddenEmotionsDetected)].slice(0, 3),
    message: suppressionCount > 0 
      ? `Hidden emotions detected in ${suppressionCount} messages`
      : "No significant emotional suppression detected"
  };
}