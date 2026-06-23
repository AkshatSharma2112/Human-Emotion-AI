// src/pages/Dashboard.jsx

import React, { useState } from 'react';
import { analyzeAll } from '../services/api';
import EmotionCard from '../components/EmotionCard';

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleVoiceAnalysis = async (audioData) => {
    setLoading(true);
    try {
      // Get behavioral metrics (your existing logic)
      const behaviorMetrics = {
        message_count_change: 8,   // From your screenshot
        message_length_change: -92,
        response_gap: 4.6,
        topic_avoidance: 0
      };
      
      // Run full analysis
      const analysis = await analyzeAll(audioData, transcript, behaviorMetrics);
      
      setResult(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crisis alert component
  const CrisisAlert = ({ analysis }) => {
    if (!analysis.isCrisis && analysis.finalRisk < 60) return null;
    
    return (
      <div style={{
        backgroundColor: '#ff0000',
        color: 'white',
        padding: '25px',
        borderRadius: '12px',
        margin: '20px 0',
        border: '3px solid #cc0000'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>
          {analysis.isCrisis ? '🚨 CRISIS DETECTED' : '⚠️ HIGH RISK DETECTED'}
        </h2>
        
        <p><strong>Risk Score:</strong> {analysis.finalRisk}/100</p>
        <p><strong>Detected issues:</strong></p>
        <ul>
          {analysis.sentiment.matched_keywords?.map((keyword, i) => (
            <li key={i}>"{keyword}"</li>
          ))}
        </ul>
        
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#cc0000', borderRadius: '8px' }}>
          <strong>📞 Immediate Help Available:</strong><br />
          • Suicide Prevention Helpline: <strong>988</strong><br />
          • iCall: <strong>022-25521111</strong><br />
          • Vandrevala Foundation: <strong>1860-266-2345</strong>
        </div>
        
        <button
          onClick={() => window.open('https://www.google.com/search?q=mental+health+helpline+india')}
          style={{ marginTop: '15px', padding: '12px 24px', fontSize: '16px' }}
        >
          Find More Resources
        </button>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mental Health Assessment</h1>
      
      {/* Your existing voice input component */}
      <div>
        <button onClick={() => {/* Record audio */}}>
          Record Voice
        </button>
        <textarea 
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Or type your thoughts here..."
        />
        <button onClick={handleVoiceAnalysis} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      
      {/* Display results */}
      {result && (
        <div>
          <CrisisAlert analysis={result} />
          
          <EmotionCard 
            sentiment={result.sentiment}
            riskScore={result.finalRisk}
            voiceMetrics={result.voice}
          />
          
          {/* Detailed breakdown */}
          <details style={{ marginTop: '20px' }}>
            <summary>View Detailed Metrics</summary>
            <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <h4>Sentiment Analysis</h4>
              <pre>{JSON.stringify(result.sentiment, null, 2)}</pre>
              
              <h4>Voice Analysis</h4>
              <pre>{JSON.stringify(result.voice, null, 2)}</pre>
              
              <h4>Behavioral Analysis</h4>
              <pre>{JSON.stringify(result.behavior, null, 2)}</pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}