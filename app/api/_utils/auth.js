/**
 * Authentication utilities for Next.js API routes
 * Phase 2b implementation with JWT-based authentication
 */

import jwt from 'jsonwebtoken';
import { sql } from '@vercel/postgres';

// JWT secret from environment or fallback for development
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'; // Default 7 days

/**
 * Generate JWT token for a user
 * @param {Object} user - User object with id, email, and optional metadata
 * @returns {string} - JWT token
 */
export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      createdAt: Date.now()
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.warn('Token verification failed:', error.message);
    return null;
  }
}

/**
 * Extract token from request headers
 * Supports: Authorization: Bearer <token> or Authorization: <token>
 * @param {Request} req - Next.js request object
 * @returns {string|null} - Token string or null
 */
function extractTokenFromRequest(req) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  
  if (!authHeader) {
    return null;
  }

  // Handle "Bearer <token>" format
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Handle direct token format
  return authHeader;
}

/**
 * Authenticate a request
 * @param {Request} req - Next.js request object
 * @returns {Promise<Object|null>} - User object if authenticated, null otherwise
 */
export async function authenticate(req) {
  try {
    // Extract token from request
    const token = extractTokenFromRequest(req);
    
    if (!token) {
      return null;
    }

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      return null;
    }

    // Check if database is configured
    const hasDatabase = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!hasDatabase) {
      // Development mode: return mock user
      console.log('DEV_NO_DB: Returning mock authenticated user');
      return {
        id: decoded.userId,
        email: decoded.email,
        devMode: true
      };
    }

    // Query database for user
    const result = await sql`
      SELECT id, email, created_at, is_active
      FROM users
      WHERE id = ${decoded.userId}
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      console.warn('User authentication failed: account is inactive');
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.created_at
    };

  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Get creator by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} - Creator object if found, null otherwise
 */
export async function getCreatorByUserId(userId) {
  try {
    // Check if database is configured
    const hasDatabase = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!hasDatabase) {
      // Development mode: return mock creator
      console.log('DEV_NO_DB: Returning mock creator for userId:', userId);
      return {
        id: 'dev-creator-id',
        userId: userId,
        slug: 'testcreator',
        devMode: true
      };
    }

    // Query database for creator
    const result = await sql`
      SELECT id, user_id, slug, created_at
      FROM creators
      WHERE user_id = ${userId}
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return null;
    }

    const creator = result.rows[0];

    return {
      id: creator.id,
      userId: creator.user_id,
      slug: creator.slug,
      createdAt: creator.created_at
    };

  } catch (error) {
    console.error('Error fetching creator by user ID:', error);
    return null;
  }
}

/**
 * Require authentication middleware for Next.js route handlers
 * Use this to protect endpoints that require authentication
 * @param {Request} req - Request object
 * @returns {Promise<{user: Object|null, error: Response|null}>}
 */
export async function requireAuth(req) {
  const user = await authenticate(req);
  
  if (!user) {
    return {
      user: null,
      error: new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'Authentication required. Please provide a valid token.'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    };
  }
  
  return { user, error: null };
}
