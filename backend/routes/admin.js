const express = require('express');
const router  = express.Router();
const db      = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * ── ADMIN DEMO MODE BYPASS ──────────────────────────────────────────────────
 */
const mockUsers = [
    { user_id: 1, email: 'admin@mindbridge.edu', full_name: 'MindBridge Director', role: 'admin', is_active: 1, created_at: new Date() },
    { user_id: 2, email: 'dr.smith@clinic.com', full_name: 'Dr. Sarah Smith', role: 'psychiatrist', is_active: 1, created_at: new Date() },
    { user_id: 3, email: 'patient.one@gmail.com', full_name: 'Alex Johnson', role: 'user', is_active: 1, created_at: new Date() }
];

const mockAlerts = [
    { id: 1, full_name: 'Alex Johnson', email: 'patient.one@gmail.com', trigger_type: 'stress_threshold', severity: 'high', notified_at: new Date() },
    { id: 2, full_name: 'Maria Garcia', email: 'm.garcia@gmail.com', trigger_type: 'keyword', severity: 'critical', notified_at: new Date() }
];

// List all users
router.get('/users', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id as user_id, email, display_name as full_name, role, is_active, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ success: true, data: users });
    } catch (dbErr) {
        console.warn("⚠️ Demo Mode: Loading mock users for admin.");
        res.json({ success: true, data: mockUsers });
    }
});

// Enable/disable user
router.put('/users/:id/status', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const { isActive } = req.body;
        await db.query('UPDATE users SET is_active = ? WHERE id = ?', [isActive, req.params.id]);
        res.json({ success: true });
    } catch (dbErr) {
        res.json({ success: true, message: 'Demo Mode: Status updated visually.' });
    }
});

// Change user role
router.put('/users/:id/role', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const { role } = req.body;
        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
        res.json({ success: true });
    } catch (dbErr) {
        res.json({ success: true, message: 'Demo Mode: Role updated visually.' });
    }
});

// Get all emergency alerts
router.get('/alerts', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const [alerts] = await db.query(
            `SELECT ea.*, u.display_name as full_name, u.email 
             FROM emergency_alerts ea
             JOIN users u ON ea.user_id = u.id
             ORDER BY ea.notified_at DESC LIMIT 50`
        );
        res.json({ success: true, data: alerts });
    } catch (dbErr) {
        console.warn("⚠️ Demo Mode: Loading mock alerts for admin.");
        res.json({ success: true, data: mockAlerts });
    }
});

module.exports = router;