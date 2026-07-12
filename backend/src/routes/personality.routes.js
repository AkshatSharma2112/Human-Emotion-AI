// backend/src/routes/personality.routes.js
const express = require('express');
const router = express.Router();

// Get personality traits
router.get('/traits', (req, res) => {
    res.json({
        success: true,
        data: [
            { 
                name: 'Openness', 
                score: 78, 
                description: 'Curious and open to new experiences',
                characteristics: ['Creative', 'Adventurous', 'Intellectual']
            },
            { 
                name: 'Conscientiousness', 
                score: 82, 
                description: 'Organized and goal-oriented',
                characteristics: ['Disciplined', 'Reliable', 'Ambitious']
            },
            { 
                name: 'Extraversion', 
                score: 65, 
                description: 'Social and outgoing',
                characteristics: ['Energetic', 'Friendly', 'Assertive']
            },
            { 
                name: 'Agreeableness', 
                score: 70, 
                description: 'Cooperative and compassionate',
                characteristics: ['Empathetic', 'Trustworthy', 'Kind']
            },
            { 
                name: 'Neuroticism', 
                score: 45, 
                description: 'Emotionally stable',
                characteristics: ['Calm', 'Resilient', 'Balanced']
            }
        ]
    });
});

// Assess personality
router.post('/assess', (req, res) => {
    const { responses } = req.body;
    
    if (!responses) {
        return res.status(400).json({
            success: false,
            error: 'Responses are required'
        });
    }
    
    // Calculate scores based on responses
    const scores = {
        Openness: calculateScore(responses, 'openness'),
        Conscientiousness: calculateScore(responses, 'conscientiousness'),
        Extraversion: calculateScore(responses, 'extraversion'),
        Agreeableness: calculateScore(responses, 'agreeableness'),
        Neuroticism: calculateScore(responses, 'neuroticism')
    };
    
    res.json({
        success: true,
        data: scores,
        message: 'Personality assessment completed',
        timestamp: new Date().toISOString()
    });
});

// Helper function
function calculateScore(responses, trait) {
    const weights = {
        openness: [0.3, 0.2, 0.3, 0.2],
        conscientiousness: [0.25, 0.25, 0.25, 0.25],
        extraversion: [0.4, 0.2, 0.2, 0.2],
        agreeableness: [0.2, 0.3, 0.3, 0.2],
        neuroticism: [0.3, 0.3, 0.2, 0.2]
    };
    
    let score = 0;
    const traitResponses = responses[trait] || [3, 3, 3, 3];
    const weight = weights[trait] || [0.25, 0.25, 0.25, 0.25];
    
    traitResponses.forEach((response, index) => {
        score += (response / 5) * (weight[index] || 0.25) * 100;
    });
    
    return Math.min(Math.round(score), 100);
}

module.exports = router;