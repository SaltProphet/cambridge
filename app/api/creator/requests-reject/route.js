import { requireAuth, getCreatorByUserId } from '../../_utils/auth';
import { sql } from '@vercel/postgres';

/**
 * POST /api/creator/requests-reject
 * Reject a join request
 */
export async function POST(req) {
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

    // Parse request body
    const body = await req.json();
    const { requestId, reason } = body;

    if (!requestId) {
      return new Response(
        JSON.stringify({
          error: 'Missing request ID',
          message: 'Please provide a requestId in the request body'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if database is configured
    const hasDatabase = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!hasDatabase) {
      // Development mode: return mock response
      console.log('DEV_NO_DB: Rejecting join request:', requestId, 'Reason:', reason);
      
      return new Response(
        JSON.stringify({
          success: true,
          devMode: true,
          data: {
            requestId,
            status: 'rejected',
            rejectedAt: new Date().toISOString(),
            reason: reason || null
          }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify the request belongs to this creator and is pending
    const checkResult = await sql`
      SELECT id, status, creator_id
      FROM join_requests
      WHERE id = ${requestId}
      LIMIT 1
    `;

    if (checkResult.rows.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Request not found',
          message: 'No join request found with that ID'
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const request = checkResult.rows[0];

    // Verify ownership
    if (request.creator_id !== creator.id) {
      return new Response(
        JSON.stringify({
          error: 'Forbidden',
          message: 'You do not have permission to reject this request'
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if already processed
    if (request.status !== 'pending') {
      return new Response(
        JSON.stringify({
          error: 'Request already processed',
          message: `This request has already been ${request.status}`
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Update request status to rejected
    if (reason) {
      await sql`
        UPDATE join_requests
        SET status = 'rejected',
            rejection_reason = ${reason},
            updated_at = NOW()
        WHERE id = ${requestId}
      `;
    } else {
      await sql`
        UPDATE join_requests
        SET status = 'rejected',
            updated_at = NOW()
        WHERE id = ${requestId}
      `;
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          requestId,
          status: 'rejected',
          rejectedAt: new Date().toISOString(),
          reason: reason || null
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error rejecting join request:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'An error occurred while rejecting the join request'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
