from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict_emotion():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        # Dummy emotion analysis (replace with your actual model)
        emotions = ['Happy', 'Sad', 'Angry', 'Fear', 'Surprise', 'Neutral']
        primary_emotion = random.choice(emotions)
        confidence = random.randint(65, 95)
        
        response = {
            'success': True,
            'data': {
                'primary_emotion': primary_emotion,
                'confidence': confidence,
                'all_emotions': {
                    'happy': random.randint(0, 100),
                    'sad': random.randint(0, 100),
                    'angry': random.randint(0, 100),
                    'fear': random.randint(0, 100),
                    'surprise': random.randint(0, 100),
                    'neutral': random.randint(0, 100)
                },
                'text': text,
                'timestamp': datetime.now().isoformat()
            }
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/personality', methods=['POST'])
def analyze_personality():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        traits = [
            {'name': 'Openness', 'score': random.randint(50, 95)},
            {'name': 'Conscientiousness', 'score': random.randint(50, 95)},
            {'name': 'Extraversion', 'score': random.randint(50, 95)},
            {'name': 'Agreeableness', 'score': random.randint(50, 95)},
            {'name': 'Neuroticism', 'score': random.randint(50, 95)}
        ]
        
        return jsonify({'success': True, 'data': traits})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'service': 'Emotion AI Python Service',
        'version': '1.0.0'
    })

@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'message': 'Emotion AI Python Service is running',
        'endpoints': {
            'predict': 'POST /predict',
            'personality': 'POST /personality',
            'health': 'GET /health'
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(debug=True, host='0.0.0.0', port=port)
