// src/pages/PersonalityAssessment.jsx
import { useState } from 'react';
import { 
  PERSONALITY_QUESTIONS, 
  calculatePersonalityScore, 
  savePersonalityAssessment,
  getPersonalityDescription 
} from '../services/personalityAssessment';

function PersonalityAssessment({ userId, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    openness: [],
    conscientiousness: [],
    extraversion: [],
    agreeableness: [],
    neuroticism: []
  });
  const [showResults, setShowResults] = useState(false);
  const [personalityScores, setPersonalityScores] = useState(null);
  const [saving, setSaving] = useState(false);

  // Flatten all questions for linear display
  const allQuestions = [];
  for (const [trait, questions] of Object.entries(PERSONALITY_QUESTIONS)) {
    questions.forEach((q, idx) => {
      allQuestions.push({
        trait: trait,
        index: idx,
        text: q.text,
        reverse: q.reverse
      });
    });
  }

  const handleAnswer = (score) => {
    const currentQ = allQuestions[currentQuestion];
    const newAnswers = { ...answers };
    newAnswers[currentQ.trait][currentQ.index] = score;
    setAnswers(newAnswers);

    if (currentQuestion + 1 < allQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      const scores = calculatePersonalityScore(newAnswers);
      setPersonalityScores(scores);
      setShowResults(true);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePersonalityAssessment(userId, personalityScores, answers);
      alert("✅ Personality assessment saved!");
      if (onComplete) onComplete();
    } catch (error) {
      alert("Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (showResults && personalityScores) {
    const descriptions = getPersonalityDescription(personalityScores);
    return (
      <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
        <h2>🌟 Your Personality Profile</h2>
        
        <div style={{ marginTop: 20 }}>
          <h3>Big Five (OCEAN) Scores</h3>
          {Object.entries(personalityScores).map(([trait, score]) => (
            <div key={trait} style={{ marginBottom: 15 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{trait.charAt(0).toUpperCase() + trait.slice(1)}</strong>
                <span>{score}/100</span>
              </div>
              <div style={{ 
                backgroundColor: "#e0e0e0", 
                borderRadius: 10, 
                overflow: "hidden",
                height: 20
              }}>
                <div style={{ 
                  width: `${score}%`, 
                  backgroundColor: getScoreColor(score), 
                  height: "100%",
                  transition: "width 0.5s"
                }} />
              </div>
              <small style={{ color: "#666" }}>{descriptions[trait]}</small>
            </div>
          ))}
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            marginTop: 20,
            padding: "12px 24px",
            fontSize: 16,
            backgroundColor: saving ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            width: "100%"
          }}
        >
          {saving ? "Saving..." : "💾 Save to Profile"}
        </button>
      </div>
    );
  }

  const currentQ = allQuestions[currentQuestion];
  const progress = ((currentQuestion) / allQuestions.length) * 100;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>🧠 Personality Assessment</h2>
      <p style={{ color: "#666" }}>Rate how much you agree with each statement</p>
      
      <div style={{ 
        backgroundColor: "#e0e0e0", 
        borderRadius: 10, 
        overflow: "hidden",
        height: 8,
        marginBottom: 30
      }}>
        <div style={{ 
          width: `${progress}%`, 
          backgroundColor: "#2196F3", 
          height: "100%" 
        }} />
      </div>
      
      <div style={{ 
        border: "1px solid #ddd", 
        borderRadius: 12, 
        padding: 30,
        backgroundColor: "#fafafa",
        textAlign: "center"
      }}>
        <p style={{ fontSize: 18, marginBottom: 30 }}>
          {currentQ.text}
        </p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3, 4, 5].map(score => (
            <button
              key={score}
              onClick={() => handleAnswer(score)}
              style={{
                padding: "12px",
                fontSize: 16,
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#e3f2fd"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#fff"}
            >
              {score === 1 && "Strongly Disagree"}
              {score === 2 && "Disagree"}
              {score === 3 && "Neutral"}
              {score === 4 && "Agree"}
              {score === 5 && "Strongly Agree"}
            </button>
          ))}
        </div>
      </div>
      
      <p style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
        Question {currentQuestion + 1} of {allQuestions.length}
      </p>
    </div>
  );
}

function getScoreColor(score) {
  if (score >= 70) return "#4CAF50";
  if (score >= 40) return "#FFC107";
  return "#FF9800";
}

export default PersonalityAssessment;