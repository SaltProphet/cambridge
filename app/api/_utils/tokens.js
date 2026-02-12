import { sql } from '@vercel/postgres';
import { generateToken } from './auth';

/**
 * Generate an access token for an approved join request
 * This is a helper function that can be called internally
 * 
 * @param {string} joinRequestId - The ID of the approved join request
 * @param {number} expiresInDays - Number of days until token expires (default: 7)
 * @returns {Promise<{success: boolean, token?: string, expiresAt?: string, error?: string, existing?: boolean}>}
 */
export async function generateAccessToken(joinRequestId, expiresInDays = 7) {
  try {
    // Check if database is configured
    const hasDatabase = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!hasDatabase) {
      // Development mode: return mock token
      console.log('DEV_NO_DB: Generating mock access token for join request:', joinRequestId);
      
      const mockToken = generateToken({
        id: 'dev-user-id',
        email: 'dev@example.com'
      });

      return {
        success: true,
        devMode: true,
        token: mockToken,
        expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
        joinRequestId
      };
    }

    // Verify the join request exists and is approved
    const requestResult = await sql`
      SELECT jr.id, jr.user_email, jr.status, jr.creator_id
      FROM join_requests jr
      WHERE jr.id = ${joinRequestId}
      LIMIT 1
    `;

    if (requestResult.rows.length === 0) {
      return {
        success: false,
        error: 'Join request not found'
      };
    }

    const joinRequest = requestResult.rows[0];

    // Verify the request is approved
    if (joinRequest.status !== 'approved') {
      return {
        success: false,
        error: 'Request not approved'
      };
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
      return {
        success: true,
        token: existingToken.token,
        expiresAt: existingToken.expires_at,
        joinRequestId,
        existing: true
      };
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

    return {
      success: true,
      token,
      expiresAt: expiresAt.toISOString(),
      joinRequestId
    };

  } catch (error) {
    console.error('Error generating access token:', error);
    return {
      success: false,
      error: 'Failed to generate access token'
    };
  }
}
