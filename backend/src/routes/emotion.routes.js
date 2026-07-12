// backend/src/routes/emotion.routes.js
const express = require("express");
const router = express.Router();

const {
  analyzeEmotion,
  getEmotionHistory,
  getEmotionStats,
  getEmotionTrends
} = require("../controllers/emotion.controller");

// Existing route - keep as is
router.post("/analyze", analyzeEmotion);

// New routes - add these
router.get("/history", getEmotionHistory);
router.get("/stats", getEmotionStats);
router.get("/trends", getEmotionTrends);

module.exports = router;