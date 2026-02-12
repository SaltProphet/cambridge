# Phase 2b: Authentication & Creator Control Flow Implementation

## Overview

Phase 2b implements the authentication system and creator control flow for managing join requests. This builds on Phase 2a by adding authentication, request approval/rejection, and access token generation.

## Architecture

### Dual API Implementation

All APIs are implemented in two locations for maximum compatibility:

1. **Next.js App Router** (`app/api/`)
   - Works with `npm run dev` local development
   - Integrates with Next.js production build
   - Uses Next.js Request/Response objects

2. **Vercel Serverless Functions** (`api/`)
   - Standalone serverless functions
   - Direct Vercel deployment compatibility
   - Uses standard Vercel request/response objects

Both implementations provide identical functionality and are maintained in parallel.

## Authentication System

### JWT-Based Authentication

Phase 2b implements JWT (JSON Web Token) based authentication using the `jsonwebtoken` library.

**Key Features:**
- Token generation with configurable expiry
- Token verification and validation
- User authentication from request headers
- Development mode fallback without database

### Authentication Utilities

Located in: `api/_utils/auth.js` and `app/api/_utils/auth.js`

**Functions:**

#### `generateToken(user)`
Generates a JWT token for a user.

```javascript
const token = generateToken({
  id: user.id,
  email: user.email
});
```

#### `verifyToken(token)`
Verifies and decodes a JWT token.

```javascript
const decoded = verifyToken(token);
// Returns: { userId, email, createdAt, iat, exp }
```

#### `authenticate(req)`
Authenticates a request by extracting and verifying the JWT token from the Authorization header.

```javascript
const user = await authenticate(req);
// Returns: { id, email, createdAt } or null
```

Supports two header formats:
- `Authorization: Bearer <token>`
- `Authorization: <token>`

#### `getCreatorByUserId(userId)`
Fetches creator information for a user ID.

```javascript
const creator = await getCreatorByUserId(user.id);
// Returns: { id, userId, slug, createdAt } or null
```

#### `requireAuth(req, res)` (Vercel) or `requireAuth(req)` (Next.js)
Middleware helper that requires authentication and returns 401 if not authenticated.

```javascript
// Vercel version
const user = await requireAuth(req, res);
if (!user) return; // Already sent 401 response

// Next.js version
const { user, error } = await requireAuth(req);
if (error) return error; // Return error response
```

## API Endpoints

### 1. Creator Public Information

**GET /api/creator/public-info**

Get public information about a creator.

**Query Parameters:**
- `creatorSlug` - Creator's unique slug
- `slug` - Alias for creatorSlug
- `creator_slug` - Snake case alias

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "username": "johndoe",
    "displayName": "John Doe",
    "bio": "Tech creator and educator",
    "tier": "premium",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
}
```

**Database Query:**
```sql
SELECT 
  c.slug as username,
  c.display_name,
  c.bio,
  c.avatar_url,
  c.tier,
  c.is_active
FROM creators c
WHERE LOWER(c.slug) = LOWER($1)
LIMIT 1
```

### 2. List Join Requests

**GET /api/creator/requests**

🔒 **Requires Authentication**

List all join requests for the authenticated creator.

**Query Parameters:**
- `status` - Filter by status: `pending`, `approved`, `rejected`, `all` (default: `pending`)
- `page` - Page number for pagination (default: `1`)
- `limit` - Results per page (default: `20`, max: `100`)

**Headers:**
- `Authorization: Bearer <token>` - JWT token

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "uuid",
        "userEmail": "user@example.com",
        "userHandle": "username",
        "note": "I'd love to join!",
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42
    }
  }
}
```

### 3. Approve Join Request

**POST /api/creator/requests-approve**

🔒 **Requires Authentication**

Approve a pending join request.

**Headers:**
- `Authorization: Bearer <token>` - JWT token

**Request Body:**
```json
{
  "requestId": "uuid"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "requestId": "uuid",
    "status": "approved",
    "approvedAt": "2024-01-15T10:35:00Z",
    "accessToken": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresAt": "2024-01-22T10:35:00Z"
    }
  }
}
```

**Note:** The `accessToken` field is automatically generated when the request is approved. If token generation fails, the approval still succeeds but the `accessToken` field will be omitted.

**Business Logic:**
1. Verify user is authenticated
2. Verify user is a creator
3. Verify request exists and belongs to creator
4. Verify request is in `pending` status
5. Update status to `approved`
6. Automatically generate access token for approved user
7. Return approval confirmation with access token

### 4. Reject Join Request

**POST /api/creator/requests-reject**

🔒 **Requires Authentication**

Reject a pending join request.

**Headers:**
- `Authorization: Bearer <token>` - JWT token

**Request Body:**
```json
{
  "requestId": "uuid",
  "reason": "Optional rejection reason"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "requestId": "uuid",
    "status": "rejected",
    "rejectedAt": "2024-01-15T10:35:00Z",
    "reason": "Not accepting new members at this time"
  }
}
```

### 5. Generate Access Token

**POST /api/tokens/generate**

Generate an access token for an approved join request.

**Request Body:**
```json
{
  "joinRequestId": "uuid",
  "expiresInDays": 7
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-01-22T10:35:00Z",
    "joinRequestId": "uuid"
  }
}
```

**Response (Existing Token):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-01-22T10:35:00Z",
    "joinRequestId": "uuid",
    "existing": true
  }
}
```

**Business Logic:**
1. Verify join request exists
2. Verify request is `approved`
3. Check if unexpired token already exists (return existing if found)
4. Generate new JWT token
5. Store token in database with expiration
6. Return token to caller

### 6. Revoke Access Token

**POST /api/tokens/revoke**

🔒 **Requires Authentication**

Revoke access token(s) for a join request.

**Headers:**
- `Authorization: Bearer <token>` - JWT token

**Request Body:**
```json
{
  "tokenId": "uuid"
}
```

Or revoke all tokens for a join request:
```json
{
  "joinRequestId": "uuid"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "revoked": true,
    "revokedAt": "2024-01-15T10:40:00Z",
    "tokensAffected": 1
  }
}
```

**Business Logic:**
1. Verify user is authenticated
2. Verify user is a creator
3. Verify token/request belongs to creator
4. Update token expiration to NOW (effectively revoking)
5. Return revocation confirmation

## Database Schema

### Updated Tables

#### users (assumed to exist)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### creators (updated)
```sql
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  slug VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(500),
  tier VARCHAR(50) DEFAULT 'free',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_creators_slug ON creators(slug);
CREATE INDEX idx_creators_user_id ON creators(user_id);
```

#### join_requests (updated)
```sql
CREATE TABLE join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id),
  creator_id UUID REFERENCES creators(id),
  user_email VARCHAR(255) NOT NULL,
  user_handle VARCHAR(255) NOT NULL,
  note TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_join_requests_creator_id ON join_requests(creator_id);
CREATE INDEX idx_join_requests_status ON join_requests(status);
```

#### access_tokens (new)
```sql
CREATE TABLE access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  join_request_id UUID NOT NULL REFERENCES join_requests(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_access_tokens_join_request ON access_tokens(join_request_id);
CREATE INDEX idx_access_tokens_expires ON access_tokens(expires_at);
```

## Environment Variables

Add to `.env.local` for development:

```env
# Database
POSTGRES_URL=postgres://user:password@host:port/database
# OR
DATABASE_URL=postgres://user:password@host:port/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# Optional
NEXT_PUBLIC_APP_NAME=CamBridge
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development Mode

When database is not configured (no `POSTGRES_URL` or `DATABASE_URL`), all APIs operate in development fallback mode:

1. Authentication returns mock user data
2. Database queries return mock data
3. All operations are logged with `DEV_NO_DB` prefix
4. Responses include `devMode: true` flag

This allows frontend development and testing without requiring database setup.

## Security Features

### SQL Injection Prevention

All database queries use parameterized queries via @vercel/postgres template literals:

```javascript
// ✅ CORRECT - Parameterized query
await sql`SELECT * FROM creators WHERE slug = ${userInput}`;

// ❌ WRONG - String concatenation (vulnerable)
await sql`SELECT * FROM creators WHERE slug = '${userInput}'`;
```

### Authentication Requirements

Endpoints that modify data require authentication:
- ✅ List join requests - authenticated creator only
- ✅ Approve/reject requests - authenticated creator only
- ✅ Revoke tokens - authenticated creator only
- ❌ Create join request - no authentication (public)
- ❌ Get creator info - no authentication (public)

### Authorization Checks

All creator endpoints verify:
1. User is authenticated
2. User is a creator
3. Resource belongs to the creator
4. Request is in valid state for operation

## Testing

### Local Testing

1. Start dev server: `npm run dev`
2. Use curl or Postman to test endpoints

### Generate a Test Token

```bash
# In Node.js REPL or test script
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { userId: 'test-user-id', email: 'test@example.com' },
  process.env.JWT_SECRET || 'dev-secret-change-in-production',
  { expiresIn: '7d' }
);
console.log(token);
```

### Test Authenticated Endpoints

```bash
# List join requests
curl -X GET http://localhost:3000/api/creator/requests \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"

# Approve a request
curl -X POST http://localhost:3000/api/creator/requests-approve \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"requestId":"uuid"}'

# Reject a request
curl -X POST http://localhost:3000/api/creator/requests-reject \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"requestId":"uuid","reason":"Not accepting new members"}'
```

### Test Token Endpoints

```bash
# Generate token
curl -X POST http://localhost:3000/api/tokens/generate \
  -H "Content-Type: application/json" \
  -d '{"joinRequestId":"uuid","expiresInDays":7}'

# Revoke token
curl -X POST http://localhost:3000/api/tokens/revoke \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"tokenId":"uuid"}'
```

## Next Steps (Phase 2c+)

Future enhancements:

1. **Notifications**
   - Email notifications for new requests
   - Email notifications for approvals/rejections
   - Webhook support for external integrations

2. **Rate Limiting**
   - Prevent abuse of join request endpoint
   - IP-based rate limiting
   - Creator-specific rate limits

3. **Enhanced Token Management**
   - Token refresh mechanism
   - Token scopes and permissions
   - Token usage tracking

4. **User Registration**
   - User signup endpoint
   - Password hashing (bcryptjs)
   - Email verification

5. **Room Management**
   - Create/edit/delete rooms
   - Room-specific join requests
   - Room capacity limits

## Files Modified/Added

```
api/
├── _utils/
│   └── auth.js              (updated - full JWT auth implementation)
├── creator/
│   ├── public-info.js       (updated - database integration)
│   ├── requests.js          (new - list requests)
│   ├── requests-approve.js  (new - approve requests)
│   └── requests-reject.js   (new - reject requests)
└── tokens/
    ├── generate.js          (new - generate tokens)
    └── revoke.js            (new - revoke tokens)

app/api/
├── _utils/
│   └── auth.js              (updated - full JWT auth implementation)
├── creator/
│   ├── public-info/
│   │   └── route.js         (new - database integration)
│   ├── requests/
│   │   └── route.js         (new - list requests)
│   ├── requests-approve/
│   │   └── route.js         (new - approve requests)
│   └── requests-reject/
│       └── route.js         (new - reject requests)
└── tokens/
    ├── generate/
    │   └── route.js         (new - generate tokens)
    └── revoke/
        └── route.js         (new - revoke tokens)

.env.example                 (updated - JWT variables)
package.json                 (updated - jsonwebtoken dependency)
PHASE_2B_IMPLEMENTATION.md   (new - this document)
```

## Build & Deploy

- ✅ Linting: No errors
- ⏳ Build: Pending test
- ⏳ Code Review: Pending
- ⏳ Security Scan: Pending

Ready for testing and review.
