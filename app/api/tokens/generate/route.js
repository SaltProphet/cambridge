import { sql } from '@vercel/postgres';
import { generateToken } from '../../_utils/auth';
import { generateAccessToken } from '../../_utils/tokens';

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

    // Use the helper function to generate the token
    const result = await generateAccessToken(joinRequestId, expiresInDays);

    if (!result.success) {
      if (result.error === 'Join request not found') {
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
      } else if (result.error === 'Request not approved') {
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
      } else {
        return new Response(
          JSON.stringify({
            error: 'Internal server error',
            message: result.error || 'An error occurred while generating the access token'
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        devMode: result.devMode,
        data: {
          token: result.token,
          expiresAt: result.expiresAt,
          joinRequestId,
          existing: result.existing
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
