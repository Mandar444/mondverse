// backend/utils/stressEngine.js
function classifyStress(level) {
    if (level <= 30) return { label: 'Low', color: 'green' };
    if (level <= 60) return { label: 'Moderate', color: 'yellow' };
    if (level <= 80) return { label: 'High', color: 'orange' };
    return { label: 'Critical', color: 'red' };
}

function calculateTrend(history) {
    // history = array of { stress_level, recorded_date }
    if (history.length < 2) return 'stable';
    const recent = history.slice(0, 3).reduce((a, b) => a + b.stress_level, 0) / 3;
    const older  = history.slice(-3).reduce((a, b) => a + b.stress_level, 0) / 3;
    if (recent > older + 10) return 'increasing';
    if (recent < older - 10) return 'decreasing';
    return 'stable';
}

function getWeeklyAverage(history) {
    if (!history.length) return 0;
    return Math.round(history.reduce((a, b) => a + b.stress_level, 0) / history.length);
}

module.exports = { classifyStress, calculateTrend, getWeeklyAverage };