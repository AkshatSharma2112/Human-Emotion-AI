import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function PersonalityReport({ scores, history, onClose }) {
  const generatePDF = async () => {
    const element = document.getElementById('personality-report-content');
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('personality-report.pdf');
  };

  const getRecommendation = (trait, score) => {
    const recommendations = {
      openness: {
        high: "Try structured routines to balance your creativity. Set specific goals for your creative projects.",
        medium: "Explore one new hobby this month. Read books from unfamiliar genres.",
        low: "Step out of your comfort zone. Try something new each week, even if small."
      },
      conscientiousness: {
        high: "Remember to take breaks and avoid perfectionism. Delegate tasks when possible.",
        medium: "Use a planner to maintain organization. Set daily 3-task priorities.",
        low: "Start with small daily goals. Use reminders and checklists to build consistency."
      },
      extraversion: {
        high: "Schedule alone time to recharge. Practice active listening in conversations.",
        medium: "Balance social activities with quiet time. Join a club or group.",
        low: "Start with small social interactions. Practice one conversation starter daily."
      },
      agreeableness: {
        high: "Practice saying 'no' when needed. Set healthy boundaries with others.",
        medium: "Continue balancing cooperation with assertiveness. Express your opinions.",
        low: "Practice active listening. Show empathy in small ways each day."
      },
      neuroticism: {
        high: "Try mindfulness meditation for 5 minutes daily. Exercise regularly.",
        medium: "Journal your thoughts. Establish a calming bedtime routine.",
        low: "Your emotional stability is a strength. Help friends who struggle with stress."
      }
    };

    let level = "medium";
    if (score >= 70) level = "high";
    else if (score <= 30) level = "low";
    
    return recommendations[trait]?.[level] || "Continue self-reflection and personal growth.";
  };

  const getComparison = (score) => {
    if (score >= 70) return { text: "Higher than average", percentile: "Top 25%", color: "#4CAF50" };
    if (score >= 50) return { text: "Average range", percentile: "50-70%", color: "#FFC107" };
    if (score >= 30) return { text: "Below average", percentile: "25-50%", color: "#FF9800" };
    return { text: "Significantly lower", percentile: "Bottom 25%", color: "#F44336" };
  };

  const getTraitDescription = (trait, score) => {
    const descriptions = {
      openness: {
        high: "Creative, curious, open to new experiences",
        medium: "Balanced approach to novelty",
        low: "Prefers routine and familiar experiences"
      },
      conscientiousness: {
        high: "Organized, reliable, disciplined",
        medium: "Flexible with structure",
        low: "Spontaneous, may struggle with organization"
      },
      extraversion: {
        high: "Outgoing, energetic, social",
        medium: "Enjoys both social and alone time",
        low: "Reserved, prefers solitude"
      },
      agreeableness: {
        high: "Compassionate, cooperative, trusting",
        medium: "Generally cooperative but assertive",
        low: "Competitive, skeptical of others"
      },
      neuroticism: {
        high: "Prone to stress and negative emotions",
        medium: "Experiences normal emotional range",
        low: "Emotionally stable, resilient"
      }
    };

    let level = "medium";
    if (score >= 70) level = "high";
    else if (score <= 30) level = "low";
    
    return descriptions[trait]?.[level] || "Moderate range";
  };

  const latest = scores;
  const latestHistory = history?.[0];

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "auto"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: 12,
        maxWidth: 800,
        width: "90%",
        maxHeight: "90%",
        overflow: "auto",
        padding: 20
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <h2>📄 Personality Report</h2>
          <button onClick={onClose} style={{ fontSize: 20, cursor: "pointer", background: "none", border: "none" }}>✕</button>
        </div>
        
        <div id="personality-report-content">
          <h1 style={{ textAlign: "center", color: "#2196F3" }}>Personality Assessment Report</h1>
          <p style={{ textAlign: "center", color: "#666" }}>
            Generated: {new Date().toLocaleDateString()}
          </p>
          {latestHistory && (
            <p style={{ textAlign: "center", color: "#666" }}>
              Assessment Date: {new Date(latestHistory.timestamp).toLocaleDateString()}
            </p>
          )}
          
          <hr />
          
          <h2>📊 Your Big Five Personality Profile</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ padding: 10, border: "1px solid #ddd", textAlign: "left" }}>Trait</th>
                <th style={{ padding: 10, border: "1px solid #ddd", textAlign: "left" }}>Score</th>
                <th style={{ padding: 10, border: "1px solid #ddd", textAlign: "left" }}>Description</th>
                <th style={{ padding: 10, border: "1px solid #ddd", textAlign: "left" }}>Comparison</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(latest).map(([trait, score]) => {
                const comparison = getComparison(score);
                return (
                  <tr key={trait}>
                    <td style={{ padding: 10, border: "1px solid #ddd", textTransform: "capitalize" }}>
                      <strong>{trait}</strong>
                    </td>
                    <td style={{ padding: 10, border: "1px solid #ddd" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span>{score}/100</span>
                        <div style={{ flex: 1, backgroundColor: "#e0e0e0", borderRadius: 5, height: 10 }}>
                          <div style={{ width: `${score}%`, backgroundColor: comparison.color, height: 10, borderRadius: 5 }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 10, border: "1px solid #ddd" }}>{getTraitDescription(trait, score)}</td>
                    <td style={{ padding: 10, border: "1px solid #ddd", color: comparison.color }}>
                      {comparison.text}<br/>
                      <small>({comparison.percentile})</small>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <h2>💡 Personalized Recommendations</h2>
          <ul>
            {Object.entries(latest).map(([trait, score]) => (
              <li key={trait}>
                <strong>{trait.charAt(0).toUpperCase() + trait.slice(1)}:</strong> {getRecommendation(trait, score)}
              </li>
            ))}
          </ul>
          
          <h2>📈 Key Insights</h2>
          <ul>
            {Object.entries(latest).map(([trait, score]) => {
              if (score >= 70) {
                return <li key={trait}>Your <strong>{trait}</strong> is a major strength. Use it to excel in your career and relationships.</li>;
              } else if (score <= 30) {
                return <li key={trait}>Your <strong>{trait}</strong> has room for growth. Small daily practices can improve this trait.</li>;
              }
              return null;
            }).filter(Boolean)}
            <li>Your personality profile shows a balanced pattern across most traits.</li>
            <li>Consider retaking this assessment in 3-6 months to track your personal growth.</li>
          </ul>
        </div>
        
        <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 20px", backgroundColor: "#999", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>
            Close
          </button>
          <button onClick={generatePDF} style={{ padding: "10px 20px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>
            📄 Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalityReport;