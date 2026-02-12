import { requireAuth, getCreatorByUserId } from '../../_utils/auth';
import { sql } from '@vercel/postgres';

/**
 * GET /api/creator/requests
 * List join requests for the authenticated creator
 */
export async function GET(req) {
  try {
    // Require authentication
    const { user, error } = await requireAuth(req);
    if (error) return error;

    // Get creator for this user
    const creator = await getCreatorByUserId(user.id);
    
    if (!creator) {
      return new Response(
        JSON.stringify({
          error: 'Forbidden',
          message: 'You must be a creator to access this endpoint'
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Check if database is configured
    const hasDatabase = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!hasDatabase) {
      // Development mode: return mock data
      console.log('DEV_NO_DB: Returning mock join requests for creator:', creator.id);
      
      return new Response(
        JSON.stringify({
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
              page,
              limit,
              total: 2
            }
          }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate status parameter
    const validStatuses = ['pending', 'approved', 'rejected', 'all'];
    if (!validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid status',
          message: 'Status must be one of: pending, approved, rejected, all'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
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
        LIMIT ${limit}
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
        LIMIT ${limit}
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

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          requests,
          pagination: {
            page,
            limit,
            total: totalCount
          }
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error fetching join requests:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'An error occurred while fetching join requests'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
