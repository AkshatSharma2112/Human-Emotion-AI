const axios = require("axios");

const analyzeEmotion = async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      req.body
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI Service Error",
    });
  }
};

module.exports = {
  analyzeEmotion,
};