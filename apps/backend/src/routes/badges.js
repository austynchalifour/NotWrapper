const express = require('express');
const supabase = require('../config/supabase');
const { generateBadgeSVG, generateBadgePNG } = require('../utils/badgeGenerator');
const router = express.Router();

// POST /api/badges/generate - Generate badge for a tool
router.post('/generate', async (req, res) => {
  try {
    const { toolId, scanId, userId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!toolId || !scanId) {
      return res.status(400).json({ error: 'Tool ID and Scan ID are required' });
    }

    // Verify the scan exists and has NotWrapper verdict
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .select('*, tool:tools(*)')
      .eq('id', scanId)
      .single();

    if (scanError || !scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    if (scan.verdict !== 'NotWrapper') {
      return res.status(400).json({ 
        error: 'Badge can only be issued for NotWrapper verdict',
        verdict: scan.verdict
      });
    }

    // Check if tool already has a badge
    const { data: existingBadge } = await supabase
      .from('badges')
      .select('*')
      .eq('tool_id', toolId)
      .eq('badge_type', 'certified_notwrapper')
      .eq('is_revoked', false)
      .single();

    if (existingBadge) {
      return res.json({ 
        success: true, 
        badge: existingBadge,
        message: 'Badge already exists'
      });
    }

    // Generate SVG and PNG badges
    const toolName = scan.tool.name;
    const confidence = scan.confidence;

    const svgContent = generateBadgeSVG(toolName, confidence);
    const pngBuffer = await generateBadgePNG(svgContent);

    // Upload to Supabase Storage
    const timestamp = Date.now();
    const svgPath = `badges/${toolId}-${timestamp}.svg`;
    const pngPath = `badges/${toolId}-${timestamp}.png`;

    const { error: svgUploadError } = await supabase.storage
      .from('badges')
      .upload(svgPath, svgContent, {
        contentType: 'image/svg+xml',
        cacheControl: '3600'
      });

    if (svgUploadError) throw svgUploadError;

    const { error: pngUploadError } = await supabase.storage
      .from('badges')
      .upload(pngPath, pngBuffer, {
        contentType: 'image/png',
        cacheControl: '3600'
      });

    if (pngUploadError) throw pngUploadError;

    // Get public URLs
    const { data: svgUrl } = supabase.storage
      .from('badges')
      .getPublicUrl(svgPath);

    const { data: pngUrl } = supabase.storage
      .from('badges')
      .getPublicUrl(pngPath);

    // Generate embed code
    const embedCode = `<a href="${process.env.WEB_URL || 'https://notwrapper.app'}/tools/${toolId}" target="_blank">
  <img src="${svgUrl.publicUrl}" alt="Certified NotWrapper" width="200" />
</a>`;

    // Create badge record
    const { data: badge, error: badgeError } = await supabase
      .from('badges')
      .insert({
        tool_id: toolId,
        scan_id: scanId,
        badge_type: 'certified_notwrapper',
        issued_to: userId,
        badge_svg_url: svgUrl.publicUrl,
        badge_png_url: pngUrl.publicUrl,
        embed_code: embedCode
      })
      .select()
      .single();

    if (badgeError) throw badgeError;

    res.json({ 
      success: true, 
      badge,
      message: 'Badge generated successfully'
    });

  } catch (error) {
    console.error('Generate badge error:', error);
    res.status(500).json({ error: 'Failed to generate badge' });
  }
});

// GET /api/badges/:toolId - Get badge for a tool
router.get('/:toolId', async (req, res) => {
  try {
    const { toolId } = req.params;

    const { data: badge, error } = await supabase
      .from('badges')
      .select('*')
      .eq('tool_id', toolId)
      .eq('is_revoked', false)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!badge) {
      return res.status(404).json({ error: 'Badge not found' });
    }

    res.json({ badge });

  } catch (error) {
    console.error('Get badge error:', error);
    res.status(500).json({ error: 'Failed to fetch badge' });
  }
});

module.exports = router;

