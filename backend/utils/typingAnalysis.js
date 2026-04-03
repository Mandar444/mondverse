// backend/utils/typingAnalysis.js
// Call this from the frontend — send { wpm, pauseCount, deleteCount, totalTime }
function analyzeTyping({ wpm, pauseCount, deleteCount, totalTime }) {
    let anxietyScore = 0;
    if (wpm > 80)         anxietyScore += 20;  // typing fast = anxious
    if (pauseCount > 5)   anxietyScore += 15;  // many pauses = hesitant
    if (deleteCount > 10) anxietyScore += 15;  // lots of deletes = uncertain
    if (wpm < 20)         anxietyScore += 10;  // very slow = low energy/depressed
    return {
        anxietyScore: Math.min(anxietyScore, 100),
        pattern: anxietyScore > 40 ? 'anxious' : anxietyScore > 20 ? 'unsettled' : 'calm'
    };
}

module.exports = { analyzeTyping };