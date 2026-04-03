// backend/utils/sentiment.js
const vader = require('vader-sentiment');

function analyzeSentiment(text) {
    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    // compound: -1 (most negative) to +1 (most positive)
    const compound = intensity.compound;
    let label = 'neutral';
    if (compound >= 0.05)  label = 'positive';
    if (compound <= -0.05) label = 'negative';
    if (compound <= -0.5)  label = 'distressed';
    return { score: compound, label, raw: intensity };
}

module.exports = { analyzeSentiment };