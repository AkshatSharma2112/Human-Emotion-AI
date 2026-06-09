// src/services/responseGap.js

// Calculate response gaps between consecutive messages
export function calculateResponseGaps(analyses) {
  if (!analyses || analyses.length < 3) {
    return {
      gap_score: null,
      trend: "Insufficient data",
      average_gap_hours: null,
      message: "Need at least 3 analyses to detect response gaps"
    };
  }

  // Sort by timestamp (oldest first for gap calculation)
  const sorted = [...analyses].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  // Calculate gaps between consecutive messages
  const gaps = [];
  for (let i = 1; i < sorted.length; i++) {
    const prevTime = new Date(sorted[i-1].timestamp);
    const currTime = new Date(sorted[i].timestamp);
    const gapHours = (currTime - prevTime) / (1000 * 60 * 60);
    gaps.push(gapHours);
  }
  
  // Average gap
  const avgGap = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;
  
  // Split gaps into two halves to detect trend
  const midPoint = Math.floor(gaps.length / 2);
  const olderGaps = gaps.slice(0, midPoint);
  const newerGaps = gaps.slice(midPoint);
  
  const oldAvgGap = olderGaps.length > 0 ? olderGaps.reduce((sum, g) => sum + g, 0) / olderGaps.length : avgGap;
  const newAvgGap = newerGaps.length > 0 ? newerGaps.reduce((sum, g) => sum + g, 0) / newerGaps.length : avgGap;
  
  // Calculate gap increase percentage
  let gapIncrease = 0;
  if (oldAvgGap > 0) {
    gapIncrease = ((newAvgGap - oldAvgGap) / oldAvgGap) * 100;
  }
  
  // Determine trend
  let trend = "Stable";
  if (gapIncrease > 30) trend = "Increasing";
  else if (gapIncrease < -30) trend = "Decreasing";
  
  // Calculate response gap score (0-100)
  // Higher score = larger gaps = more silence
  let gapScore = 0;
  
  // Factor 1: Average gap (longer gaps = higher score)
  if (avgGap <= 6) gapScore += 0;       // Within 6 hours
  else if (avgGap <= 24) gapScore += 15; // 6-24 hours
  else if (avgGap <= 72) gapScore += 30; // 1-3 days
  else gapScore += 45;                   // 3+ days
  
  // Factor 2: Gap increase trend
  if (gapIncrease > 50) gapScore += 35;
  else if (gapIncrease > 25) gapScore += 25;
  else if (gapIncrease > 10) gapScore += 15;
  else if (gapIncrease < -10) gapScore -= 10; // Improving
  
  // Factor 3: Irregularity (high standard deviation)
  const avg = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;
  const variance = gaps.reduce((sum, g) => sum + Math.pow(g - avg, 2), 0) / gaps.length;
  const stdDev = Math.sqrt(variance);
  if (stdDev > avg * 1.5) gapScore += 15; // Highly irregular
  
  // Cap at 100
  gapScore = Math.min(Math.max(gapScore, 0), 100);
  
  // Determine severity
  let severity = "Low";
  let alert = null;
  if (gapScore >= 60) {
    severity = "High";
    alert = "⚠️ Response gaps increasing significantly - user may be withdrawing";
  } else if (gapScore >= 35) {
    severity = "Medium";
    alert = "⚠️ Response gaps are increasing - monitor engagement";
  }
  
  return {
    gap_score: Math.round(gapScore),
    severity: severity,
    trend: trend,
    average_gap_hours: Math.round(avgGap * 10) / 10,
    gap_increase_percentage: Math.round(gapIncrease),
    total_gaps_analyzed: gaps.length,
    alert: alert,
    metrics: {
      old_avg_gap_hours: Math.round(oldAvgGap * 10) / 10,
      new_avg_gap_hours: Math.round(newAvgGap * 10) / 10,
      irregularity_score: Math.round(stdDev * 10) / 10
    }
  };
}

// Get latest response timestamp
export function getLastResponseTime(analyses) {
  if (!analyses || analyses.length === 0) return null;
  
  const sorted = [...analyses].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return new Date(sorted[0].timestamp);
}

// Calculate hours since last response
export function getHoursSinceLastResponse(analyses) {
  const lastResponse = getLastResponseTime(analyses);
  if (!lastResponse) return null;
  
  const now = new Date();
  const hoursSince = (now - lastResponse) / (1000 * 60 * 60);
  return Math.round(hoursSince * 10) / 10;
}