const express = require('express');
const axios = require('axios');
const supabase = require('../config/supabase');
const router = express.Router();

const ANALYZER_URL = process.env.ANALYZER_URL || 'http://localhost:5000';

// POST /api/scan - Trigger new scan
router.post('/', async (req, res) => {
  try {
    const { url, userId } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`🔍 Starting scan for: ${url}`);

    // Call Python analyzer service
    const startTime = Date.now();
    let analysisResult;
    
    try {
      const analyzerResponse = await axios.post(`${ANALYZER_URL}/analyze`, {
        url: url
      }, {
        timeout: 60000 // 60 second timeout
      });
      analysisResult = analyzerResponse.data;
    } catch (analyzerError) {
      console.error('Analyzer service error:', analyzerError.message);
      // Fallback to basic analysis if analyzer fails
      analysisResult = {
        verdict: 'Wrapper Sus',
        confidence: 50,
        receipts: {
          error: 'Analysis service unavailable - using basic detection',
          detected_frameworks: [],
          suspicious_patterns: []
        },
        stack_dna: {
          frontend: 'Unknown',
          backend: 'Unknown'
        }
      };
    }

    const scanDuration = Date.now() - startTime;

    // Check if tool exists, create if not
    let tool;
    const { data: existingTool } = await supabase
      .from('tools')
      .select('*')
      .eq('url', url)
      .single();

    if (existingTool) {
      tool = existingTool;
      
      // Update tool with latest scan results
      await supabase
        .from('tools')
        .update({
          latest_verdict: analysisResult.verdict,
          transparency_score: analysisResult.confidence,
          total_scans: tool.total_scans + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', tool.id);
    } else {
      // Extract domain name as tool name
      const urlObj = new URL(url);
      const toolName = urlObj.hostname.replace('www.', '').split('.')[0];

      const { data: newTool, error: toolError } = await supabase
        .from('tools')
        .insert({
          name: toolName.charAt(0).toUpperCase() + toolName.slice(1),
          url: url,
          submitted_by: userId || null,
          latest_verdict: analysisResult.verdict,
          transparency_score: analysisResult.confidence,
          total_scans: 1
        })
        .select()
        .single();

      if (toolError) throw toolError;
      tool = newTool;
    }

    // Create scan record
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .insert({
        tool_id: tool.id,
        scanned_by: userId || null,
        verdict: analysisResult.verdict,
        confidence: analysisResult.confidence,
        receipts: analysisResult.receipts || {},
        stack_dna: analysisResult.stack_dna || {},
        analysis_data: analysisResult.analysis_data || {},
        scan_duration_ms: scanDuration
      })
      .select()
      .single();

    if (scanError) throw scanError;

    // Update leaderboard points for user if authenticated
    if (userId) {
      const weekStart = getWeekStart();
      await supabase.rpc('increment_scan_count', {
        p_user_id: userId,
        p_week_start: weekStart
      }).catch(() => {
        // Ignore leaderboard errors
        console.log('Leaderboard update skipped');
      });
    }

    console.log(`✅ Scan complete: ${analysisResult.verdict} (${analysisResult.confidence}%)`);

    res.json({
      success: true,
      scan: {
        id: scan.id,
        tool_id: tool.id,
        tool_name: tool.name,
        verdict: scan.verdict,
        confidence: scan.confidence,
        receipts: scan.receipts,
        stack_dna: scan.stack_dna,
        scan_duration_ms: scanDuration,
        created_at: scan.created_at
      }
    });

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ 
      error: 'Scan failed',
      message: error.message 
    });
  }
});

// GET /api/scan/:id - Get scan results
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: scan, error } = await supabase
      .from('scans')
      .select(`
        *,
        tool:tools(*),
        scanned_by_profile:profiles(username, display_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    res.json({ scan });

  } catch (error) {
    console.error('Get scan error:', error);
    res.status(500).json({ error: 'Failed to fetch scan' });
  }
});

// Helper function to get current week start (Monday)
function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

module.exports = router;

