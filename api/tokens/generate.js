const { sql } = require('@vercel/postgres');
const { generateToken } = require('../_utils/auth');

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

    // Check if database is configured
    const hasDatabase = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!hasDatabase) {
      // Development mode: return mock token
      console.log('DEV_NO_DB: Generating mock access token for join request:', joinRequestId);
      
      const mockToken = generateToken({
        id: 'dev-user-id',
        email: 'dev@example.com'
      });

      return res.status(200).json({
        success: true,
        devMode: true,
        data: {
          token: mockToken,
          expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
          joinRequestId
        }
      });
    }

    // Verify the join request exists and is approved
    const requestResult = await sql`
      SELECT jr.id, jr.user_email, jr.status, jr.creator_id
      FROM join_requests jr
      WHERE jr.id = ${joinRequestId}
      LIMIT 1
    `;

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Join request not found',
        message: 'No join request found with that ID'
      });
    }

    const joinRequest = requestResult.rows[0];

    // Verify the request is approved
    if (joinRequest.status !== 'approved') {
      return res.status(400).json({
        error: 'Request not approved',
        message: 'Cannot generate token for a request that is not approved'
      });
    }

    // Check if token already exists for this request
    const existingTokenResult = await sql`
      SELECT id, token, expires_at
      FROM access_tokens
      WHERE join_request_id = ${joinRequestId}
        AND expires_at > NOW()
      LIMIT 1
    `;

    if (existingTokenResult.rows.length > 0) {
      const existingToken = existingTokenResult.rows[0];
      return res.status(200).json({
        success: true,
        data: {
          token: existingToken.token,
          expiresAt: existingToken.expires_at,
          joinRequestId,
          existing: true
        }
      });
    }

    // Generate new access token
    const token = generateToken({
      id: joinRequest.id,
      email: joinRequest.user_email
    });

    // Calculate expiration date
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    // Store token in database
    await sql`
      INSERT INTO access_tokens (
        join_request_id, 
        token, 
        expires_at,
        created_at
      ) VALUES (
        ${joinRequestId},
        ${token},
        ${expiresAt.toISOString()},
        NOW()
      )
    `;

    return res.status(200).json({
      success: true,
      data: {
        token,
        expiresAt: expiresAt.toISOString(),
        joinRequestId
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
