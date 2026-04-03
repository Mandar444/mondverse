const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

/**
 * ── MEDICAL HISTORY & CLINICAL DATA (SUPABASE) ───────────────────────────
 */

// Get user's full medical history
router.get('/history', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { data, error } = await supabase
            .from('medical_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        console.error('⚠️ Supabase Medical History Error:', error.message);
        res.json({ success: true, data: [] });
    }
});

// Add a new medical record
router.post('/record', authenticate, async (req, res) => {
    try {
        const { condition, diagnosed_by, notes, status = 'Active', diagnosed_date } = req.body;
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('medical_history')
            .insert([{
                user_id: userId,
                condition,
                diagnosed_by,
                notes,
                status,
                diagnosed_date
            }])
            .select();

        if (error) throw error;
        res.json({ success: true, data: data[0] });
    } catch (error) {
        console.error('⚠️ Supabase Medical Record Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to save record' });
    }
});

// Get medication records
router.get('/medication', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { data, error } = await supabase
            .from('medications')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        console.error('⚠️ Supabase Medication Error:', error.message);
        res.json({ success: true, data: [] });
    }
});

module.exports = router;
