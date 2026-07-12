// backend/src/controllers/emotion.controller.js
const axios = require("axios");

// ============ EXISTING FUNCTION - Calls Python AI Service ============
const analyzeEmotion = async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("AI Service Error:", error.message);
    
    // Fallback: If AI service is down, return dummy data
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.log("⚠️ AI Service not available, using fallback data");
      return res.json({
        success: true,
        data: {
          primary_emotion: 'Neutral',
          confidence: 50,
          all_emotions: {
            happy: 20,
            sad: 20,
            angry: 20,
            fear: 20,
            surprise: 20,
            neutral: 80
          },
          text: req.body.text || '',
          timestamp: new Date().toISOString(),
          note: 'AI service unavailable, using fallback'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: "AI Service Error",
      details: error.message
    });
  }
};

// ============ NEW FUNCTION 1: Get Emotion History ============
const getEmotionHistory = (req, res) => {
    try {
        // In production, fetch from database
        const history = [
            { 
                id: 1, 
                emotion: 'Happy', 
                confidence: 85, 
                timestamp: '2026-06-28T10:00:00',
                context: 'Positive interaction'
            },
            { 
                id: 2, 
                emotion: 'Sad', 
                confidence: 70, 
                timestamp: '2026-06-28T10:30:00',
                context: 'Reflective moment'
            },
            { 
                id: 3, 
                emotion: 'Neutral', 
                confidence: 90, 
                timestamp: '2026-06-28T11:00:00',
                context: 'Casual conversation'
            },
            { 
                id: 4, 
                emotion: 'Angry', 
                confidence: 75, 
                timestamp: '2026-06-28T11:30:00',
                context: 'Frustrating situation'
            },
            { 
                id: 5, 
                emotion: 'Happy', 
                confidence: 92, 
                timestamp: '2026-06-28T12:00:00',
                context: 'Good news received'
            },
            { 
                id: 6, 
                emotion: 'Fear', 
                confidence: 68, 
                timestamp: '2026-06-28T12:30:00',
                context: 'Anxiety trigger'
            },
            { 
                id: 7, 
                emotion: 'Surprise', 
                confidence: 80, 
                timestamp: '2026-06-28T13:00:00',
                context: 'Unexpected event'
            }
        ];

        return res.json({
            success: true,
            data: history,
            count: history.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ============ NEW FUNCTION 2: Get Emotion Statistics ============
const getEmotionStats = (req, res) => {
    try {
        const stats = {
            total_analyses: 245,
            average_confidence: 78,
            most_common_emotion: 'Happy',
            emotion_distribution: {
                happy: 85,
                sad: 45,
                angry: 30,
                fear: 25,
                surprise: 35,
                neutral: 25
            },
            daily_average: 12,
            weekly_trend: 'increasing'
        };

        return res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ============ NEW FUNCTION 3: Get Emotion Trends ============
const getEmotionTrends = (req, res) => {
    try {
        const { period = 'week' } = req.query;
        
        const trends = {
            week: [
                { date: '2026-06-22', happy: 20, sad: 12, angry: 8, fear: 6, surprise: 10, neutral: 8 },
                { date: '2026-06-23', happy: 22, sad: 15, angry: 10, fear: 8, surprise: 12, neutral: 10 },
                { date: '2026-06-24', happy: 25, sad: 18, angry: 12, fear: 10, surprise: 15, neutral: 12 },
                { date: '2026-06-25', happy: 30, sad: 20, angry: 15, fear: 12, surprise: 18, neutral: 15 },
                { date: '2026-06-26', happy: 35, sad: 22, angry: 18, fear: 15, surprise: 20, neutral: 18 },
                { date: '2026-06-27', happy: 40, sad: 25, angry: 20, fear: 18, surprise: 25, neutral: 20 },
                { date: '2026-06-28', happy: 45, sad: 28, angry: 22, fear: 20, surprise: 28, neutral: 22 }
            ],
            month: [
                { date: '2026-06-01', happy: 30, sad: 18, angry: 12, fear: 10, surprise: 15, neutral: 12 },
                { date: '2026-06-08', happy: 35, sad: 20, angry: 15, fear: 12, surprise: 18, neutral: 15 },
                { date: '2026-06-15', happy: 38, sad: 22, angry: 18, fear: 15, surprise: 20, neutral: 18 },
                { date: '2026-06-22', happy: 42, sad: 25, angry: 20, fear: 18, surprise: 25, neutral: 20 },
                { date: '2026-06-29', happy: 45, sad: 28, angry: 22, fear: 20, surprise: 28, neutral: 22 }
            ],
            year: [
                { date: '2026-01', happy: 25, sad: 20, angry: 15, fear: 12, surprise: 18, neutral: 15 },
                { date: '2026-02', happy: 28, sad: 22, angry: 18, fear: 14, surprise: 20, neutral: 18 },
                { date: '2026-03', happy: 30, sad: 24, angry: 20, fear: 16, surprise: 22, neutral: 20 },
                { date: '2026-04', happy: 32, sad: 26, angry: 22, fear: 18, surprise: 25, neutral: 22 },
                { date: '2026-05', happy: 35, sad: 28, angry: 25, fear: 20, surprise: 28, neutral: 25 },
                { date: '2026-06', happy: 40, sad: 30, angry: 28, fear: 22, surprise: 30, neutral: 28 }
            ]
        };

        return res.json({
            success: true,
            data: trends[period] || trends.week,
            period: period
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ============ EXPORT ALL FUNCTIONS ============
module.exports = {
    analyzeEmotion,      // Original - calls Python AI service
    getEmotionHistory,   // New
    getEmotionStats,     // New
    getEmotionTrends     // New
};