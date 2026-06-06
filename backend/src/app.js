const express = require("express");
const cors = require("cors");

const emotionRoutes = require("./routes/emotion.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend Running" });
});

app.use("/api", emotionRoutes);

module.exports = app;