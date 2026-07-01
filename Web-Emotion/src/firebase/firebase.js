import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCe-mvk3QmgiDOFq37ArEqb1a-PHbd0SEs",
  authDomain: "human-emotion-ai.firebaseapp.com",
  projectId: "human-emotion-ai",
  storageBucket: "human-emotion-ai.firebasestorage.app",
  messagingSenderId: "368411827602",
  appId: "1:368411827602:web:2550e94a83e523ada9754b",
  measurementId: "G-9QW68KXWMB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);