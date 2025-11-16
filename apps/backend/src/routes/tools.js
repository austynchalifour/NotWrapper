const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

// GET /api/tools - List all tools with filters
router.get('/', async (req, res) => {
  try {
    const { 
      verdict, 
      category, 
      sort = 'recent',
      limit = 20,
      offset = 0 
    } = req.query;

    let query = supabase
      .from('tools')
      .select(`
        *,
        submitted_by_profile:profiles(username, display_name, avatar_url),
        scans(count)
      `, { count: 'exact' });

    // Apply filters
    if (verdict && verdict !== 'all') {
      query = query.eq('latest_verdict', verdict);
    }

    if (category) {
      query = query.eq('category', category);
    }

    // Apply sorting
    switch (sort) {
      case 'recent':
        query = query.order('created_at', { ascending: false });
        break;
      case 'votes':
        query = query.order('total_votes', { ascending: false });
        break;
      case 'transparency':
        query = query.order('transparency_score', { ascending: false });
        break;
      case 'scans':
        query = query.order('total_scans', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: tools, error, count } = await query;

    if (error) throw error;

    res.json({ 
      tools,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get tools error:', error);
    res.status(500).json({ error: 'Failed to fetch tools' });
  }
});

// GET /api/tools/:id - Get tool details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: tool, error } = await supabase
      .from('tools')
      .select(`
        *,
        submitted_by_profile:profiles(username, display_name, avatar_url),
        scans(
          id,
          verdict,
          confidence,
          created_at,
          scanned_by_profile:profiles(username, display_name, avatar_url)
        ),
        badges(*),
        comments(
          *,
          author:profiles(username, display_name, avatar_url)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    // Get vote status for current user if provided
    const userId = req.query.userId;
    if (userId) {
      const { data: vote } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('tool_id', id)
        .eq('user_id', userId)
        .single();

      tool.user_vote = vote ? vote.vote_type : 0;
    }

    res.json({ tool });

  } catch (error) {
    console.error('Get tool error:', error);
    res.status(500).json({ error: 'Failed to fetch tool' });
  }
});

// POST /api/tools/:id/vote - Vote on a tool
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

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('tool_id', id)
      .eq('user_id', userId)
      .single();

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote
        await supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id);

        return res.json({ success: true, action: 'removed' });
      } else {
        // Update vote
        await supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);

        return res.json({ success: true, action: 'updated' });
      }
    } else {
      // Create new vote
      await supabase
        .from('votes')
        .insert({
          tool_id: id,
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

// POST /api/tools/:id/comments - Add comment
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, content, parentId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        tool_id: id,
        author_id: userId,
        content: content.trim(),
        parent_id: parentId || null
      })
      .select(`
        *,
        author:profiles(username, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    res.json({ success: true, comment });

  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

module.exports = router;

