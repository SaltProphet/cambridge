import { sql } from '@vercel/postgres';
import { generateToken } from '../../_utils/auth';

/**
 * POST /api/tokens/generate
 * Generate access token for an approved join request
 */
export async function POST(req) {
  try {
    // Parse request body
    const body = await req.json();
    const { joinRequestId, expiresInDays = 7 } = body;

    if (!joinRequestId) {
      return new Response(
        JSON.stringify({
          error: 'Missing join request ID',
          message: 'Please provide a joinRequestId in the request body'
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
      // Development mode: return mock token
      console.log('DEV_NO_DB: Generating mock access token for join request:', joinRequestId);
      
      const mockToken = generateToken({
        id: 'dev-user-id',
        email: 'dev@example.com'
      });

      return new Response(
        JSON.stringify({
          success: true,
          devMode: true,
          data: {
            token: mockToken,
            expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
            joinRequestId
          }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify the join request exists and is approved
    const requestResult = await sql`
      SELECT jr.id, jr.user_email, jr.status, jr.creator_id
      FROM join_requests jr
      WHERE jr.id = ${joinRequestId}
      LIMIT 1
    `;

    if (requestResult.rows.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Join request not found',
          message: 'No join request found with that ID'
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const joinRequest = requestResult.rows[0];

    // Verify the request is approved
    if (joinRequest.status !== 'approved') {
      return new Response(
        JSON.stringify({
          error: 'Request not approved',
          message: 'Cannot generate token for a request that is not approved'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
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
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            token: existingToken.token,
            expiresAt: existingToken.expires_at,
            joinRequestId,
            existing: true
          }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
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

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          token,
          expiresAt: expiresAt.toISOString(),
          joinRequestId
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error generating access token:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'An error occurred while generating the access token'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
