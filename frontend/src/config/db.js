// src/config/db.js
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where
} from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVnQQu_w4oogKjDiwN9Ob7yafWmoTqb3I",
  authDomain: "behavioral-intelligence-ai.firebaseapp.com",
  projectId: "behavioral-intelligence-ai",
  storageBucket: "behavioral-intelligence-ai.firebasestorage.app",
  messagingSenderId: "1264804272",
  appId: "1:1264804272:web:c24d1000cea34e30187675",
  measurementId: "G-JSBQR6YLFB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save emotion analysis
export async function saveAnalysis(userId, text, emotion, confidence) {
  try {
    const docRef = await addDoc(collection(db, "emotion_analyses"), {
      userId: userId,
      text: text,
      emotion: emotion,
      confidence: confidence,
      timestamp: new Date().toISOString(),
      wordCount: text.split(' ').length
    });
    console.log("✅ Analysis saved:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error saving analysis:", error);
    throw error;
  }
}

// Get last 7 days analyses - SIMPLE VERSION (NO INDEX NEEDED)
export async function getLast7DaysAnalyses(userId) {
  // Get all analyses for this user
  const q = query(
    collection(db, "emotion_analyses"),
    where("userId", "==", userId)
  );
  
  const snapshot = await getDocs(q);
  const analyses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Sort by timestamp (newest first)
  const sorted = analyses.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Filter last 7 days in JavaScript
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const last7Days = sorted.filter(a => new Date(a.timestamp) >= sevenDaysAgo);
  
  return last7Days;
}

export { db };