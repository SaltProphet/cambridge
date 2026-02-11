# CamBridge

Enterprise 1-to-1 cam sharing system with cost controls and security.

## Overview

CamBridge is a Next.js 14 application for managing 1-to-1 video sessions with granular usage caps, billing controls, and enterprise security features. This Phase 1 implementation focuses on the frontend UI with read-only stubs for all functionality.

## Features

- ✅ **Landing Page**: Hero section, pricing tiers, and security posture
- ✅ **Founders Application**: Intake form for new creator applications
- ✅ **Creator Dashboard**: Overview metrics, recent activity, usage breakdown
- ✅ **Room Management**: View and manage video rooms
- ✅ **Usage Tracking**: Monitor caps, warnings, and feature degradation states
- ✅ **Admin Panel**: Global cap management, creator usage table, freeze/override controls
- ✅ **Enterprise Design**: Open-space aesthetic with minimal chroma, CSS var-based theming

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom design tokens
- **Components**: shadcn/ui (Radix UI primitives)
- **Language**: TypeScript
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
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
cambridge/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Creator dashboard pages
│   │   ├── admin/        # Admin management page
│   │   ├── rooms/        # Room management page
│   │   ├── usage/        # Usage tracking page
│   │   └── page.tsx      # Dashboard overview
│   ├── founders/         # Founder application page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components (header, footer, nav)
│   └── metric-card.tsx   # Reusable metric card
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

This is currently a demonstration project. For production use, Phase 2 will add:

- Database schema (Prisma)
- API routes
- Authentication (NextAuth.js)
- Video integration
- Real-time features

## License

MIT

## Support

For questions or issues, please open a GitHub issue.
