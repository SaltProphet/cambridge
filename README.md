# CamBridge

Enterprise 1-to-1 cam sharing system with cost controls and security.

## 🚀 Live Demo

Visit the deployed application at: **[https://cam-bridge.vercel.app](https://cam-bridge.vercel.app)**

## Overview

CamBridge is a Next.js 15 application for managing 1-to-1 video sessions with granular usage caps, billing controls, and enterprise security features. Phase 2B adds authentication, creator control flow, and access token management.

## Features

### Phase 1: Frontend UI ✅
- ✅ **Landing Page**: Hero section, pricing tiers, and security posture
- ✅ **Founders Application**: Intake form for new creator applications
- ✅ **Creator Dashboard**: Overview metrics, recent activity, usage breakdown
- ✅ **Room Management**: View and manage video rooms
- ✅ **Usage Tracking**: Monitor caps, warnings, and feature degradation states
- ✅ **Admin Panel**: Global cap management, creator usage table, freeze/override controls
- ✅ **Enterprise Design**: Open-space aesthetic with minimal chroma, CSS var-based theming

### Phase 2A: Join Request API ✅
- ✅ **Join Request Creation**: POST /api/join-requests endpoint
- ✅ **Database Integration**: PostgreSQL with @vercel/postgres
- ✅ **Development Mode**: Works without database configuration
- ✅ **Dual API Implementation**: Next.js App Router + Vercel Serverless

### Phase 2B: Authentication & Creator Control ✅
- ✅ **JWT Authentication**: Token generation, verification, and validation
- ✅ **Creator Public Info**: GET /api/creator/public-info endpoint
- ✅ **List Join Requests**: GET /api/creator/requests with pagination
- ✅ **Approve/Reject Requests**: POST endpoints for request management
- ✅ **Access Token System**: Generate and revoke access tokens
- ✅ **Auto-Token Generation**: Tokens automatically generated on approval
- ✅ **Database Schema**: Users, creators, join_requests, access_tokens tables
- ✅ **Security**: SQL injection protection, authentication, authorization

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: JWT (jsonwebtoken)
- **Database**: PostgreSQL with @vercel/postgres
- **Styling**: Tailwind CSS with custom design tokens
- **Components**: shadcn/ui (Radix UI primitives)
- **Language**: TypeScript & JavaScript
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SaltProphet/cambridge.git
cd cambridge
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local

# Edit .env.local and add:
# JWT_SECRET=your-super-secret-key-here
# POSTGRES_URL=your-database-url (optional for development)
```

4. (Optional) Set up database:
```bash
# If you have PostgreSQL, run the migration
psql -h host -U user -d database -f database/migrations/001_phase_2b_schema.sql

# Or use Vercel Postgres and run the migration via dashboard
```

5. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

### Public Endpoints

**POST /api/join-requests**
Create a join request to a creator's room.

**GET /api/creator/public-info**
Get public information about a creator.

### Authenticated Endpoints (Require JWT)

**GET /api/creator/requests**
List join requests for authenticated creator.

**POST /api/creator/requests-approve**
Approve a pending join request.

**POST /api/creator/requests-reject**
Reject a pending join request.

**POST /api/tokens/generate**
Generate access token for approved request.

**POST /api/tokens/revoke**
Revoke an access token.

See [PHASE_2B_IMPLEMENTATION.md](PHASE_2B_IMPLEMENTATION.md) for detailed API documentation.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The application is automatically deployed to Vercel at **cam-bridge.vercel.app** when changes are pushed to the main branch.

For detailed deployment instructions and setup, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Project Structure

```
cambridge/
├── app/                    # Next.js App Router pages
│   ├── api/               # Next.js API routes (Phase 2+)
│   │   ├── creator/       # Creator management endpoints
│   │   ├── tokens/        # Token management endpoints
│   │   ├── join-requests/ # Join request creation
│   │   └── _utils/        # Shared API utilities
│   ├── dashboard/         # Creator dashboard pages
│   │   ├── admin/        # Admin management page
│   │   ├── rooms/        # Room management page
│   │   ├── usage/        # Usage tracking page
│   │   └── page.tsx      # Dashboard overview
│   ├── founders/         # Founder application page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── api/                   # Vercel Serverless Functions (Phase 2+)
│   ├── creator/          # Creator management endpoints
│   ├── tokens/           # Token management endpoints
│   ├── join-requests.js  # Join request creation
│   └── _utils/           # Shared utilities
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components (header, footer, nav)
│   └── metric-card.tsx   # Reusable metric card
├── database/
│   ├── migrations/       # SQL migration scripts
│   └── README.md         # Migration guide
├── lib/
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Design System

### Color Scheme

The application uses a dark theme with a single accent color that can be easily customized via CSS variables in `app/globals.css`:

- **Background**: Near-black (`--background`)
- **Cards/Panels**: Slightly elevated with subtle borders (`--card`)
- **Accent**: Primary brand color (`--accent`) - change this for instant rebranding
- **Borders**: Thin, subtle borders using `--border`

### Spacing

- Wide gutters and generous padding for an open-space feel
- Consistent 6-8 unit spacing scale
- Container-based layouts with responsive breakpoints

### Typography

- Inter font family
- Clear hierarchy with semantic heading sizes
- Muted foreground colors for secondary text

## Phase 2B Implementation

Phase 2B adds authentication and creator control flow:

- **Authentication**: JWT-based token system
- **Creator APIs**: Public info, request management
- **Access Tokens**: Generation and revocation
- **Database**: Full PostgreSQL integration
- **Security**: SQL injection protection, authorization

See [PHASE_2B_IMPLEMENTATION.md](PHASE_2B_IMPLEMENTATION.md) for complete documentation.

## Development Mode

CamBridge supports development without database configuration. When `POSTGRES_URL` or `DATABASE_URL` is not set:
- APIs return mock data
- All operations are logged to console
- Responses include `devMode: true` flag
- Full functionality for frontend development

## Phase 1 Limitations (Removed in Phase 2+)

These limitations from Phase 1 have been addressed:

- ❌ ~~No database or data persistence~~ ✅ PostgreSQL integration
- ❌ ~~No API endpoints or backend logic~~ ✅ 8 API endpoints implemented
- ❌ ~~No authentication or authorization~~ ✅ JWT authentication system
- ❌ No video room integration (Phase 3+)
- ❌ All forms and controls are disabled/read-only stubs (updating in Phase 3+)

## Future Phases

### Phase 2C: Notifications
- Email notifications for join requests
- Approval/rejection notifications
- Webhook support

### Phase 2D: Rate Limiting
- IP-based rate limiting
- Request throttling
- Abuse prevention

### Phase 3: User Registration & Video Integration
- User signup and authentication
- Password management
- WebRTC video integration
- Real-time features

## Phase 1 Limitations

This is a **UI-first implementation** with the following intentional limitations:

- ❌ No database or data persistence
- ❌ No API endpoints or backend logic
- ❌ No authentication or authorization
- ❌ No video room integration
- ❌ All forms and controls are disabled/read-only stubs

These features will be implemented in Phase 2+.

## Customization

### Changing the Accent Color

Edit `app/globals.css` and update the `--accent` CSS variable:

```css
:root {
  --accent: 217 91% 60%; /* HSL values */
}
```

### Adding New Pages

Use the Next.js App Router structure:

```bash
mkdir app/your-page
touch app/your-page/page.tsx
```

### Extending Components

All UI components are in `components/ui/` and can be customized or extended.

## Contributing

This project is actively developed. Current implementation status:

- ✅ Phase 1: Frontend UI - Complete
- ✅ Phase 2A: Join Request API - Complete
- ✅ Phase 2B: Authentication & Creator Control - Complete
- 🚧 Phase 2C: Notifications - Planned
- 🚧 Phase 2D: Rate Limiting - Planned
- 🚧 Phase 3: User Registration & Video - Planned

For production deployment, see [DEPLOYMENT.md](DEPLOYMENT.md) and [QUICKSTART.md](QUICKSTART.md).

## Documentation

- [README.md](README.md) - This file
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [QUICKSTART.md](QUICKSTART.md) - Quick deployment guide
- [ROADMAP.md](ROADMAP.md) - Project roadmap
- [PHASE_2A_IMPLEMENTATION.md](PHASE_2A_IMPLEMENTATION.md) - Join request API docs
- [PHASE_2B_IMPLEMENTATION.md](PHASE_2B_IMPLEMENTATION.md) - Authentication & control flow docs
- [PHASE_2B_SUMMARY.md](PHASE_2B_SUMMARY.md) - Phase 2B implementation summary
- [database/README.md](database/README.md) - Database migration guide

## License

MIT

## Support

For questions or issues, please open a GitHub issue.
