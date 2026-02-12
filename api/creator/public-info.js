const { parseCreatorSlugFromPath } = require('../_utils/paths');
const { sql } = require('@vercel/postgres');

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

    // Check if database is configured
    const hasDatabase = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!hasDatabase) {
      // Development mode: return mock data
      console.log('DEV_NO_DB: Returning mock creator info for slug:', creatorSlug);
      
      const mockCreators = {
        'testcreator': {
          username: 'testcreator',
          displayName: 'Test Creator',
          bio: 'A test creator account',
          tier: 'free',
          avatarUrl: null
        }
      };

      const creator = mockCreators[creatorSlug];

      if (!creator) {
        return res.status(404).json({ 
          error: 'Creator not found',
          message: `No creator found with slug: ${creatorSlug}`,
          devMode: true
        });
      }

      return res.status(200).json({
        success: true,
        devMode: true,
        data: {
          username: creator.username,
          displayName: creator.displayName,
          bio: creator.bio,
          tier: creator.tier,
          avatarUrl: creator.avatarUrl
        }
      });
    }

    // Query database for creator information
    const result = await sql`
      SELECT 
        c.slug as username,
        c.display_name,
        c.bio,
        c.avatar_url,
        c.tier,
        c.is_active
      FROM creators c
      WHERE LOWER(c.slug) = LOWER(${creatorSlug})
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Creator not found',
        message: `No creator found with slug: ${creatorSlug}` 
      });
    }

    const creator = result.rows[0];

    // Check if creator is active
    if (!creator.is_active) {
      return res.status(404).json({ 
        error: 'Creator not found',
        message: `Creator account is not active` 
      });
    }

    // Return public creator information
    return res.status(200).json({
      success: true,
      data: {
        username: creator.username,
        displayName: creator.display_name,
        bio: creator.bio,
        tier: creator.tier,
        avatarUrl: creator.avatar_url
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
