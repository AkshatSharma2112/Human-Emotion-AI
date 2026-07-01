import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Face1 from "../assets/img2.png";

const ROLES = [
  { id: "student", label: "Student", icon: "🎓" },
  { id: "researcher", label: "Researcher", icon: "🔬" },
  { id: "doctor", label: "Doctor", icon: "🩺" },
  { id: "admin", label: "Admin", icon: "🛡️" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [role, setRole] = useState("student");
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      alert("Please fill all fields.");
      return;
    }

    if (form.password !== form.confirm) {
      alert("Passwords do not match.");
      return;
    }

    if (!agreed) {
      alert("Please accept the Terms & Conditions.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // 🔥 FIREBASE AUTH PROFILE MAIN NAME UPDATE LOGIC
      await updateProfile(userCredential.user, {
        displayName: form.name.trim()
      });

      // Firestore document writing
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: form.name,
        email: form.email,
        role: role,
        createdAt: new Date(),
      });

      alert("Account created successfully!");
      navigate("/login");

    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("Email already exists.");
          break;
        case "auth/invalid-email":
          alert("Invalid email.");
          break;
        case "auth/weak-password":
          alert("Password must be at least 6 characters.");
          break;
        default:
          alert(error.message);
      }
    }
  };

  return (
    <div style={styles.page}>
      {/* Left Column (Forms) */}
      <div style={styles.leftPanel}>
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>Create Account</h2>
          <p style={styles.formSub}>Join the Human Emotion AI System platform</p>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputRow}>
              <span style={styles.inputIcon}>👤</span>
              <input name="name" value={form.name} onChange={handle} placeholder="Enter full name" style={styles.input} type="text" />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputRow}>
              <span style={styles.inputIcon}>✉️</span>
              <input name="email" value={form.email} onChange={handle} placeholder="Enter email address" style={styles.input} type="email" />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputRow}>
              <span style={styles.inputIcon}>🔒</span>
              <input name="password" value={form.password} onChange={handle} placeholder="Minimum 6 characters" style={styles.input} type={showPass ? "text" : "password"} />
              <span onClick={() => setShowPass(!showPass)} style={styles.eyeIcon}>{showPass ? "🙈" : "👁️"}</span>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputRow}>
              <span style={styles.inputIcon}>🛡️</span>
              <input name="confirm" value={form.confirm} onChange={handle} placeholder="Repeat password" style={styles.input} type={showConfirm ? "text" : "password"} />
              <span onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeIcon}>{showConfirm ? "🙈" : "👁️"}</span>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Select Your Professional Role</label>
            <div style={styles.rolesGrid}>
              {ROLES.map((r) => (
                <div key={r.id} onClick={() => setRole(r.id)} style={{ ...styles.roleCard, ...(role === r.id ? styles.roleCardActive : {}) }}>
                  <span style={styles.roleIcon}>{r.icon}</span>
                  <span style={styles.roleLabel}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          <label style={styles.checkRow}>
            <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} style={styles.checkbox} />
            <span style={styles.agreeText}>I agree to the Terms of Service & Privacy Protocols</span>
          </label>

          <button style={styles.btnSignup} onClick={handleSignup}>Sign Up</button>

          <div style={styles.switchRow}>
            Already have an account? <span style={styles.switchLink} onClick={() => navigate("/login")}>Login</span>
          </div>
        </div>
      </div>

      {/* Right Column (Graphics Panel) */}
      <div style={styles.rightPanel}>
        <div style={styles.brandRow}>
          <span style={styles.brainIcon}>🧠</span>
          <div>
            <div style={styles.brandName}>EMOTION AI</div>
            <div style={styles.brandSub}>Human Emotion AI System</div>
          </div>
        </div>

        <div style={styles.faceArea}>
          <div style={styles.faceGlow} />
          <div style={{ position: "relative", width: 280, height: 280, borderRadius: "50%", overflow: "hidden" }}>
            <img src={Face1} alt="Biometric Vector" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: "#8b5cf6", boxShadow: "0 0 15px #8b5cf6", animation: "scan 3s ease-in-out infinite" }} />
          </div>
        </div>

        <div style={{ textAlign: "center", maxWidth: 360, marginTop: 40 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0" }}>Multi-Modal Analytical Pipeline</h3>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5 }}>Our deep learning architecture correlates voice energy textures with natural verbal signatures to cross-map affective behaviors.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif", color: "#1e293b" },
  leftPanel: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 30px" },
  formBox: { background: "white", borderRadius: 20, padding: "40px", width: "100%", maxWidth: 440, boxShadow: "0 10px 40px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
  formTitle: { fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4, textAlign: "center" },
  formSub: { color: "#64748b", fontSize: 13, textAlign: "center", marginBottom: 28 },
  fieldGroup: { marginBottom: 16 },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 },
  inputRow: { display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "0 12px", background: "#f8fafc" },
  inputIcon: { fontSize: 15, marginRight: 8, opacity: 0.45 },
  input: { flex: 1, border: "none", background: "transparent", outline: "none", padding: "11px 0", fontSize: 14, color: "#1e293b" },
  eyeIcon: { cursor: "pointer", fontSize: 15, opacity: 0.5, paddingLeft: 6 },
  rolesGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 },
  roleCard: { border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "12px 6px", textAlign: "center", cursor: "pointer", background: "#f8fafc" },
  roleCardActive: { borderColor: "#6366f1", background: "#eef2ff" },
  roleIcon: { fontSize: 20, display: "block", marginBottom: 4 },
  roleLabel: { fontSize: 11, fontWeight: 600, color: "#374151" },
  checkRow: { display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", marginBottom: 22, marginTop: 4 },
  checkbox: { accentColor: "#6366f1", width: 16, height: 16, marginTop: 2, flexShrink: 0 },
  agreeText: { fontSize: 12, color: "#64748b", lineHeight: 1.4 },
  btnSignup: { width: "100%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 10, padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 18, boxShadow: "0 4px 12px rgba(99,102,241,0.25)" },
  switchRow: { textAlign: "center", fontSize: 13, color: "#64748b" },
  switchLink: { color: "#6366f1", fontWeight: 700, cursor: "pointer" },
  rightPanel: { flex: 1, background: "linear-gradient(160deg,#060e1e 0%,#0a1628 100%)", color: "#e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 30px", position: "relative", overflow: "hidden" },
  brandRow: { position: "absolute", top: 28, left: 30, display: "flex", alignItems: "center", gap: 10 },
  brainIcon: { fontSize: 28 },
  brandName: { fontWeight: 800, fontSize: 17, letterSpacing: 1, color: "white" },
  brandSub: { fontSize: 10, color: "#475569", letterSpacing: 0.5 },
  faceArea: { position: "relative", margin: "20px 0" },
  faceGlow: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)" }
};