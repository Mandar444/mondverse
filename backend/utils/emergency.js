// backend/utils/emergency.js
const CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'self harm', 'hurt myself', 'no reason to live', 'can\'t go on'
];

function detectEmergency(text, sentimentScore, stressLevel) {
    const lower = text.toLowerCase();
    const hasKeyword = CRISIS_KEYWORDS.some(k => lower.includes(k));
    const isHighStress = stressLevel >= 80;
    const isVeryNegative = sentimentScore <= -0.7;

    if (hasKeyword) return { emergency: true, reason: 'crisis_keyword', priority: 'critical' };
    if (isHighStress && isVeryNegative) return { emergency: true, reason: 'combined_signal', priority: 'high' };
    return { emergency: false };
}

module.exports = { detectEmergency };