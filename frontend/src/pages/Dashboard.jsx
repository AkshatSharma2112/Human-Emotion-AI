import { useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const analyze = async () => {
    const response = await api.post("/analyze", {
      text,
    });

    setResult(response.data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Behavioral Intelligence Dashboard</h1>

      <textarea
        rows="5"
        cols="50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text..."
      />

      <br />
      <br />

      <button onClick={analyze}>
        Analyze Emotion
      </button>

      {result && (
        <div>
          <h2>Result</h2>
          <p>Emotion: {result.emotion}</p>
          <p>Confidence: {result.confidence}</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;