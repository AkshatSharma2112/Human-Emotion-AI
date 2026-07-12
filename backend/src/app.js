// backend/src/app.js
const express = require("express");
const cors = require("cors");

// Import routes
const emotionRoutes = require("./routes/emotion.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const personalityRoutes = require("./routes/personality.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ ROOT ROUTE ============
app.get("/", (req, res) => {
    res.json({ 
        message: "Emotion AI Backend Running",
        version: "1.0.0",
        endpoints: {
            emotion: {
                analyze: "POST /api/analyze",
                history: "GET /api/history",
                stats: "GET /api/stats",
                trends: "GET /api/trends?period=week"
            },
            dashboard: {
                overview: "GET /api/dashboard/overview",
                emotions: "GET /api/dashboard/emotions",
                behavioral: "GET /api/dashboard/behavioral"
            },
            personality: {
                traits: "GET /api/personality/traits",
                assess: "POST /api/personality/assess"
            },
            auth: {
                login: "POST /api/auth/login",
                register: "POST /api/auth/register",
                verify: "POST /api/auth/verify",
                logout: "POST /api/auth/logout"
            }
        }
    });
});

// ============ HEALTH CHECK ============
app.get("/health", (req, res) => {
    res.json({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ============ API ROUTES ============
app.use("/api", emotionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/personality", personalityRoutes);
app.use("/api/auth", authRoutes);

// ============ 404 HANDLER ============
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
        path: req.originalUrl
    });
});

// ============ ERROR HANDLING MIDDLEWARE ============
app.use((err, req, res, next) => {
    console.error("Error:", err.stack);
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized access'
        });
    }
    
    if (err.code === 'ECONNREFUSED') {
        return res.status(503).json({
            success: false,
            error: 'Service unavailable',
            details: 'AI service is not responding'
        });
    }
    
    // Default error
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
});

module.exports = app;