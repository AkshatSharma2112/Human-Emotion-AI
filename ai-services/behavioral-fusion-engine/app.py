from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/fusion', methods=['POST'])
def calculate_fusion():
    try:
        data = request.get_json()
        
        emotion_ai = data.get('emotion_ai', random.randint(60, 95))
        hidden_emotions = data.get('hidden_emotions', random.randint(60, 95))
        silence_intelligence = data.get('silence_intelligence', random.randint(60, 95))
        personality_evolution = data.get('personality_evolution', random.randint(60, 95))
        
        final_score = (
            emotion_ai * 0.25 +
            hidden_emotions * 0.15 +
            silence_intelligence * 0.30 +
            personality_evolution * 0.30
        )
        
        level = 'Excellence' if final_score >= 80 else 'Good' if final_score >= 60 else 'Average'
        
        return jsonify({
            'success': True,
            'data': {
                'final_score': round(final_score, 2),
                'level': level,
                'components': {
                    'emotion_ai': emotion_ai,
                    'hidden_emotions': hidden_emotions,
                    'silence_intelligence': silence_intelligence,
                    'personality_evolution': personality_evolution
                },
                'weights': {
                    'emotion_ai': 0.25,
                    'hidden_emotions': 0.15,
                    'silence_intelligence': 0.30,
                    'personality_evolution': 0.30
                },
                'message': 'Your behavioral intelligence is outstanding! Continue your self-awareness practices.',
                'timestamp': datetime.now().isoformat()
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'service': 'Behavioral Fusion Engine', 'port': 8004})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8004)
