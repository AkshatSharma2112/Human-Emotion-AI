import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/img1.png"; // Aapki uploaded face image file

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emojis, setEmojis] = useState([]);

  // Check login session status
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsLoggedIn(true);
  }, []);

  // Emojis popping tracking mechanism
  useEffect(() => {
    const emojiPool = ["😊", "😢", "😡", "😱", "🤔", "😎", "🥺", "🎭", "🔥"];
    const interval = setInterval(() => {
      const newEmojis = Array.from({ length: 2 }).map(() => ({
        id: Math.random(),
        text: emojiPool[Math.floor(Math.random() * emojiPool.length)],
        top: Math.floor(Math.random() * 60) + 20, 
        left: Math.random() > 0.5 ? Math.floor(Math.random() * 12) - 8 : Math.floor(Math.random() * 12) + 95, 
      }));

      setEmojis((prev) => [...prev, ...newEmojis]);

      setTimeout(() => {
        setEmojis((prev) => prev.filter((e) => !newEmojis.some((ne) => ne.id === e.id)));
      }, 1500);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: "#030712", color: "#ffffff", minHeight: "100vh", fontFamily: "'Inter', sans-serif", position: "relative", overflowX: "hidden" }}>
      
      {/* 🔮 Embedded Animation Matrix */}
      <style>{`
        @keyframes scanMove {
          0% { top: 2%; opacity: 0.5; }
          50% { top: 98%; opacity: 1; filter: drop-shadow(0 0 12px #06b6d4); }
          100% { top: 2%; opacity: 0.5; }
        }
        @keyframes emojiPop {
          0% { transform: scale(0) translateY(0); opacity: 0; }
          45% { transform: scale(1.3) translateY(-15px); opacity: 1; }
          100% { transform: scale(1) translateY(-35px); opacity: 0; }
        }
      `}</style>

      {/* 🌐 TOP NAVIGATION NAVBAR */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 80px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}></div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "16px", letterSpacing: "1px" }}>EMOTION AI</div>
            <div style={{ fontSize: "10px", color: "#6b7280" }}>Human Emotion AI System</div>
          </div>
        </div>
        
        <nav style={{ display: "flex", gap: "30px", fontSize: "14px", color: "#9ca3af" }}>
          {["Home", "About", "Features", "How It Works", "Pricing", "Contact"].map((item) => (
            <span key={item} style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "#fff"} onMouseLeave={(e) => e.target.style.color = "#9ca3af"}>{item}</span>
          ))}
        </nav>

        <button 
          onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")} 
          style={{ padding: "10px 22px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(139,92,246,0.3)" }}
        >
          {isLoggedIn ? "Dashboard" : "Get Started"}
        </button>
      </header>

      {/* 🚀 MAIN HERO CONTENT PLATFORM */}
      <main style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "60px 80px 100px 80px", maxWidth: "1400px", margin: "0 auto", position: "relative" }}>
        
        {/* Left Informational Column */}
        <div style={{ flex: 1, zIndex: 2, textAlign: "left" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", color: "#60a5fa", marginBottom: "25px", fontWeight: "600" }}>
            🤖 AI POWERED EMOTION ANALYSIS
          </div>
          <h1 style={{ fontSize: "4.5rem", fontWeight: "800", lineHeight: "1.1", marginBottom: "25px", letterSpacing: "-1px" }}>
            Human Emotion <br />
            <span style={{ background: "linear-gradient(to right, #3b82f6, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI System</span>
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#9ca3af", maxWidth: "540px", marginBottom: "40px", lineHeight: "1.6" }}>
            Detect, analyze and understand human emotions through advanced artificial intelligence multi-modal speech analytics.
          </p>
          <div style={{ display: "flex", gap: "15px" }}>
            <button onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")} style={{ padding: "14px 32px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", boxShadow: "0 4px 20px rgba(59,130,246,0.4)" }}>
              Get Started
            </button>
            <button style={{ padding: "14px 32px", backgroundColor: "rgba(255,255,255,0.03)", color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
              ▶ Watch Demo
            </button>
          </div>
        </div>

        {/* Right Animated Scan Box Panel Column */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative", minHeight: "500px" }}>
          
          {/* Glassmorphic Scanner Outer Boundary Box */}
          <div style={{ position: "relative", width: "450px", height: "450px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(11,19,41,0.25)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.06)", padding: "16px", overflow: "visible" }}>
            
            {/* Core Box Container holding Head Contain Framework */}
            <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: "16px", background: "rgba(3,7,18,0.4)" }}>
              
              <img 
                src={img1} 
                alt="AI Cybernetic Matrix Face Scan View" 
                style={{ width: "95%", height: "95%", objectFit: "contain", opacity: 0.95 }}
              />

              {/* 🟢 SCANNING LINE (BOUNDED ADJUSTED TO COMPACT HEAD SIZE) */}
              <div style={{
                position: "absolute",
                left: 0,
                width: "100%",
                height: "4px",
                background: "linear-gradient(90deg, transparent, #06b6d4, #d946ef, #06b6d4, transparent)",
                boxShadow: "0 0 16px #06b6d4, 0 0 32px #d946ef",
                zIndex: 5,
                animation: "scanMove 3.5s infinite ease-in-out"
              }} />
            </div>

            {/* 💥 POPPING EM0JIS INDEX MAPPED ON EDGES */}
            {emojis.map((emoji) => (
              <div
                key={emoji.id}
                style={{
                  position: "absolute",
                  top: `${emoji.top}%`,
                  left: `${emoji.left}%`,
                  fontSize: "2.4rem",
                  pointerEvents: "none",
                  zIndex: 10,
                  animation: "emojiPop 1.5s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                }}
              >
                {emoji.text}
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}