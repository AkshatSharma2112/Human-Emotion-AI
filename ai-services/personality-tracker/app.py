from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/traits', methods=['GET'])
def get_traits():
    return jsonify({
        'success': True,
        'data': [
            {'name': 'Openness', 'score': random.randint(50, 95), 'description': 'Curious and open to new experiences'},
            {'name': 'Conscientiousness', 'score': random.randint(50, 95), 'description': 'Organized and goal-oriented'},
            {'name': 'Extraversion', 'score': random.randint(50, 95), 'description': 'Social and outgoing'},
            {'name': 'Agreeableness', 'score': random.randint(50, 95), 'description': 'Cooperative and compassionate'},
            {'name': 'Neuroticism', 'score': random.randint(50, 95), 'description': 'Emotionally stable'}
        ],
        'timestamp': datetime.now().isoformat()
    })

@app.route('/assess', methods=['POST'])
def assess_personality():
    try:
        data = request.get_json()
        responses = data.get('responses', {})
        
        return jsonify({
            'success': True,
            'data': {
                'Openness': random.randint(50, 95),
                'Conscientiousness': random.randint(50, 95),
                'Extraversion': random.randint(50, 95),
                'Agreeableness': random.randint(50, 95),
                'Neuroticism': random.randint(50, 95)
            },
            'message': 'Personality assessment completed',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'service': 'Personality Tracker', 'port': 8001})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8001)
