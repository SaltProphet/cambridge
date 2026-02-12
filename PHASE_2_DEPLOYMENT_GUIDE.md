# Phase 2 Deployment Guide

## Overview

This guide covers the Phase 2 functionality that has been implemented and is ready for deployment. All form submission features are now functional and integrated with the Phase 2 APIs.

## What's Been Implemented

### 1. Join Request Form (room.html)

**Location**: `/r/:creatorSlug` (via vercel.json rewrite to `/room.html`)

**Features**:
- Form to request access to a creator's room
- Fields: Email, Handle, Note (optional)
- Auto-extracts creator slug from URL path
- Fetches and displays creator name from `/api/creator/public-info`
- Submits to `/api/join-requests` API
- Success/error message display
- Works in development mode (logs to console when no database)

**Testing**:
```bash
# Visit: https://cam-bridge.vercel.app/r/testcreator
# Fill out the form and submit
# Should see success message in development mode
```

### 2. Creator Signup Form (creator-signup.html)

**Location**: `/creator/register` (via vercel.json rewrite)

**Features**:
- Form with Email, Username, Password fields
- Client-side password validation (minimum 8 characters)
- Informative message that user registration is coming in Phase 3
- Placeholder for future `/api/auth/register` endpoint

**Note**: This form currently shows a "coming in Phase 3" message as user registration APIs are not yet implemented. The form is ready and will work once Phase 3 authentication is added.

### 3. Creator Login Form (creator-login.html)

**Location**: `/creator/login` (via vercel.json rewrite)

**Features**:
- Form with Email and Password fields
- Informative message that user authentication is coming in Phase 3
- Placeholder for future `/api/auth/login` endpoint
- Token storage placeholder for future authentication

**Note**: Like signup, this form shows a "coming in Phase 3" message. The form structure is ready for Phase 3 implementation.

### 4. Creator Dashboard (creator-dashboard.html)

**Location**: `/creator/dashboard` (via vercel.json rewrite)

**Features**:
- Checks localStorage for auth token
- Dynamic content loading (placeholder for Phase 3)
- Ready to integrate with `/api/creator/requests` when authenticated
- Shows appropriate message when not authenticated

## Deployment Checklist

### Pre-Deployment

- [x] All static HTML forms have JavaScript submission handlers
- [x] Join request form fully functional with Phase 2A API
- [x] Creator signup/login forms ready for Phase 3
- [x] Dashboard ready for Phase 3 authentication
- [x] Build succeeds without errors
- [x] vercel.json rewrites configured correctly

### Deployment Steps

1. **Ensure GitHub Secrets are Set**:
   - `VERCEL_TOKEN` - Your Vercel API token
   - `VERCEL_ORG_ID` - Your Vercel organization ID
   - `VERCEL_PROJECT_ID` - Your Vercel project ID

2. **Push to main/master branch**:
   ```bash
   git push origin main
   ```

3. **GitHub Actions will automatically**:
   - Install dependencies
   - Build the project
   - Deploy to Vercel production

4. **Verify Deployment**:
   - Visit: https://cam-bridge.vercel.app
   - Test join request form: https://cam-bridge.vercel.app/r/testcreator
   - Check creator forms: https://cam-bridge.vercel.app/creator/register

### Post-Deployment Testing

#### Test Join Request Form

1. Visit: `https://cam-bridge.vercel.app/r/testcreator`
2. Fill in:
   - Email: test@example.com
   - Handle: testuser
   - Note: "Test message"
3. Click "Submit Request"
4. Should see success message (in dev mode, will log to console)

#### Test Creator Forms

1. **Signup**: Visit `https://cam-bridge.vercel.app/creator/register`
   - Form should display properly
   - Clicking submit shows Phase 3 message

2. **Login**: Visit `https://cam-bridge.vercel.app/creator/login`
   - Form should display properly
   - Clicking submit shows Phase 3 message

3. **Dashboard**: Visit `https://cam-bridge.vercel.app/creator/dashboard`
   - Should display with placeholder data
   - Shows Phase 3 authentication message

## API Endpoints Available

All Phase 2 endpoints are deployed and functional:

### Public Endpoints (No Auth Required)

- `POST /api/join-requests` - Create a join request
- `GET /api/creator/public-info?creatorSlug={slug}` - Get creator info

### Authenticated Endpoints (Require JWT Token)

- `GET /api/creator/requests` - List join requests (pagination supported)
- `POST /api/creator/requests-approve` - Approve a request
- `POST /api/creator/requests-reject` - Reject a request
- `POST /api/tokens/revoke` - Revoke an access token

### Token Generation

- `POST /api/tokens/generate` - Generate access token for approved request

## Development Mode

The application supports development mode without a database:

- No `POSTGRES_URL` or `DATABASE_URL` environment variable needed
- All requests log to console with `DEV_NO_DB` prefix
- Returns mock IDs and success responses
- Perfect for testing and UI development

## Database Setup (Optional)

For production with database:

1. Set environment variables in Vercel:
   - `POSTGRES_URL` or `DATABASE_URL`

2. Run migrations:
   ```bash
   psql $POSTGRES_URL < database/migrations/001_phase_2b_schema.sql
   ```

3. Database will be used automatically when configured

## Architecture Notes

### Dual API Implementation

All APIs are implemented in two locations:
- `api/` - Vercel serverless functions
- `app/api/` - Next.js App Router

Both provide identical functionality for maximum compatibility.

### Static HTML + Next.js

The application uses a hybrid approach:
- Static HTML pages for creator auth flows (signup, login, dashboard)
- Next.js pages for main application pages
- Room page is static HTML served via vercel.json rewrites

### Form Submission Flow

1. User fills out form
2. JavaScript intercepts submit event
3. Fetch API calls backend endpoint
4. Response displayed as status message
5. Success/error styling based on response

## Future Enhancements (Phase 3)

- User registration and authentication
- JWT token-based auth for creator actions
- Full creator dashboard with real data
- Session management
- Protected routes

## Troubleshooting

### Forms Don't Submit

- Check browser console for errors
- Verify API endpoints are accessible
- Check network tab for failed requests

### Static Pages Not Loading

- Verify vercel.json rewrites are deployed
- Check that files exist in `public/pages/`
- Ensure room.html is in root

### API Errors

- Check environment variables in Vercel
- Verify database connection if using production DB
- Check API logs in Vercel dashboard

## Support

For issues or questions:
1. Check GitHub Actions workflow logs
2. Check Vercel deployment logs
3. Review API documentation in PHASE_2A_IMPLEMENTATION.md and PHASE_2B_IMPLEMENTATION.md
