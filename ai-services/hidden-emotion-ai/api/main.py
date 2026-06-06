from fastapi import FastAPI
from transformers import pipeline

app = FastAPI()

# Load emotion detection model
classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=1
)

@app.get("/")
def home():
    return {
        "message": "Hidden Emotion AI Running"
    }

@app.post("/predict")
def predict(data: dict):
    text = data.get("text", "")

    result = classifier(text)

    return {
        "text": text,
        "emotion": result[0][0]["label"],
        "confidence": round(result[0][0]["score"], 4)
    }