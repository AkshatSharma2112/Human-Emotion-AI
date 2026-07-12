# backend/api_gateway.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import random
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])
socketio = SocketIO(app, cors_allowed_origins="*")

# ============ DUMMY DATA FOR TESTING ============
def generate_dummy_emotions():
    emotions = ['Happy', 'Sad', 'Angry', 'Fear', 'Surprise', 'Neutral']
    return {
        'total': random.randint(50, 200),
        'breakdown': {
            emotion: random.randint(5, 30) for emotion in emotions
        },
        'trend': 'increasing' if random.random() > 0.5 else 'decreasing'
    }

def generate_dummy_personality():
    traits = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']
    return [
        {'name': trait, 'score': random.randint(50, 95)} for trait in traits
    ]

# ============ API ROUTES ============

# Dashboard Routes
@app.route('/api/dashboard/overview', methods=['GET'])
def get_dashboard_overview():
    return jsonify({
        'success': True,
        'data': {
            'emotions': generate_dummy_emotions(),
            'personality': generate_dummy_personality(),
            'behavioral_score': random.randint(60, 90),
            'active_predictions': random.randint(5, 20),
            'last_updated': datetime.now().isoformat()
        }
    })

@app.route('/api/dashboard/emotions', methods=['GET'])
def get_emotion_data():
    return jsonify({
        'success': True,
        'data': {
            'history': [
                {'date': '2026-06-25', 'happy': 25, 'sad': 15, 'angry': 10},
                {'date': '2026-06-26', 'happy': 30, 'sad': 12, 'angry': 8},
                {'date': '2026-06-27', 'happy': 28, 'sad': 18, 'angry': 12}
            ],
            'current': generate_dummy_emotions()
        }
    })

# Personality Routes
@app.route('/api/personality/traits', methods=['GET'])
def get_personality_traits():
    return jsonify({
        'success': True,
        'data': generate_dummy_personality()
    })

@app.route('/api/personality/assess', methods=['POST'])
def assess_personality():
    data = request.json
    responses = data.get('responses', {})
    
    # Calculate scores (dummy logic)
    scores = {
        'Openness': random.randint(50, 95),
        'Conscientiousness': random.randint(50, 95),
        'Extraversion': random.randint(50, 95),
        'Agreeableness': random.randint(50, 95),
        'Neuroticism': random.randint(50, 95)
    }
    
    return jsonify({
        'success': True,
        'data': scores,
        'message': 'Personality assessment completed'
    })

# Emotion Analysis Routes
@app.route('/api/emotions/analyze', methods=['POST'])
def analyze_emotion():
    data = request.json
    text = data.get('text', '')
    
    # Dummy emotion analysis
    emotions = ['Happy', 'Sad', 'Angry', 'Fear', 'Surprise', 'Neutral']
    primary_emotion = random.choice(emotions)
    
    return jsonify({
        'success': True,
        'data': {
            'primary_emotion': primary_emotion,
            'confidence': random.randint(60, 95),
            'all_emotions': {
                emotion: random.randint(0, 100) for emotion in emotions
            },
            'text': text
        }
    })

# Authentication Routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if email and password:
        return jsonify({
            'success': True,
            'token': 'dummy_token_' + str(random.randint(1000, 9999)),
            'user': {
                'email': email,
                'name': email.split('@')[0],
                'id': random.randint(1, 1000)
            }
        })
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name', '')
    
    if email and password:
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'user': {
                'email': email,
                'name': name or email.split('@')[0]
            }
        })
    return jsonify({'success': False, 'error': 'Missing required fields'}), 400

# WebSocket Events
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('connection_status', {'status': 'Connected to Emotion AI Server'})

@socketio.on('request_realtime_data')
def handle_realtime_request():
    emit('realtime_update', {
        'timestamp': datetime.now().isoformat(),
        'emotions': generate_dummy_emotions(),
        'personality': generate_dummy_personality()
    })

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)