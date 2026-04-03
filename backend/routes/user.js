// routes/user.js - SUPABASE LIVE VERSION
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

// ============================================
// GET user profile
// ============================================
router.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📊 Fetching live profile for user ID:', userId);

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id, email, display_name, role, phone, date_of_birth, gender, profile_picture, last_login, created_at,
        user_profiles (city, country, emergency_contact_name, emergency_contact_phone)
      `)
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get latest stress level
    const { data: stressLogs } = await supabase
      .from('stress_logs')
      .select('score')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(1);

    user.stressLevel = stressLogs?.length > 0 ? stressLogs[0].score : 50;

    res.json({ success: true, user });
  } catch (error) {
    console.error('❌ Profile fetch error:', error.message);
    res.status(500).json({ success: false, message: 'Supabase error' });
  }
});

// ============================================
// UPDATE user profile
// ============================================
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      name, phone, dateOfBirth, gender,
      city, country, emergencyContactName, emergencyContactPhone
    } = req.body;

    // Update users table
    const { error: userError } = await supabase
      .from('users')
      .update({ 
        display_name: name, 
        phone, 
        date_of_birth: dateOfBirth, 
        gender 
      })
      .eq('id', userId);

    if (userError) throw userError;

    // Update or Insert profile table
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({ 
        user_id: userId, 
        city, 
        country, 
        emergency_contact_name: emergencyContactName, 
        emergency_contact_phone: emergencyContactPhone 
      });

    if (profileError) throw profileError;

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('❌ Profile update error:', error.message);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// ============================================
// GET user statistics
// ============================================
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: chats } = await supabase.from('chat_sessions').select('id').eq('user_id', userId);
    const { data: games } = await supabase.from('game_sessions').select('id').eq('user_id', userId);
    const { data: stress } = await supabase.from('stress_logs').select('logged_at').eq('user_id', userId);

    res.json({
      success: true,
      stats: {
        chatSessions: chats?.length || 0,
        therapySessions: 0, 
        gamesPlayed: games?.length || 0,
        currentStreak: stress?.length || 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Stats failed' });
  }
});

module.exports = router;