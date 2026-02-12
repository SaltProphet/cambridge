const { requireAuth, getCreatorByUserId } = require('../_utils/auth');
const { sql } = require('@vercel/postgres');

/**
 * Vercel serverless function to list join requests for a creator
 * GET /api/creator/requests
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
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

    // Parse query parameters
    const { status = 'pending', page = '1', limit = '20' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Check if database is configured
    const hasDatabase = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!hasDatabase) {
      // Development mode: return mock data
      console.log('DEV_NO_DB: Returning mock join requests for creator:', creator.id);
      
      return res.status(200).json({
        success: true,
        devMode: true,
        data: {
          requests: [
            {
              id: 'dev-request-1',
              userEmail: 'user1@example.com',
              userHandle: 'user1',
              note: 'I would love to join your room!',
              status: 'pending',
              createdAt: new Date().toISOString()
            },
            {
              id: 'dev-request-2',
              userEmail: 'user2@example.com',
              userHandle: 'user2',
              note: 'Looking forward to connecting',
              status: 'pending',
              createdAt: new Date(Date.now() - 3600000).toISOString()
            }
          ],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 2
          }
        }
      });
    }

    // Validate status parameter
    const validStatuses = ['pending', 'approved', 'rejected', 'all'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: pending, approved, rejected, all'
      });
    }

    // Build query based on status filter
    let query;
    if (status === 'all') {
      query = sql`
        SELECT 
          id, user_email, user_handle, note, status, created_at
        FROM join_requests
        WHERE creator_id = ${creator.id}
        ORDER BY created_at DESC
        LIMIT ${parseInt(limit)}
        OFFSET ${offset}
      `;
    } else {
      query = sql`
        SELECT 
          id, user_email, user_handle, note, status, created_at
        FROM join_requests
        WHERE creator_id = ${creator.id}
          AND status = ${status}
        ORDER BY created_at DESC
        LIMIT ${parseInt(limit)}
        OFFSET ${offset}
      `;
    }

    const result = await query;

    // Get total count for pagination
    let countQuery;
    if (status === 'all') {
      countQuery = sql`
        SELECT COUNT(*) as count
        FROM join_requests
        WHERE creator_id = ${creator.id}
      `;
    } else {
      countQuery = sql`
        SELECT COUNT(*) as count
        FROM join_requests
        WHERE creator_id = ${creator.id}
          AND status = ${status}
      `;
    }

    const countResult = await countQuery;
    const totalCount = parseInt(countResult.rows[0]?.count || 0);

    // Format response
    const requests = result.rows.map(row => ({
      id: row.id,
      userEmail: row.user_email,
      userHandle: row.user_handle,
      note: row.note,
      status: row.status,
      createdAt: row.created_at
    }));

    return res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount
        }
      }
    });

  } catch (error) {
    console.error('Error fetching join requests:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching join requests'
    });
  }
};
