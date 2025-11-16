const sharp = require('sharp');

function generateBadgeSVG(toolName, confidence) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="240" height="80" viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="240" height="80" fill="url(#bg)" rx="4"/>
  
  <!-- Border -->
  <rect x="1" y="1" width="238" height="78" fill="none" stroke="#00ff41" stroke-width="2" rx="3"/>
  
  <!-- Icon -->
  <circle cx="25" cy="40" r="12" fill="none" stroke="#00ff41" stroke-width="2"/>
  <path d="M 20 40 L 23 43 L 30 36" stroke="#00ff41" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- Text -->
  <text x="45" y="32" font-family="monospace" font-size="12" font-weight="bold" fill="#00ff41">
    CERTIFIED
  </text>
  <text x="45" y="50" font-family="monospace" font-size="16" font-weight="bold" fill="#ffffff">
    NOT WRAPPER
  </text>
  
  <!-- Confidence -->
  <text x="220" y="45" font-family="monospace" font-size="14" font-weight="bold" fill="#00ff41" text-anchor="end">
    ${confidence}%
  </text>
</svg>`;
}

async function generateBadgePNG(svgContent) {
  try {
    const pngBuffer = await sharp(Buffer.from(svgContent))
      .resize(480, 160) // 2x size for better quality
      .png()
      .toBuffer();
    
    return pngBuffer;
  } catch (error) {
    console.error('PNG generation error:', error);
    throw error;
  }
}

module.exports = {
  generateBadgeSVG,
  generateBadgePNG
};

