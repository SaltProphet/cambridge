const { requireAuth, getCreatorByUserId } = require('../_utils/auth');
const { sql } = require('@vercel/postgres');

/**
 * Revoke an access token
 * POST /api/tokens/revoke
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
    // Require authentication
    const user = await requireAuth(req, res);
    if (!user) return; // requireAuth already sent error response

    // Get creator for this user
    const creator = await getCreatorByUserId(user.id);
    
    if (!creator) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You must be a creator to access this endpoint'
      });
    }

    // Parse request body
    const { tokenId, joinRequestId } = req.body;

    if (!tokenId && !joinRequestId) {
      return res.status(400).json({
        error: 'Missing identifier',
        message: 'Please provide either tokenId or joinRequestId in the request body'
      });
    }

    // Check if database is configured
    const hasDatabase = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!hasDatabase) {
      // Development mode: return mock response
      console.log('DEV_NO_DB: Revoking token:', tokenId || joinRequestId);
      
      return res.status(200).json({
        success: true,
        devMode: true,
        data: {
          revoked: true,
          revokedAt: new Date().toISOString()
        }
      });
    }

    // Build revocation query based on provided identifier
    let revokeResult;
    if (tokenId) {
      // Verify the token belongs to a request owned by this creator
      const verifyResult = await sql`
        SELECT at.id
        FROM access_tokens at
        JOIN join_requests jr ON at.join_request_id = jr.id
        WHERE at.id = ${tokenId}
          AND jr.creator_id = ${creator.id}
        LIMIT 1
      `;

      if (verifyResult.rows.length === 0) {
        return res.status(404).json({
          error: 'Token not found',
          message: 'No token found with that ID or you do not have permission to revoke it'
        });
      }

      // Revoke by setting expiration to now
      revokeResult = await sql`
        UPDATE access_tokens
        SET expires_at = NOW()
        WHERE id = ${tokenId}
      `;
    } else {
      // Verify the join request belongs to this creator
      const verifyResult = await sql`
        SELECT id
        FROM join_requests
        WHERE id = ${joinRequestId}
          AND creator_id = ${creator.id}
        LIMIT 1
      `;

      if (verifyResult.rows.length === 0) {
        return res.status(404).json({
          error: 'Join request not found',
          message: 'No join request found with that ID or you do not have permission to revoke its tokens'
        });
      }

      // Revoke all tokens for this join request
      revokeResult = await sql`
        UPDATE access_tokens
        SET expires_at = NOW()
        WHERE join_request_id = ${joinRequestId}
          AND expires_at > NOW()
      `;
    }

    return res.status(200).json({
      success: true,
      data: {
        revoked: true,
        revokedAt: new Date().toISOString(),
        tokensAffected: revokeResult.rowCount || 0
      }
    });

  } catch (error) {
    console.error('Error revoking token:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while revoking the token'
    });
  }
};
