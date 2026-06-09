// src/services/personalityAssessment.js
import { db } from '../config/db';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// Big Five (OCEAN) Questions
export const PERSONALITY_QUESTIONS = {
  openness: [
    { text: "I enjoy trying new and unusual things", reverse: false },
    { text: "I prefer routine over variety", reverse: true },
    { text: "I am curious about many different things", reverse: false },
    { text: "I enjoy thinking about abstract ideas", reverse: false }
  ],
  conscientiousness: [
    { text: "I complete tasks thoroughly and on time", reverse: false },
    { text: "I often forget to put things back in their place", reverse: true },
    { text: "I like order and regularity", reverse: false },
    { text: "I follow through on my commitments", reverse: false }
  ],
  extraversion: [
    { text: "I enjoy being the center of attention", reverse: false },
    { text: "I prefer to spend time alone", reverse: true },
    { text: "I feel energized after social gatherings", reverse: false },
    { text: "I start conversations easily", reverse: false }
  ],
  agreeableness: [
    { text: "I sympathize with others' feelings", reverse: false },
    { text: "I tend to find fault with others", reverse: true },
    { text: "I take time to help others", reverse: false },
    { text: "I believe people have good intentions", reverse: false }
  ],
  neuroticism: [
    { text: "I often feel anxious or stressed", reverse: false },
    { text: "I remain calm under pressure", reverse: true },
    { text: "I worry about things", reverse: false },
    { text: "I experience mood swings", reverse: false }
  ]
};

// Calculate personality score from answers (1-5 scale)
export function calculatePersonalityScore(answers) {
  const scores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  };
  
  const maxPerTrait = 20; // 4 questions × 5 max score
  
  for (const [trait, traitAnswers] of Object.entries(answers)) {
    let total = 0;
    const questions = PERSONALITY_QUESTIONS[trait];
    
    for (let i = 0; i < traitAnswers.length; i++) {
      let score = traitAnswers[i];
      // Reverse score if needed
      if (questions[i].reverse) {
        score = 6 - score; // 1→5, 2→4, 3→3, 4→2, 5→1
      }
      total += score;
    }
    
    // Convert to percentage (0-100)
    scores[trait] = Math.round((total / maxPerTrait) * 100);
  }
  
  return scores;
}

// Get personality description based on scores
export function getPersonalityDescription(scores) {
  const descriptions = {};
  
  if (scores.openness >= 70) descriptions.openness = "High - Creative, curious, open to new experiences";
  else if (scores.openness >= 40) descriptions.openness = "Moderate - Balanced approach to novelty";
  else descriptions.openness = "Low - Prefers routine and familiar experiences";
  
  if (scores.conscientiousness >= 70) descriptions.conscientiousness = "High - Organized, reliable, disciplined";
  else if (scores.conscientiousness >= 40) descriptions.conscientiousness = "Moderate - Flexible with structure";
  else descriptions.conscientiousness = "Low - Spontaneous, may struggle with organization";
  
  if (scores.extraversion >= 70) descriptions.extraversion = "High - Outgoing, energetic, social";
  else if (scores.extraversion >= 40) descriptions.extraversion = "Moderate - Enjoys both social and alone time";
  else descriptions.extraversion = "Low - Reserved, prefers solitude";
  
  if (scores.agreeableness >= 70) descriptions.agreeableness = "High - Compassionate, cooperative, trusting";
  else if (scores.agreeableness >= 40) descriptions.agreeableness = "Moderate - Generally cooperative but assertive";
  else descriptions.agreeableness = "Low - Competitive, skeptical of others";
  
  if (scores.neuroticism >= 70) descriptions.neuroticism = "High - Prone to stress and negative emotions";
  else if (scores.neuroticism >= 40) descriptions.neuroticism = "Moderate - Experiences normal emotional range";
  else descriptions.neuroticism = "Low - Emotionally stable, resilient";
  
  return descriptions;
}

// Save personality assessment to Firebase
export async function savePersonalityAssessment(userId, scores, answers) {
  try {
    const docRef = await addDoc(collection(db, "personality_assessments"), {
      userId: userId,
      scores: scores,
      answers: answers,
      timestamp: new Date().toISOString(),
      week: getWeekNumber(new Date())
    });
    console.log("✅ Personality assessment saved:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error saving personality assessment:", error);
    throw error;
  }
}

// Get personality assessment history
// Get personality assessment history (NO INDEX NEEDED)
export async function getPersonalityHistory(userId, limitCount = 10) {
  try {
    // Simple query without orderBy
    const q = query(
      collection(db, "personality_assessments"),
      where("userId", "==", userId)
    );
    
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort manually in JavaScript
    const sorted = results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return sorted.slice(0, limitCount);
  } catch (error) {
    console.error("Error fetching personality history:", error);
    return [];
  }
}

// Detect personality trait shifts
export function detectTraitShifts(history) {
  if (history.length < 2) {
    return { has_shifts: false, message: "Need at least 2 assessments to detect shifts" };
  }
  
  const latest = history[0].scores;
  const previous = history[1].scores;
  
  const shifts = {};
  const significantShifts = [];
  
  for (const trait of Object.keys(latest)) {
    const change = latest[trait] - previous[trait];
    shifts[trait] = change;
    
    if (Math.abs(change) >= 15) {
      significantShifts.push({
        trait: trait,
        change: change,
        direction: change > 0 ? "increased" : "decreased",
        magnitude: Math.abs(change)
      });
    }
  }
  
  return {
    has_shifts: significantShifts.length > 0,
    shifts: shifts,
    significant_shifts: significantShifts,
    message: significantShifts.length > 0 
      ? `Significant changes detected in: ${significantShifts.map(s => s.trait).join(', ')}`
      : "No significant personality shifts detected"
  };
}

// Helper: Get week number
function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}