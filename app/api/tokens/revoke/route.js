import { requireAuth, getCreatorByUserId } from '../../_utils/auth';
import { sql } from '@vercel/postgres';

/**
 * POST /api/tokens/revoke
 * Revoke an access token
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
    const { tokenId, joinRequestId } = body;

    if (!tokenId && !joinRequestId) {
      return new Response(
        JSON.stringify({
          error: 'Missing identifier',
          message: 'Please provide either tokenId or joinRequestId in the request body'
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
      console.log('DEV_NO_DB: Revoking token:', tokenId || joinRequestId);
      
      return new Response(
        JSON.stringify({
          success: true,
          devMode: true,
          data: {
            revoked: true,
            revokedAt: new Date().toISOString()
          }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
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
        return new Response(
          JSON.stringify({
            error: 'Token not found',
            message: 'No token found with that ID or you do not have permission to revoke it'
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
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
        return new Response(
          JSON.stringify({
            error: 'Join request not found',
            message: 'No join request found with that ID or you do not have permission to revoke its tokens'
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Revoke all tokens for this join request
      revokeResult = await sql`
        UPDATE access_tokens
        SET expires_at = NOW()
        WHERE join_request_id = ${joinRequestId}
          AND expires_at > NOW()
      `;
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          revoked: true,
          revokedAt: new Date().toISOString(),
          tokensAffected: revokeResult.rowCount || 0
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error revoking token:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'An error occurred while revoking the token'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
