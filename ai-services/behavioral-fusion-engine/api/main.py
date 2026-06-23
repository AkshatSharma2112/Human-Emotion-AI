from typing import Dict, Any

def analyze_behavior(
    message_count_change: float,
    message_length_change: float,
    response_gap: float,
    topic_avoidance: float
) -> Dict[str, Any]:
    """
    Returns behavioral analysis with risk score
    """
    # Your existing logic here
    
    # NEW: Calculate behavioral risk (0-100)
    risk_score = 0
    
    # Big drop in message length = distress
    if message_length_change < -50:  # 50% drop
        risk_score += 30
    elif message_length_change < -20:
        risk_score += 15
    
    # Big increase in response gap = withdrawal
    if response_gap > 4:  # hours
        risk_score += 25
    elif response_gap > 2:
        risk_score += 10
    
    # High topic avoidance = hiding issues
    if topic_avoidance > 70:
        risk_score += 30
    elif topic_avoidance > 40:
        risk_score += 15
    
    # Message count drop = social withdrawal
    if message_count_change < -20:
        risk_score += 15
    
    return {
        # Your existing metrics
        'message_count_change': message_count_change,
        'message_length_change': message_length_change,
        'response_gap': response_gap,
        'topic_avoidance': topic_avoidance,
        # NEW:
        'behavioral_risk_score': min(risk_score, 100)
    }