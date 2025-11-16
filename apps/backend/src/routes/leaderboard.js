const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

// GET /api/leaderboard - Get leaderboard rankings
router.get('/', async (req, res) => {
  try {
    const { 
      period = 'current', // current, previous, all-time
      limit = 50 
    } = req.query;

    let weekStart;
    
    if (period === 'current') {
      weekStart = getCurrentWeekStart();
    } else if (period === 'previous') {
      weekStart = getPreviousWeekStart();
    }

    let query = supabase
      .from('leaderboard_points')
      .select(`
        *,
        user:profiles(username, display_name, avatar_url)
      `)
      .order('points', { ascending: false })
      .limit(parseInt(limit));

    if (weekStart) {
      query = query.eq('week_start', weekStart);
    }

    const { data: rankings, error } = await query;

    if (error) throw error;

    res.json({ 
      rankings,
      period,
      week_start: weekStart
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// GET /api/leaderboard/user/:userId - Get user's ranking
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const weekStart = getCurrentWeekStart();

    const { data: userStats, error } = await supabase
      .from('leaderboard_points')
      .select(`
        *,
        user:profiles(username, display_name, avatar_url)
      `)
      .eq('user_id', userId)
      .eq('week_start', weekStart)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!userStats) {
      return res.json({
        user_id: userId,
        points: 0,
        hunts_count: 0,
        scans_count: 0,
        upvotes_received: 0,
        accuracy_score: 0,
        rank: null
      });
    }

    // Get user's rank
    const { count } = await supabase
      .from('leaderboard_points')
      .select('*', { count: 'exact', head: true })
      .eq('week_start', weekStart)
      .gt('points', userStats.points);

    userStats.rank = (count || 0) + 1;

    res.json(userStats);

  } catch (error) {
    console.error('Get user ranking error:', error);
    res.status(500).json({ error: 'Failed to fetch user ranking' });
  }
});

function getCurrentWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

function getPreviousWeekStart() {
  const currentWeek = new Date(getCurrentWeekStart());
  currentWeek.setDate(currentWeek.getDate() - 7);
  return currentWeek.toISOString().split('T')[0];
}

module.exports = router;

