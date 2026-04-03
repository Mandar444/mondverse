const express = require('express');
const router  = express.Router();
const db      = require('../config/database');
const { authenticate } = require('../middleware/auth');

// PHQ-9 scoring: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 mod-severe, 20+ severe
router.post('/submit', authenticate, async (req, res) => {
    const { quizType, answers } = req.body; // answers = array of 0-3 scores
    const userId = req.user.userId;
    const totalScore = answers.reduce((a, b) => a + b, 0);

    let severity;
    if (quizType === 'PHQ9') {
        if (totalScore <= 4)  severity = 'minimal';
        else if (totalScore <= 9)  severity = 'mild';
        else if (totalScore <= 14) severity = 'moderate';
        else if (totalScore <= 19) severity = 'moderately_severe';
        else severity = 'severe';
    } else if (quizType === 'GAD7') {
        if (totalScore <= 4)  severity = 'minimal';
        else if (totalScore <= 9)  severity = 'mild';
        else if (totalScore <= 14) severity = 'moderate';
        else severity = 'severe';
    }

    await db.query(
        'INSERT INTO quiz_results (user_id, quiz_type, score, severity, taken_at) VALUES (?,?,?,?,NOW())',
        [userId, quizType, totalScore, severity]
    );

    res.json({ success: true, score: totalScore, severity });
});

router.get('/history', authenticate, async (req, res) => {
    const userId = req.user.userId;
    const [results] = await db.query(
        'SELECT * FROM quiz_results WHERE user_id = ? ORDER BY taken_at DESC LIMIT 20',
        [userId]
    );
    res.json({ success: true, data: results });
});

module.exports = router;