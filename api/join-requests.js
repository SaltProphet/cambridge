import { sql } from '@vercel/postgres';
import { parseCreatorSlugFromPath } from './_utils/paths.js';

/**
 * POST /api/join-requests
 * Create a new join request for a creator's room
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse request body
    const { email, handle, note, creatorSlug: bodyCreatorSlug } = req.body;

    // Validate required fields
    if (!email || !handle) {
      return res.status(400).json({ 
        error: 'Missing required fields: email and handle are required' 
      });
    }

    // Determine creator slug from path or body
    const creatorSlug = parseCreatorSlugFromPath(req) || bodyCreatorSlug;
    
    if (!creatorSlug) {
      return res.status(400).json({ 
        error: 'Creator slug is required (via URL path or request body)' 
      });
    }

    // Check if database is configured
    const isDbConfigured = process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (!isDbConfigured) {
      // Dev fallback mode - log and return success
      const devPayload = {
        creatorSlug,
        email,
        handle,
        note: note || null,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      console.log('DEV_NO_DB - Join request would be created:', devPayload);
      
      return res.status(200).json({
        success: true,
        devLogged: true,
        id: `dev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        message: 'Development mode: Request logged to console (no database configured)'
      });
    }

    // Database operations
    try {
      // Find creator by slug
      const creatorResult = await sql`
        SELECT id, user_id 
        FROM creators 
        WHERE LOWER(slug) = LOWER(${creatorSlug})
        LIMIT 1
      `;

      if (creatorResult.rows.length === 0) {
        return res.status(404).json({ 
          error: `Creator not found with slug: ${creatorSlug}` 
        });
      }

      const creator = creatorResult.rows[0];
      const creatorId = creator.id;

      // Find default room for creator (first room)
      const roomResult = await sql`
        SELECT id 
        FROM rooms 
        WHERE creator_id = ${creatorId}
        ORDER BY created_at ASC
        LIMIT 1
      `;

      if (roomResult.rows.length === 0) {
        return res.status(400).json({ 
          error: 'No rooms found for this creator' 
        });
      }

      const roomId = roomResult.rows[0].id;

      // Insert join request with parameterized query
      const insertResult = await sql`
        INSERT INTO join_requests (
          id,
          room_id,
          creator_id,
          user_email,
          user_handle,
          note,
          status,
          created_at
        ) VALUES (
          gen_random_uuid(),
          ${roomId},
          ${creatorId},
          ${email},
          ${handle},
          ${note || null},
          'pending',
          NOW()
        )
        RETURNING id, status
      `;

      const joinRequest = insertResult.rows[0];

      return res.status(200).json({
        success: true,
        id: joinRequest.id,
        status: joinRequest.status
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ 
        error: 'Database operation failed',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

  } catch (error) {
    console.error('Request error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
