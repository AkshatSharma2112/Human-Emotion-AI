// backend/src/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();

// Dashboard routes (temporary - will be replaced with controllers)
router.get('/overview', (req, res) => {
    res.json({
        success: true,
        data: {
            emotions: {
                total: 156,
                breakdown: {
                    happy: 45,
                    sad: 28,
                    angry: 15,
                    fear: 20,
                    surprise: 30,
                    neutral: 18
                },
                trend: 'increasing'
            },
            personality: [
                { name: 'Openness', score: 78 },
                { name: 'Conscientiousness', score: 82 },
                { name: 'Extraversion', score: 65 },
                { name: 'Agreeableness', score: 70 },
                { name: 'Neuroticism', score: 45 }
            ],
            behavioral_score: 85,
            active_predictions: 12,
            last_updated: new Date().toISOString()
        }
    });
});

router.get('/emotions', (req, res) => {
    res.json({
        success: true,
        data: {
            history: [
                { date: '2026-06-25', happy: 25, sad: 15, angry: 10 },
                { date: '2026-06-26', happy: 30, sad: 12, angry: 8 },
                { date: '2026-06-27', happy: 28, sad: 18, angry: 12 }
            ],
            current: {
                total: 156,
                breakdown: {
                    happy: 45,
                    sad: 28,
                    angry: 15,
                    fear: 20,
                    surprise: 30,
                    neutral: 18
                }
            }
        }
    });
});

router.get('/behavioral', (req, res) => {
    res.json({
        success: true,
        data: {
            patterns: ['Active Listening', 'Empathetic Response', 'Analytical Thinking'],
            scores: {
                empathy: 82,
                clarity: 75,
                engagement: 88
            },
            recommendations: [
                'Practice active listening techniques',
                'Work on emotional vocabulary',
                'Engage in regular self-reflection'
            ]
        }
    });
});

module.exports = router;