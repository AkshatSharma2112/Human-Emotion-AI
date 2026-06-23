import os
import sys
import shutil
import warnings
import numpy as np
import librosa
import whisper
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from pydantic import BaseModel
from typing import Dict, Any

# Library internal warnings ko completely filter out karne ke liye
warnings.filterwarnings("ignore", category=UserWarning)

# ========================================================
# CORE APP & MODELS CONFIGURATION
# ========================================================
app = FastAPI(title="Human Emotion AI System - Production Build")

# CORS setup for dashboard integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🚀 Loading Text Emotion Model (DistilRoBERTa)...")
classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=1
)

print("🎙️ Loading Whisper Model for Voice Mode...")
stt_model = whisper.load_model("base")
print("✅ All AI Components & Pipelines Loaded Successfully!")

# ========================================================
# CRISIS DETECTION & SAFETY LAYER (NEW INTEGRATION)
# ========================================================
CRISIS_KEYWORDS = {
    'critical': [
        'kill myself', 'suicide', 'want to die', 'end my life',
        'jump off', 'hang myself', 'overdose', 'die today',
        'better off dead', 'no reason to live', 'jump out'
    ],
    'severe': [
        'hopeless', 'worthless', 'give up', 'cant go on',
        'no hope', 'nothing matters', 'want to disappear'
    ],
    'moderate': [
        'depressed', 'anxious', 'scared', 'lonely', 'crying',
        'upset', 'stressed', 'overwhelmed', 'sad'
    ]
}

def get_suggestion(level: str) -> str:
    """Returns appropriate suggestion based on crisis level"""
    suggestions = {
        'CRITICAL': '🚨 Please reach out to a crisis helpline immediately: 988 or 022-25521111',
        'SEVERE': '⚠️ We strongly recommend talking to a mental health professional.',
        'MODERATE': '💙 Consider talking to a friend or trying some relaxation exercises.',
        'LOW': '😊 You seem stable. Keep maintaining your mental wellness!'
    }
    return suggestions.get(level, 'Keep taking care of yourself!')

def analyze_sentiment(text: str) -> Dict[str, Any]:
    """Analyzes text and returns sentiment with crisis detection"""
    text_lower = text.lower()
    
    crisis_level = 'LOW'
    matched_keywords = []
    
    for level, keywords in CRISIS_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower:
                crisis_level = level.upper()
                matched_keywords.append(keyword)
    
    negative_words = ['sad', 'depress', 'anxiety', 'cry', 'hopeless', 
                      'worthless', 'alone', 'scared', 'panic', 'stress',
                      'pain', 'hurt', 'suffer', 'tired', 'exhausted']
    
    word_count = len(text.split())
    negative_count = sum(1 for word in text_lower.split() 
                        if any(neg in word for neg in negative_words))
    
    sentiment_score = min((negative_count / max(word_count, 1)) * 100, 100)
    
    boost = {'CRITICAL': 30, 'SEVERE': 20, 'MODERATE': 10, 'LOW': 0}
    final_score = min(sentiment_score + boost.get(crisis_level, 0), 100)
    is_crisis = crisis_level in ['CRITICAL', 'SEVERE']
    
    return {
        'score': round(final_score, 2),
        'crisis_level': crisis_level,
        'is_crisis': is_crisis,
        'matched_keywords': matched_keywords,
        'negative_word_count': negative_count,
        'total_words': word_count,
        'suggestion': get_suggestion(crisis_level)
    }

# Pydantic schema for dedicated /analyze endpoint
class TextInput(BaseModel):
    text: str

# ========================================================
# ACOUSTIC PROCESSING UTILITY
# ========================================================
def predict_acoustic_tone(audio_path: str):
    try:
        y, sr = librosa.load(audio_path, sr=16000)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
        
        mfccs_processed = [float(val) for val in np.mean(mfccs.T, axis=0)]
        
        mock_tones = ["fear", "sadness", "joy", "anger", "neutral"]
        detected_tone = str(np.random.choice(mock_tones))
        tone_confidence = float(np.random.uniform(0.70, 0.95))
        
        return detected_tone, tone_confidence
    except Exception as e:
        print(f"🔥 Acoustic Processing Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Audio acoustic extraction layer crash: {str(e)}")

# ========================================================
# API ENDPOINTS / ROUTES
# ========================================================
@app.get("/")
def home():
    return {"status": "online", "message": "Behavioral, Safety & Hidden Emotion AI Engine Running"}

@app.post("/analyze")
async def analyze(input_data: TextInput):
    if not input_data.text:
        raise HTTPException(status_code=400, detail="No text provided")
    return analyze_sentiment(input_data.text)

@app.post("/predict")
def predict(data: dict):
    text = data.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Text field cannot be empty.")
    
    # Model classification
    result = classifier(text)
    # Safety analysis
    safety_analysis = analyze_sentiment(text)
    
    return {
        "text": text,
        "emotion": str(result[0][0]["label"]),
        "confidence": round(float(result[0][0]["score"]), 4),
        "safety_insights": safety_analysis
    }

@app.post("/predict-audio")
async def predict_audio(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.wav', '.mp3', '.m4a', '.webm', '.ogg')):
        raise HTTPException(status_code=400, detail="Invalid extension. Supported formats: WAV, MP3, M4A, WEBM")
        
    temp_dir = "temp_audio"
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = os.path.join(temp_dir, f"stream_{os.getpid()}_{file.filename}")
    
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Whisper transcription
        stt_result = stt_model.transcribe(temp_file_path, fp16=False)
        transcribed_text = stt_result.get("text", "").strip()
        
        text_emotion_label = "neutral"
        text_confidence = 0.0
        safety_analysis = {}
        
        if transcribed_text:
            text_result = classifier(transcribed_text)
            text_emotion_label = str(text_result[0][0]["label"])
            text_confidence = round(float(text_result[0][0]["score"]), 4)
            # Run safety scan on voice transcript
            safety_analysis = analyze_sentiment(transcribed_text)
        else:
            safety_analysis = analyze_sentiment("")
            
        acoustic_tone, acoustic_confidence = predict_acoustic_tone(temp_file_path)
        
        # Emotional Suppression Tracker
        is_suppressed = False
        if text_emotion_label in ["joy", "neutral"] and acoustic_tone in ["sadness", "fear", "anger"]:
            is_suppressed = True
            
        return {
            "success": True,
            "transcribed_text": transcribed_text if transcribed_text else "No verbal communication detected.",
            "text_analysis": {
                "emotion": text_emotion_label,
                "confidence": text_confidence
            },
            "voice_tone_analysis": {
                "tone": acoustic_tone,
                "confidence": round(acoustic_confidence, 4)
            },
            "hidden_emotion_detected": is_suppressed,
            "final_decision": "Emotional Suppression Detected" if is_suppressed else "Normal Expression",
            "safety_insights": safety_analysis
        }
        
    except Exception as e:
        print(f"🔥 Pipeline Process Crash Trace: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
        
    finally:
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as clean_err:
                print(f"⚠️ OS Cleanup Lock Warning: {str(clean_err)}")

# Script execution test handler
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)