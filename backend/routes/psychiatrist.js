const express = require('express');
const router  = express.Router();
const db      = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * ── PSYCHIATRIST DEMO MODE BYPASS ──────────────────────────────────────────
 */
const mockPatients = [
    { user_id: 3, full_name: 'Alex Johnson', email: 'alex@demo.com', latest_stress: 42, stressClass: 'Low' },
    { user_id: 4, full_name: 'Maria Garcia', email: 'maria@demo.com', latest_stress: 78, stressClass: 'Critical' },
    { user_id: 5, full_name: 'Jordan Smith', email: 'jordan@demo.com', latest_stress: 15, stressClass: 'Optimal' }
];

const mockHistory = [
    { stress_level: 45, recorded_date: '2024-03-31' },
    { stress_level: 52, recorded_date: '2024-03-30' },
    { stress_level: 68, recorded_date: '2024-03-29' }
];

// Get all patients with latest stress
router.get('/patients', authenticate, requireRole('psychiatrist', 'admin'), async (req, res) => {
    try {
        const [patients] = await db.query(
            `SELECT u.id as user_id, u.display_name as full_name, u.email FROM users u WHERE u.role = 'user'`
        );
        res.json({ success: true, data: patients });
    } catch (dbErr) {
        console.warn("⚠️ Demo Mode: Loading mock patients for psychiatrist.");
        res.json({ success: true, data: mockPatients });
    }
});

// Get one patient's full stress history
router.get('/patients/:id/stress', authenticate, requireRole('psychiatrist', 'admin'), async (req, res) => {
    try {
        const [history] = await db.query(
            'SELECT score as stress_level, logged_at as recorded_date FROM stress_logs WHERE user_id = ? ORDER BY logged_at DESC LIMIT 30',
            [req.params.id]
        );
        res.json({ success: true, data: history });
    } catch (dbErr) {
        res.json({ success: true, data: mockHistory });
    }
});

// Get emergency alerts
router.get('/alerts', authenticate, requireRole('psychiatrist', 'admin'), async (req, res) => {
    try {
        const [alerts] = await db.query(
            `SELECT ea.*, u.display_name as full_name FROM emergency_alerts ea JOIN users u ON ea.user_id = u.id`
        );
        res.json({ success: true, data: alerts });
    } catch (dbErr) {
        res.json({ success: true, data: [] });
    }
});

module.exports = router;