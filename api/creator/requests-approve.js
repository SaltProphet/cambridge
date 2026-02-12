const { requireAuth, getCreatorByUserId } = require('../_utils/auth');
const { sql } = require('@vercel/postgres');
const { generateAccessToken } = require('../_utils/tokens');

/**
 * Vercel serverless function to approve a join request
 * POST /api/creator/requests/approve
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
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({
        error: 'Missing request ID',
        message: 'Please provide a requestId in the request body'
      });
    }

    // Check if database is configured
    const hasDatabase = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!hasDatabase) {
      // Development mode: return mock response with token
      console.log('DEV_NO_DB: Approving join request:', requestId);
      
      // Generate token in dev mode too
      const tokenResult = await generateAccessToken(requestId);
      
      const responseData = {
        requestId,
        status: 'approved',
        approvedAt: new Date().toISOString()
      };

      if (tokenResult.success && tokenResult.token) {
        responseData.accessToken = {
          token: tokenResult.token,
          expiresAt: tokenResult.expiresAt
        };
      }
      
      return res.status(200).json({
        success: true,
        devMode: true,
        data: responseData
      });
    }

    // Verify the request belongs to this creator and is pending
    const checkResult = await sql`
      SELECT id, status, creator_id
      FROM join_requests
      WHERE id = ${requestId}
      LIMIT 1
    `;

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Request not found',
        message: 'No join request found with that ID'
      });
    }

    const request = checkResult.rows[0];

    // Verify ownership
    if (request.creator_id !== creator.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to approve this request'
      });
    }

    // Check if already processed
    if (request.status !== 'pending') {
      return res.status(400).json({
        error: 'Request already processed',
        message: `This request has already been ${request.status}`
      });
    }

    // Update request status to approved
    await sql`
      UPDATE join_requests
      SET status = 'approved',
          updated_at = NOW()
      WHERE id = ${requestId}
    `;

    // Automatically generate access token for the approved user
    const tokenResult = await generateAccessToken(requestId);
    
    // Include token in response if successfully generated
    const responseData = {
      requestId,
      status: 'approved',
      approvedAt: new Date().toISOString()
    };

    if (tokenResult.success && tokenResult.token) {
      responseData.accessToken = {
        token: tokenResult.token,
        expiresAt: tokenResult.expiresAt
      };
    }

    return res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error approving join request:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while approving the join request'
    });
  }
};
