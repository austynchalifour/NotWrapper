const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

// GET /api/hunts - List all hunts
router.get('/', async (req, res) => {
  try {
    const { 
      toolId,
      creatorId,
      limit = 20,
      offset = 0 
    } = req.query;

    let query = supabase
      .from('hunts')
      .select(`
        *,
        tool:tools(id, name, url),
        creator:profiles(username, display_name, avatar_url)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (toolId) {
      query = query.eq('tool_id', toolId);
    }

    if (creatorId) {
      query = query.eq('creator_id', creatorId);
    }

    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: hunts, error, count } = await query;

    if (error) throw error;

    res.json({ 
      hunts,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get hunts error:', error);
    res.status(500).json({ error: 'Failed to fetch hunts' });
  }
});

// GET /api/hunts/:id - Get hunt details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: hunt, error } = await supabase
      .from('hunts')
      .select(`
        *,
        tool:tools(*),
        creator:profiles(username, display_name, avatar_url),
        comments(
          *,
          author:profiles(username, display_name, avatar_url)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!hunt) {
      return res.status(404).json({ error: 'Hunt not found' });
    }

    // Increment view count
    await supabase
      .from('hunts')
      .update({ total_views: hunt.total_views + 1 })
      .eq('id', id);

    res.json({ hunt });

  } catch (error) {
    console.error('Get hunt error:', error);
    res.status(500).json({ error: 'Failed to fetch hunt' });
  }
});

// POST /api/hunts - Create new hunt
router.post('/', async (req, res) => {
  try {
    const {
      toolId,
      creatorId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      durationSeconds,
      verdict
    } = req.body;

    if (!creatorId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!title || !videoUrl) {
      return res.status(400).json({ error: 'Title and video URL are required' });
    }

    const { data: hunt, error } = await supabase
      .from('hunts')
      .insert({
        tool_id: toolId || null,
        creator_id: creatorId,
        title: title.trim(),
        description: description?.trim() || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || null,
        duration_seconds: durationSeconds || null,
        verdict: verdict || null
      })
      .select(`
        *,
        tool:tools(*),
        creator:profiles(username, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    // Update leaderboard points
    const weekStart = getWeekStart();
    await supabase.rpc('increment_hunt_count', {
      p_user_id: creatorId,
      p_week_start: weekStart
    }).catch(() => {
      console.log('Leaderboard update skipped');
    });

    res.json({ success: true, hunt });

  } catch (error) {
    console.error('Create hunt error:', error);
    res.status(500).json({ error: 'Failed to create hunt' });
  }
});

// POST /api/hunts/:id/vote - Vote on a hunt
router.post('/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, voteType } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (![1, -1].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid vote type' });
    }

    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('hunt_id', id)
      .eq('user_id', userId)
      .single();

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        await supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id);

        return res.json({ success: true, action: 'removed' });
      } else {
        await supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);

        return res.json({ success: true, action: 'updated' });
      }
    } else {
      await supabase
        .from('votes')
        .insert({
          hunt_id: id,
          user_id: userId,
          vote_type: voteType
        });

      return res.json({ success: true, action: 'created' });
    }

  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to vote' });
  }
});

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

module.exports = router;

