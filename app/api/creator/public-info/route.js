import { parseCreatorSlugFromPath } from '../../_utils/paths';
import { sql } from '@vercel/postgres';

/**
 * GET /api/creator/public-info
 * Get public information for a creator
 */
export async function GET(req) {
  try {
    // Parse creator slug from request
    const creatorSlug = parseCreatorSlugFromPath(req);

    if (!creatorSlug) {
      return new Response(
        JSON.stringify({
          error: 'Missing creator slug',
          message: 'Please provide a creator slug via query parameter or URL path'
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
      // Development mode: return mock data
      console.log('DEV_NO_DB: Returning mock creator info for slug:', creatorSlug);
      
      const mockCreators = {
        'testcreator': {
          username: 'testcreator',
          displayName: 'Test Creator',
          bio: 'A test creator account',
          tier: 'free',
          avatarUrl: null
        }
      };

      const creator = mockCreators[creatorSlug];

      if (!creator) {
        return new Response(
          JSON.stringify({
            error: 'Creator not found',
            message: `No creator found with slug: ${creatorSlug}`,
            devMode: true
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          devMode: true,
          data: {
            username: creator.username,
            displayName: creator.displayName,
            bio: creator.bio,
            tier: creator.tier,
            avatarUrl: creator.avatarUrl
          }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Query database for creator information
    const result = await sql`
      SELECT 
        c.slug as username,
        c.display_name,
        c.bio,
        c.avatar_url,
        c.tier,
        c.is_active
      FROM creators c
      WHERE LOWER(c.slug) = LOWER(${creatorSlug})
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Creator not found',
          message: `No creator found with slug: ${creatorSlug}`
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const creator = result.rows[0];

    // Check if creator is active
    if (!creator.is_active) {
      return new Response(
        JSON.stringify({
          error: 'Creator not found',
          message: `Creator account is not active`
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Return public creator information
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          username: creator.username,
          displayName: creator.display_name,
          bio: creator.bio,
          tier: creator.tier,
          avatarUrl: creator.avatar_url
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error fetching creator info:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'An error occurred while fetching creator information'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
