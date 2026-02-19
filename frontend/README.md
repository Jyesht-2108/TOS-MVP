# Transport Operations System - Frontend

React TypeScript frontend application for the School Transport Operations System.

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite 5
- **UI Library**: shadcn/ui + Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand + React Query (@tanstack/react-query)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: Sonner (toast notifications)
- **Testing**: Vitest, React Testing Library

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── auth/           # Auth guards (ProtectedRoute, RoleRoute)
│   │   ├── layout/         # Layout components (Header, AppSidebar)
│   │   └── ui/             # shadcn/ui components
│   ├── modules/            # Feature modules by role
│   │   ├── admin/          # Admin module
│   │   │   ├── pages/      # Admin pages
│   │   │   └── components/ # Admin-specific components
│   │   └── driver/         # Driver module
│   │       ├── pages/      # Driver pages
│   │       └── components/ # Driver-specific components
│   ├── layouts/            # Layout wrappers
│   ├── services/           # API service layer
│   ├── contexts/           # React contexts
│   ├── stores/             # Zustand stores
│   ├── lib/                # Utilities
│   │   ├── api.ts          # Axios instance with interceptors
│   │   └── utils.ts        # Helper functions (cn, etc.)
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles with Tailwind
├── public/
├── .env                    # Environment variables (local)
├── .env.example            # Environment variables template
├── package.json
├── tailwind.config.ts      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from the example:
```bash
cp .env.example .env
```

3. Update the `.env` file with your API URL:
```
VITE_API_URL=http://localhost:8080/api/v1
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: `http://localhost:8080/api/v1`)

## Path Aliases

The project uses path aliases for cleaner imports:

- `@/*` maps to `src/*`

Example:
```typescript
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
```

## Design System

The project uses a custom design system based on shadcn/ui with Tailwind CSS. The color palette and CSS variables are defined in `src/index.css` and match the frontend-sample design system.

### Key Colors

- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray
- **Success**: Green
- **Warning**: Orange
- **Destructive**: Red
- **Sidebar**: Dark gray/black

### Typography

- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 400, 500, 600, 700, 800

## API Integration

The API client is configured in `src/lib/api.ts` with:

- Automatic JWT token attachment to requests
- 401 response handling (automatic logout)
- Base URL from environment variables

## Next Steps

1. Install shadcn/ui components (Task 2)
2. Implement authentication context and services (Task 3)
3. Create authentication guards and routing (Task 4)
4. Build the login page (Task 5)
5. Create shared layout components (Task 6)

## License

Private - School Transport Operations System
