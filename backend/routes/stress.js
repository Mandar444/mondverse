const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

// Log stress level
router.post('/log', authenticate, async (req, res) => {
    try {
        const { stressLevel, mood, notes, triggers, activityContext } = req.body;
        const userId = req.user.id;

        const { error } = await supabase
            .from('stress_logs')
            .insert([{
                user_id: userId,
                score: stressLevel,
                mood,
                notes,
                triggers,
                activity_context: activityContext
            }]);

        if (error) throw error;
        res.json({ success: true, message: 'Stress level logged' });
    } catch (error) {
        console.error('⚠️ Supabase Log Stress Error:', error.message);
        res.json({ success: true });
    }
});

// Get stress history
router.get('/history', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { days = 30 } = req.query;

        const { data: history, error } = await supabase
            .from('stress_logs')
            .select('*')
            .eq('user_id', userId)
            .order('logged_at', { ascending: false })
            .limit(parseInt(days));

        if (error) throw error;
        res.json({ success: true, data: history });
    } catch (error) {
        console.error('⚠️ Supabase History Error:', error.message);
        res.json({ success: true, data: [] });
    }
});

// Get weekly stats
router.get('/weekly', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: weeklyData, error } = await supabase
            .from('stress_logs')
            .select('logged_at, score')
            .eq('user_id', userId)
            .limit(10); // Simplified for Supabase REST

        if (error) throw error;
        res.json({ success: true, data: weeklyData });
    } catch (error) {
        res.json({ success: true, data: [] });
    }
});

// Get current stress level
router.get('/current', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: current, error } = await supabase
            .from('stress_logs')
            .select('*')
            .eq('user_id', userId)
            .order('logged_at', { ascending: false })
            .limit(1);

        if (error) throw error;
        res.json({ success: true, data: current.length > 0 ? current[0] : null });
    } catch (error) {
        res.json({ success: true, data: null });
    }
});

module.exports = router;
