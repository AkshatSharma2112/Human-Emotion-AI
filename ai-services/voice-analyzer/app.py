from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_voice():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        emotions = ['Happy', 'Sad', 'Angry', 'Fear', 'Surprise', 'Neutral']
        primary_emotion = random.choice(emotions)
        confidence = random.randint(65, 95)
        
        return jsonify({
            'success': True,
            'data': {
                'primary_emotion': primary_emotion,
                'confidence': confidence,
                'tone': 'Positive' if primary_emotion in ['Happy', 'Surprise'] else 'Negative' if primary_emotion in ['Sad', 'Angry', 'Fear'] else 'Neutral',
                'stress_level': random.randint(0, 100),
                'pitch': random.randint(80, 200),
                'speech_rate': random.randint(100, 200),
                'voice_quality': random.choice(['Clear', 'Rough', 'Soft', 'Loud']),
                'silence_score': random.randint(0, 100),
                'risk_level': 'Low' if random.random() > 0.5 else 'Medium',
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
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'service': 'Voice Analyzer', 'port': 8003})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8003)
