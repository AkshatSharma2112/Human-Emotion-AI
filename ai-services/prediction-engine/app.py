from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Handle empty or invalid data
        if not data:
            data = {}
        
        text = data.get('text', 'No text provided')
        
        burnout_risk = random.randint(0, 100)
        
        # Generate recommendations based on risk
        if burnout_risk < 30:
            recommendations = 'Your stress levels are well managed. Keep up the good work!'
        elif burnout_risk < 60:
            recommendations = 'Monitor your stress levels. Practice mindfulness, maintain work-life balance.'
        else:
            recommendations = 'High stress detected. Consider taking a break, talking to someone, and practicing relaxation techniques.'
        
        response_data = {
            'success': True,
            'data': {
                'burnout_risk': burnout_risk,
                'leadership_score': random.randint(0, 100),
                'stress_forecast': random.randint(0, 100),
                'collaboration_score': random.randint(0, 100),
                'recommendations': recommendations,
                'risk_factors': [
                    'Deteriorating writing style' if random.random() > 0.5 else 'Stable writing style',
                    'Increased silence' if random.random() > 0.5 else 'Normal engagement',
                    'Topic avoidance' if random.random() > 0.5 else 'Open communication'
                ],
                'prevention_tips': [
                    'Maintain work-life balance',
                    'Stay connected with colleagues',
                    'Take short walks',
                    'Practice mindfulness'
                ],
                'next_weeks': '2-4 weeks',
                'text_analyzed': text,
                'timestamp': datetime.now().isoformat()
            }
        }
        
        return jsonify(response_data)
    except Exception as e:
        return jsonify({
            'success': False, 
            'error': str(e),
            'message': 'Error processing prediction request'
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'service': 'Prediction Engine', 'port': 8005})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8005)
