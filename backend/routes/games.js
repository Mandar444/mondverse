const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

// Save game session
router.post('/session', authenticate, async (req, res) => {
    try {
        const { 
            gameType, 
            score, 
            durationSeconds, 
            levelReached, 
            movesCount, 
            completed, 
            stressReduction 
        } = req.body;
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('game_sessions')
            .insert([{
                user_id: userId,
                game_type: gameType,
                score,
                duration_seconds: durationSeconds,
                level_reached: levelReached,
                moves_count: movesCount,
                completed,
                stress_reduction: stressReduction
            }])
            .select();

        if (error) throw error;

        res.json({
            success: true,
            sessionId: data[0].id
        });
    } catch (error) {
        console.error('⚠️ Supabase Game Save Error:', error.message);
        res.status(200).json({ 
            success: true, 
            message: 'Game session handled in demo mode' 
        });
    }
});

// Get game history
router.get('/history', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { gameType, limit = 20 } = req.query;

        let query = supabase
            .from('game_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('played_at', { ascending: false })
            .limit(parseInt(limit));

        if (gameType) {
            query = query.eq('game_type', gameType);
        }

        const { data: history, error } = await query;
        if (error) throw error;

        res.json({ success: true, data: history });
    } catch (error) {
        console.error('⚠️ Supabase Game History Error:', error.message);
        res.json({ success: true, data: [] });
    }
});

// Get game statistics
router.get('/stats', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: stats, error } = await supabase
            .from('game_sessions')
            .select('game_type, score, duration_seconds, stress_reduction')
            .eq('user_id', userId);

        if (error) throw error;

        const grouped = stats.reduce((acc, curr) => {
            if (!acc[curr.game_type]) {
                acc[curr.game_type] = { total_plays: 0, total_score: 0, best_score: 0, total_reduction: 0 };
            }
            acc[curr.game_type].total_plays++;
            acc[curr.game_type].total_score += curr.score;
            acc[curr.game_type].best_score = Math.max(acc[curr.game_type].best_score, curr.score || 0);
            acc[curr.game_type].total_reduction += (curr.stress_reduction || 0);
            return acc;
        }, {});

        res.json({ success: true, data: Object.keys(grouped).map(k => ({ game_type: k, ...grouped[k] })) });
    } catch (error) {
        console.error('⚠️ Supabase Game Stats Error:', error.message);
        res.json({ success: true, data: [] });
    }
});

module.exports = router;
