import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/img1.png"; // Core scanner target asset
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 📧 Email & Password Login Handler
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      alert("Login successful! Welcome back.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🌐 Google Authentication Login Handler
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("user", JSON.stringify(result.user));
      alert(`Welcome ${result.user.displayName || "User"}! Google Sign-In successful.`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#030712", color: "#ffffff", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", overflow: "hidden", position: "relative" }}>
      
      {/* 🔮 SCI-FI CYBERPUNK CSS KEYFRAMES INJECTION */}
      <style>{`
        @keyframes scanMove {
          0% { top: 2%; opacity: 0.5; }
          50% { top: 98%; opacity: 1; filter: drop-shadow(0 0 12px #06b6d4); }
          100% { top: 2%; opacity: 0.5; }
        }
        @keyframes bgPulse {
          0% { transform: scale(1) translate(0px, 0px); opacity: 0.2; }
          50% { transform: scale(1.2) translate(30px, -20px); opacity: 0.4; filter: blur(60px); }
          100% { transform: scale(1) translate(0px, 0px); opacity: 0.2; }
        }
        @keyframes floatParticles {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {/* Dynamic Floating Ambient Background Orbs */}
      <div style={{ position: "absolute", width: "400px", height: "400px", background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", top: "-10%", left: "-10%", borderRadius: "50%", zIndex: 0, animation: "bgPulse 8s infinite alternate" }} />
      <div style={{ position: "absolute", width: "400px", height: "400px", background: "radial-gradient(circle, #ec4899 0%, transparent 70%)", bottom: "-10%", right: "-10%", borderRadius: "50%", zIndex: 0, animation: "bgPulse 10s infinite alternate-reverse" }} />

      {/* 📦 SPLIT SCREEN CORE CONTAINER */}
      <div style={{ display: "flex", width: "1100px", height: "680px", background: "rgba(11, 19, 41, 0.3)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.6)", backdropFilter: "blur(16px)", zIndex: 1 }}>
        
        {/* 📑 LEFT SIDE: THE PREMIUM FORM CONTAINER */}
        <div style={{ flex: 1.1, padding: "40px 60px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "left", position: "relative" }}>
          
          {/* Top Logo Metric */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px", cursor: "pointer" }} onClick={() => navigate("/")}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}></div>
            <span style={{ fontWeight: "800", fontSize: "14px", letterSpacing: "1px" }}>EMOTION AI</span>
          </div>

          <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" }}>Welcome Back</h2>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "25px" }}>Enter your credentials to re-access the matrix telemetry.</p>

          {/* Email Input */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={form.email}
              onChange={handle}
              placeholder="name@company.com" 
              style={{ width: "100%", padding: "14px 16px", backgroundColor: "rgba(3, 7, 18, 0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#ffffff", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showPass ? "text" : "password"} 
                name="password"
                value={form.password}
                onChange={handle}
                placeholder="••••••••" 
                style={{ width: "100%", padding: "14px 50px 14px 16px", backgroundColor: "rgba(3, 7, 18, 0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#ffffff", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
              <span 
                onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6b7280", fontSize: "12px", fontWeight: "700", userSelect: "none" }}
              >
                {showPass ? "HIDE" : "SHOW"}
              </span>
            </div>
          </div>

          {/* Core Submit Sign In Button */}
          <button 
            onClick={handleLogin}
            disabled={loading}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 15px rgba(139,92,246,0.3)", marginBottom: "16px", transition: "opacity 0.2s" }}
            onMouseEnter={(e) => e.target.style.opacity = "0.9"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            {loading ? "Signing in..." : "Sign In Securely 🔒"}
          </button>

          {/* 🔘 OR SEPARATOR */}
          <div style={{ display: "flex", alignItems: "center", margin: "10px 0 20px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }} />
            <span style={{ padding: "0 15px", color: "#6b7280", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>or context split</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* 🌐 NEW: GOOGLE BRANDED SIGN IN BUTTON */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{ width: "100%", padding: "12px 14px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#ffffff", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "25px", transition: "background-color 0.2s" }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.08)"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.03)"}
          >
            {/* Standard SVG Vector Google G Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.258-3.134C18.417.915 15.54 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.854 11.57-11.77 0-.79-.085-1.393-.19-1.945H12.24z"/>
            </svg>
            Continue with Google Platform
          </button>

          {/* Footer Router Navigation Switch */}
          <p style={{ fontSize: "14px", color: "#9ca3af", textAlign: "center", margin: 0 }}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")} style={{ color: "#60a5fa", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}>
              Create an account
            </span>
          </p>
        </div>

        {/* 🖼️ RIGHT SIDE: ACTIVE SCANNING RADAR WITH FLOATING PARTICLES */}
        <div style={{ flex: 0.9, backgroundColor: "rgba(3, 7, 18, 0.4)", borderLeft: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px", position: "relative", overflow: "hidden" }}>
          
          {/* Generate CSS Custom Spark Elements for Animation Effect */}
          {[...Array(6)].map((_, idx) => (
            <div 
              key={idx} 
              style={{
                position: "absolute",
                width: `${Math.random() * 6 + 4}px`,
                height: `${Math.random() * 6 + 4}px`,
                background: idx % 2 === 0 ? "#06b6d4" : "#d946ef",
                borderRadius: "50%",
                bottom: "10%",
                left: `${20 + idx * 12}%`,
                animation: `floatParticles ${2 + Math.random() * 3}s infinite linear`,
                animationDelay: `${idx * 0.4}s`
              }} 
            />
          ))}

          {/* Glassmorphic Container holding the Contain Box Matrix Head */}
          <div style={{ position: "relative", width: "360px", height: "360px", background: "rgba(11, 19, 41, 0.25)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
            
            <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(3, 7, 18, 0.35)" }}>
              
              <img 
                src={img1} 
                alt="AI Cyber Face Authentication Framework" 
                style={{ width: "95%", height: "95%", objectFit: "contain", opacity: 0.9 }}
              />

              {/* Bounded Laser Line Scanning Overlay */}
              <div style={{
                position: "absolute",
                left: 0,
                width: "100%",
                height: "4px",
                background: "linear-gradient(90deg, transparent, #06b6d4, #d946ef, #06b6d4, transparent)",
                boxShadow: "0 0 14px #06b6d4, 0 0 28px #d946ef",
                zIndex: 5,
                animation: "scanMove 3.8s infinite ease-in-out"
              }} />

              {/* Status Indicator */}
              
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}