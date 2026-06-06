const express = require("express");
const router = express.Router();

const {
  analyzeEmotion,
} = require("../controllers/emotion.controller");

router.post("/analyze", analyzeEmotion);

module.exports = router;