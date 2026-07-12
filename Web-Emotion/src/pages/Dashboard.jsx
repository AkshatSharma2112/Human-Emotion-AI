import React, { useState } from "react";
import VoiceAnalyzer from "../components/VoiceAnalyzer";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("voice");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const [scores, setScores] = useState({
    O: 0,
    C: 0,
    E: 0,
    A: 0,
    N: 0,
  });

  // ---------------- QUESTIONS ----------------

  const PERSONALITY_QUESTIONS = {
    openness: [
      { text: "I enjoy trying new and unusual things", reverse: false },
      { text: "I prefer routine over variety", reverse: true },
      { text: "I am curious about many different things", reverse: false },
      { text: "I enjoy thinking about abstract ideas", reverse: false },
    ],

    conscientiousness: [
      { text: "I complete tasks thoroughly and on time", reverse: false },
      {
        text: "I often forget to put things back in their place",
        reverse: true,
      },
      { text: "I like order and regularity", reverse: false },
      { text: "I follow through on my commitments", reverse: false },
    ],

    extraversion: [
      { text: "I enjoy being the center of attention", reverse: false },
      { text: "I prefer to spend time alone", reverse: true },
      { text: "I feel energized after social gatherings", reverse: false },
      { text: "I start conversations easily", reverse: false },
    ],

    agreeableness: [
      { text: "I sympathize with others' feelings", reverse: false },
      { text: "I tend to find fault with others", reverse: true },
      { text: "I take time to help others", reverse: false },
      { text: "I believe people have good intentions", reverse: false },
    ],

    neuroticism: [
      { text: "I often feel anxious or stressed", reverse: false },
      { text: "I remain calm under pressure", reverse: true },
      { text: "I worry about things", reverse: false },
      { text: "I experience mood swings", reverse: false },
    ],
  };

  // ---------------- FLATTEN QUESTIONS ----------------

  const questions = [
    ...PERSONALITY_QUESTIONS.openness.map((q) => ({
      ...q,
      trait: "O",
    })),

    ...PERSONALITY_QUESTIONS.conscientiousness.map((q) => ({
      ...q,
      trait: "C",
    })),

    ...PERSONALITY_QUESTIONS.extraversion.map((q) => ({
      ...q,
      trait: "E",
    })),

    ...PERSONALITY_QUESTIONS.agreeableness.map((q) => ({
      ...q,
      trait: "A",
    })),

    ...PERSONALITY_QUESTIONS.neuroticism.map((q) => ({
      ...q,
      trait: "N",
    })),
  ];

  // ---------------- ANSWER ----------------

  const handleAnswer = (value) => {
    const question = questions[currentQuestion];

    const score = question.reverse ? 6 - value : value;

    setScores((prev) => ({
      ...prev,
      [question.trait]: prev[question.trait] + score,
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizComplete(true);
    }
  };

  // ---------------- RESTART ----------------

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setQuizComplete(false);

    setScores({
      O: 0,
      C: 0,
      E: 0,
      A: 0,
      N: 0,
    });
  };

  // Maximum score for each trait
  const maxScore = 20;

  return (
    <div
      style={{
        background: "#070d19",
        color: "white",
        minHeight: "100vh",
        display: "flex",
      }}
    >
      {/* Sidebar */}

      <aside
        style={{
          width: 250,
          background: "#0b1329",
          padding: 25,
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2>Emotion AI</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 30,
          }}
        >
          {[
            {
              id: "voice",
              label: "Voice Analyzer",
            },
            {
              id: "quiz",
              label: "Personality Quiz",
            },
            {
              id: "behavior",
              label: "Behavioral Fusion",
            },
          ].map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: 15,
                cursor: "pointer",
                borderRadius: 10,
                background:
                  activeTab === tab.id
                    ? "rgba(59,130,246,.3)"
                    : "transparent",
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}

      <main style={{ flex: 1, padding: 40 }}>
        <div
          style={{
            background: "#0b1329",
            borderRadius: 20,
            padding: 35,
          }}
        >
          {activeTab === "voice" && <VoiceAnalyzer />}

          {activeTab === "quiz" && (
            <>
              {!quizComplete ? (
                <>
                  <h2>🧠 Personality Assessment</h2>

                  <h3 style={{ marginTop: 25 }}>
                    Question {currentQuestion + 1} / {questions.length}
                  </h3>

                  <p
                    style={{
                      fontSize: 22,
                      marginTop: 30,
                      marginBottom: 30,
                    }}
                  >
                    {questions[currentQuestion].text}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: 15,
                    }}
                  >
                    {['Strongly Agree','Agree', 'Neutral', 'Disagree', 'Strongly Disagree'].map((v) => (
                      <button
                        key={v}
                        onClick={() => handleAnswer(v)}
                        style={{
                          padding: "12px 22px",
                          fontSize: 18,
                          background: "#2563eb",
                          border: "none",
                          borderRadius: 8,
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2>Your Personality Profile</h2>

                  {Object.keys(scores).map((trait) => (
                    <div
                      key={trait}
                      style={{
                        marginTop: 25,
                      }}
                    >
                      <strong>
                        {trait} : {scores[trait]} / {maxScore}
                      </strong>

                      <div
                        style={{
                          width: "100%",
                          background: "#1e293b",
                          height: 12,
                          borderRadius: 8,
                          marginTop: 10,
                        }}
                      >
                        <div
                          style={{
                            width: `${
                              (scores[trait] / maxScore) * 100
                            }%`,
                            background: "#3b82f6",
                            height: "100%",
                            borderRadius: 8,
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={restartQuiz}
                    style={{
                      marginTop: 40,
                      padding: "12px 25px",
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    Restart Quiz
                  </button>
                </>
              )}
            </>
          )}

          {activeTab === "behavior" && (
            <>
              <h2>Behavioral Fusion</h2>
              <p>System Core Initializing...</p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}