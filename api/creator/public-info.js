const { parseCreatorSlugFromPath } = require('../_utils/paths');

/**
 * Vercel serverless function to get creator public information
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse creator slug from request
    const creatorSlug = parseCreatorSlugFromPath(req);

    if (!creatorSlug) {
      return res.status(400).json({ 
        error: 'Missing creator slug',
        message: 'Please provide a creator slug via query parameter or URL path' 
      });
    }

    // TODO: Replace with actual database query
    // For now, return mock data or 404
    // Example SQL query would be:
    // SELECT username, display_name, bio, avatar_url, tier 
    // FROM creators 
    // WHERE LOWER(username) = LOWER($1) AND is_active = true
    
    // Mock response - in production, this would query the database
    const mockCreators = {
      'testcreator': {
        username: 'testcreator',
        displayName: 'Test Creator',
        bio: 'A test creator account',
        tier: 'free'
      }
    };

    const creator = mockCreators[creatorSlug];

    if (!creator) {
      return res.status(404).json({ 
        error: 'Creator not found',
        message: `No creator found with slug: ${creatorSlug}` 
      });
    }

    // Return public creator information
    return res.status(200).json({
      success: true,
      data: {
        username: creator.username,
        displayName: creator.displayName,
        bio: creator.bio,
        tier: creator.tier
      }
    });

  } catch (error) {
    console.error('Error fetching creator info:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred while fetching creator information' 
    });
  }
};
