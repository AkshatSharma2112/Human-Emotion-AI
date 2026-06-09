// src/services/writingStyle.js

// Detect writing style changes
export function analyzeWritingStyle(text) {
  if (!text || text.trim().length === 0) {
    return {
      sentence_length: 0,
      punctuation_score: 0,
      emoji_score: 0,
      capitalization_score: 0,
      overall_score: 0
    };
  }

  // 1. Sentence Length Analysis
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 
    ? sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / sentences.length 
    : text.split(/\s+/).length;
  
  let sentenceScore = 0;
  if (avgSentenceLength <= 3) sentenceScore = 30; // Very short - possible withdrawal
  else if (avgSentenceLength <= 6) sentenceScore = 15;
  else if (avgSentenceLength >= 15) sentenceScore = 10; // Too long - rambling
  else sentenceScore = 0; // Normal

  // 2. Punctuation Analysis
  const exclamations = (text.match(/!/g) || []).length;
  const questions = (text.match(/\?/g) || []).length;
  const ellipsis = (text.match(/\.\.\./g) || []).length;
  
  let punctuationScore = 0;
  if (exclamations === 0 && questions === 0 && ellipsis > 0) punctuationScore = 20; // Hesitation
  else if (exclamations === 0 && questions === 0) punctuationScore = 15; // Flat affect
  else if (exclamations > 3 || questions > 3) punctuationScore = 5; // Emotional (actually good)
  else punctuationScore = 0;

  // 3. Emoji Analysis
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]/gu;
  const emojis = text.match(emojiRegex) || [];
  const emojiCount = emojis.length;
  
  let emojiScore = 0;
  if (emojiCount === 0) emojiScore = 15; // No emojis - less expressive
  else if (emojiCount <= 2) emojiScore = 5;
  else emojiScore = 0;

  // 4. Capitalization Analysis
  const words = text.split(/\s+/);
  const capitalizedWords = words.filter(w => w[0] === w[0]?.toUpperCase() && w[0] !== w[0]?.toLowerCase());
  const capitalizationRatio = capitalizedWords.length / words.length;
  
  let capitalizationScore = 0;
  if (capitalizationRatio < 0.1 && text.length > 20) capitalizationScore = 20; // No capitals - lethargy
  else if (capitalizationRatio < 0.3) capitalizationScore = 10;
  else capitalizationScore = 0;

  // Overall writing style score (higher = more concerning)
  let overallScore = sentenceScore + punctuationScore + emojiScore + capitalizationScore;
  overallScore = Math.min(overallScore, 100);

  let severity = "Normal";
  if (overallScore >= 50) severity = "High Concern";
  else if (overallScore >= 30) severity = "Moderate Concern";
  else if (overallScore >= 15) severity = "Mild Concern";

  return {
    sentence_length: Math.round(avgSentenceLength * 10) / 10,
    sentence_score: sentenceScore,
    punctuation_score: punctuationScore,
    emoji_score: emojiScore,
    capitalization_score: capitalizationScore,
    overall_score: overallScore,
    severity: severity,
    emoji_count: emojiCount,
    exclamation_count: exclamations,
    question_count: questions
  };
}

// Compare writing style over time
export function compareWritingStyle(olderAnalyses, newerAnalyses) {
  if (!olderAnalyses.length || !newerAnalyses.length) {
    return { style_change_score: null, trend: "Insufficient data" };
  }

  // Calculate average style scores for older period
  let oldSentenceSum = 0, oldPunctuationSum = 0, oldEmojiSum = 0, oldCapitalSum = 0;
  let oldValidCount = 0;
  
  for (const analysis of olderAnalyses) {
    if (analysis.text && analysis.writing_style) {
      oldSentenceSum += analysis.writing_style.sentence_score || 0;
      oldPunctuationSum += analysis.writing_style.punctuation_score || 0;
      oldEmojiSum += analysis.writing_style.emoji_score || 0;
      oldCapitalSum += analysis.writing_style.capitalization_score || 0;
      oldValidCount++;
    }
  }
  
  // Calculate average style scores for newer period
  let newSentenceSum = 0, newPunctuationSum = 0, newEmojiSum = 0, newCapitalSum = 0;
  let newValidCount = 0;
  
  for (const analysis of newerAnalyses) {
    if (analysis.text && analysis.writing_style) {
      newSentenceSum += analysis.writing_style.sentence_score || 0;
      newPunctuationSum += analysis.writing_style.punctuation_score || 0;
      newEmojiSum += analysis.writing_style.emoji_score || 0;
      newCapitalSum += analysis.writing_style.capitalization_score || 0;
      newValidCount++;
    }
  }
  
  if (oldValidCount === 0 || newValidCount === 0) {
    return { style_change_score: null, trend: "Insufficient data" };
  }
  
  const oldAvg = (oldSentenceSum/oldValidCount + oldPunctuationSum/oldValidCount + oldEmojiSum/oldValidCount + oldCapitalSum/oldValidCount) / 4;
  const newAvg = (newSentenceSum/newValidCount + newPunctuationSum/newValidCount + newEmojiSum/newValidCount + newCapitalSum/newValidCount) / 4;
  
  const styleIncrease = newAvg - oldAvg;
  let trend = "Stable";
  if (styleIncrease > 15) trend = "Worsening";
  else if (styleIncrease < -15) trend = "Improving";
  
  return {
    style_change_score: Math.round(styleIncrease),
    trend: trend,
    old_avg_score: Math.round(oldAvg),
    new_avg_score: Math.round(newAvg)
  };
}