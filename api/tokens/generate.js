const { sql } = require('@vercel/postgres');
const { generateToken } = require('../_utils/auth');
const { generateAccessToken } = require('../_utils/tokens');

/**
 * Generate access token for an approved join request
 * POST /api/tokens/generate
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse request body
    const { joinRequestId, expiresInDays = 7 } = req.body;

    if (!joinRequestId) {
      return res.status(400).json({
        error: 'Missing join request ID',
        message: 'Please provide a joinRequestId in the request body'
      });
    }

    // Use the helper function to generate the token
    const result = await generateAccessToken(joinRequestId, expiresInDays);

    if (!result.success) {
      if (result.error === 'Join request not found') {
        return res.status(404).json({
          error: 'Join request not found',
          message: 'No join request found with that ID'
        });
      } else if (result.error === 'Request not approved') {
        return res.status(400).json({
          error: 'Request not approved',
          message: 'Cannot generate token for a request that is not approved'
        });
      } else {
        return res.status(500).json({
          error: 'Internal server error',
          message: result.error || 'An error occurred while generating the access token'
        });
      }
    }

    return res.status(200).json({
      success: true,
      devMode: result.devMode,
      data: {
        token: result.token,
        expiresAt: result.expiresAt,
        joinRequestId,
        existing: result.existing
      }
    });

  } catch (error) {
    console.error('Error generating access token:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while generating the access token'
    });
  }
};
