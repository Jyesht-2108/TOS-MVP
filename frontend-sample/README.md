# School SaaS Frontend

Professional-grade React + Vite frontend for School Management System.

## Tech Stack

- **Framework**: React 18 + Vite 5
- **Language**: TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Routing**: React Router v6
- **State**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios
- **Charts**: Recharts
- **Animations**: Framer Motion

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # Auth guards
│   ├── dashboard/     # Dashboard components
│   ├── layout/        # Layout components
│   └── ui/            # shadcn/ui components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── lib/               # Utilities
├── modules/           # Feature modules by role
│   ├── admin/
│   ├── teacher/
│   ├── student/
│   └── parent/
├── stores/            # Zustand stores
├── types/             # TypeScript types
├── App.tsx
└── main.tsx
```

## Environment Variables

Create `.env` file:

```
VITE_API_URL=http://localhost:8000
```

## Features

- Role-based routing (Admin, Teacher, Student, Parent)
- JWT authentication with auto-refresh
- Responsive design
- Dark mode support
- Animated UI components
- Professional dashboard layouts
