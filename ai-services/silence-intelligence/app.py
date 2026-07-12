from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_silence():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        silence_score = random.randint(0, 100)
        risk_level = 'Low' if silence_score < 30 else 'Medium' if silence_score < 60 else 'High'
        
        return jsonify({
            'success': True,
            'data': {
                'silence_score': silence_score,
                'risk_level': risk_level,
                'message_count_change': random.randint(0, 50),
                'message_length_change': random.randint(0, 50),
                'emotion_variation_change': random.randint(0, 5),
                'topic_avoidance_score': random.randint(0, 100),
                'response_gap_score': random.randint(0, 100),
                'hours_since_last_response': round(random.uniform(0, 24), 1),
                'writing_style_change': random.randint(0, 10),
                'timestamp': datetime.now().isoformat()
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/metrics', methods=['GET'])
def get_metrics():
    return jsonify({
        'success': True,
        'data': {
            'silence_score': random.randint(0, 100),
            'risk_level': 'Low',
            'topic_avoidance': {
                'score': random.randint(0, 100),
                'level': 'Low',
                'topics': ['money', 'exam', 'work', 'relationship']
            },
            'response_gap': {
                'score': random.randint(0, 100),
                'level': 'Low',
                'trend': 'Stable'
            },
            'writing_style': {
                'sentence_length': random.randint(5, 15),
                'punctuation': {'!': 0, '?': 0},
                'emojis_used': 0,
                'style_score': random.randint(0, 100)
            }
        }
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'service': 'Silence Intelligence', 'port': 8002})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8002)
