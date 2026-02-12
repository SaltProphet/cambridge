# Phase 2a: Join-Request Implementation

## Overview

Phase 2a implements the join-request golden-path milestone, allowing users to request to join a creator's room. This is the first step in the creator-client interaction flow.

## Architecture

### Dual API Implementation

APIs are implemented in two locations for maximum compatibility:

1. **Next.js App Router** (`app/api/`)
   - Works with `npm run dev` local development
   - Integrates with Next.js production build
   - Uses Next.js Request/Response objects

2. **Vercel Serverless Functions** (`api/`)
   - Standalone serverless functions
   - Direct Vercel deployment compatibility
   - Uses standard Vercel request/response objects

Both implementations provide identical functionality and are maintained in parallel.

## API Endpoint

### POST /api/join-requests

Creates a new join request for a creator's room.

**Request Body:**
```json
{
  "email": "user@example.com",
  "handle": "username",
  "note": "Optional message to creator",
  "creatorSlug": "creator-username"
}
```

**Query Parameters (alternative to body):**
- `creatorSlug` - Creator's unique slug
- `slug` - Alias for creatorSlug
- `creator_slug` - Snake case alias

**URL Path Parsing:**
The API also supports extracting creator slug from URL patterns like:
- `/r/:creatorSlug/...`
- `/r/:creatorSlug/:roomSlug/...`

**Response (Success):**
```json
{
  "success": true,
  "id": "uuid-or-dev-id",
  "status": "pending"
}
```

**Response (Dev Mode):**
```json
{
  "success": true,
  "devLogged": true,
  "id": "dev-1234567890-abc123def",
  "status": "pending",
  "message": "Development mode: Request logged to console (no database configured)"
}
```

**Error Responses:**
- `400` - Missing required fields or invalid data
- `404` - Creator not found
- `500` - Server or database error

## Development Mode

When database is not configured (no `POSTGRES_URL` or `DATABASE_URL` environment variable), the API operates in development fallback mode:

1. Validates all input as normal
2. Logs the request payload to console with `DEV_NO_DB` prefix
3. Returns a successful response with a mock ID
4. Sets `devLogged: true` in response

This allows frontend development and testing without requiring database setup.

## Database Schema

### Expected Tables

**creators:**
```sql
CREATE TABLE creators (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**rooms:**
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES creators(id),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**join_requests:**
```sql
CREATE TABLE join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id),
  creator_id UUID REFERENCES creators(id),
  user_email VARCHAR(255) NOT NULL,
  user_handle VARCHAR(255) NOT NULL,
  note TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Utilities

### parseCreatorSlugFromPath(req)

Located in: `api/_utils/paths.js` and `app/api/_utils/paths.js`

Extracts creator slug from request in priority order:
1. Query parameters (`creatorSlug`, `slug`, `creator_slug`)
2. URL path pattern (`/r/:creatorSlug`)
3. Returns `null` if not found

Returns normalized (lowercase, trimmed) slug.

### Authentication Stubs

Located in: `api/_utils/auth.js` and `app/api/_utils/auth.js`

**authenticate(req):**
- Placeholder for Phase 2b
- Currently returns `null`
- Logs warning when called

**getCreatorByUserId(userId):**
- Placeholder for future use
- Currently returns `null`
- Logs warning when called

These stubs are provided for future implementation and documentation.

## Security

### SQL Injection Prevention

All database queries use parameterized queries via @vercel/postgres template literals:

```javascript
// ✅ CORRECT - Parameterized query
await sql`SELECT * FROM creators WHERE slug = ${userInput}`;

// ❌ WRONG - String concatenation (vulnerable)
await sql`SELECT * FROM creators WHERE slug = '${userInput}'`;
```

### Input Validation

- Required fields: `email`, `handle`
- Creator slug must be provided (body, query, or URL path)
- All inputs are validated before database operations
- Proper HTTP status codes for different error conditions

## Testing

### Local Testing

1. Start dev server: `npm run dev`
2. Make POST request to `http://localhost:3000/api/join-requests`

Example using curl:
```bash
curl -X POST http://localhost:3000/api/join-requests \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","handle":"testuser","creatorSlug":"johndoe","note":"Hello!"}'
```

### Test Scenarios

1. ✅ Valid request with all fields
2. ✅ Valid request without note (optional field)
3. ✅ Creator slug in body
4. ✅ Creator slug in query parameter
5. ✅ Missing email (validation error)
6. ✅ Missing handle (validation error)
7. ✅ Missing creator slug (validation error)
8. ✅ Dev mode fallback (no database)

## Environment Variables

Add to `.env.local` for development with database:

```env
# Database configuration
POSTGRES_URL=postgres://user:password@host:port/database
# OR
DATABASE_URL=postgres://user:password@host:port/database
```

If not set, API operates in development fallback mode.

## Next Steps (Phase 2b+)

Future enhancements will include:

1. **Authentication:** Implement `authenticate()` for creator endpoints
2. **Approval Flow:** Creator review and approve/reject endpoints
3. **Token Generation:** Generate access tokens for approved requests
4. **Notifications:** Email/webhook notifications for new requests
5. **Status Tracking:** List and manage join requests
6. **Rate Limiting:** Prevent abuse of join request endpoint

## Files Modified/Added

```
api/
├── _utils/
│   ├── auth.js         (new - auth stubs)
│   └── paths.js        (new - path parsing)
└── join-requests.js    (new - API endpoint)

app/api/
├── _utils/
│   ├── auth.js         (new - auth stubs)
│   └── paths.js        (new - path parsing)
└── join-requests/
    └── route.js        (new - API endpoint)

.env.example            (modified - added DB vars)
package.json            (modified - added @vercel/postgres)
```

## Build & Deploy

- ✅ Linting: No errors
- ✅ Build: Successful
- ✅ Code Review: Passed
- ✅ Security Scan: No vulnerabilities
- ✅ All tests: Passing

Ready for deployment to Vercel.
