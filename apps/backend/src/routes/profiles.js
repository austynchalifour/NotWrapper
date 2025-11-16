const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

// GET /api/profiles/:username - Get user profile
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        tools:tools(count),
        scans:scans(count),
        hunts:hunts(count)
      `)
      .eq('username', username)
      .single();

    if (error) throw error;
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Get recent activity
    const { data: recentScans } = await supabase
      .from('scans')
      .select('*, tool:tools(name, url)')
      .eq('scanned_by', profile.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: recentHunts } = await supabase
      .from('hunts')
      .select('*, tool:tools(name, url)')
      .eq('creator_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(10);

    profile.recent_scans = recentScans || [];
    profile.recent_hunts = recentHunts || [];

    res.json({ profile });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profiles/:id - Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, display_name, bio, website, twitter, github, avatar_url } = req.body;

    if (!userId || userId !== id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updateData = {};
    if (display_name !== undefined) updateData.display_name = display_name;
    if (bio !== undefined) updateData.bio = bio;
    if (website !== undefined) updateData.website = website;
    if (twitter !== undefined) updateData.twitter = twitter;
    if (github !== undefined) updateData.github = github;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, profile });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;

