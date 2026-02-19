# Developer Guide - School ERP Frontend

## Quick Start

### Installation
```bash
cd school_erp/frontend
npm install
```

### Development
```bash
npm run dev
# Opens at http://localhost:3000
```

### Build
```bash
npm run build
npm run preview
```

## Project Structure

### Adding a New Page

1. **Create the page component:**
```typescript
// src/modules/[role]/pages/NewPage.tsx
export default function NewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New Page</h1>
      {/* Your content */}
    </div>
  );
}
```

2. **Add route in App.tsx:**
```typescript
import NewPage from './modules/[role]/pages/NewPage';

// In the Routes section:
<Route path="/[role]/new-page" element={<NewPage />} />
```

3. **Add navigation in AppSidebar.tsx:**
```typescript
const roleNavItems = {
  [role]: [
    // ... existing items
    { title: 'New Page', path: '/[role]/new-page', icon: IconName },
  ],
};
```

### Creating a New Service

```typescript
// src/services/example.service.ts
import apiClient from '@/lib/api';

export const exampleService = {
  async getData(params?: any) {
    const response = await apiClient.get('/api/endpoint', { params });
    return response.data;
  },

  async createData(data: any) {
    const response = await apiClient.post('/api/endpoint', data);
    return response.data;
  },
};
```

### Using React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { exampleService } from '@/services/example.service';

function MyComponent() {
  // Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ['example'],
    queryFn: () => exampleService.getData(),
  });

  // Mutate data
  const mutation = useMutation({
    mutationFn: exampleService.createData,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['example'] });
    },
  });

  return (
    <div>
      {isLoading ? 'Loading...' : data}
      <button onClick={() => mutation.mutate({ name: 'Test' })}>
        Create
      </button>
    </div>
  );
}
```

## Module-Specific Guidelines

### Admin Module
- Full CRUD operations for users, classes, etc.
- Dashboard with system-wide statistics
- Access to all management features

### Teacher Module
- Focus on classroom management
- Attendance marking interface
- Marks entry with validation
- Class diary for homework

### Student Module
- Read-only access to academic data
- Interactive learning features
- AI tutor integration
- Progress tracking

### Parent Module
- Child's academic overview
- Attendance monitoring
- Fee payment integration
- Communication with teachers

### Accountant Module
- Financial management
- Invoice generation
- Payment reconciliation
- Financial reports

### Admissions Module
- Application workflow
- Document management
- Status tracking
- Approval process

## UI Components

### Using shadcn/ui Components

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### Common Patterns

#### Data Table
```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Form with Validation
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## Authentication

### Using Auth Context
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes
```typescript
// Already configured in App.tsx
// All routes under <ProtectedRoute /> require authentication
```

### Role-Based Access
```typescript
// Already configured in App.tsx
// Use RoleRoute component with allowedRoles prop
<RoleRoute allowedRoles={['admin', 'teacher']}>
  <MyComponent />
</RoleRoute>
```

## Styling

### Tailwind CSS Classes
```typescript
// Common patterns
<div className="flex items-center justify-between">
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
<div className="space-y-4">
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
```

### Custom Colors
```typescript
// Defined in tailwind.config.ts
bg-primary, text-primary
bg-secondary, text-secondary
bg-accent, text-accent
bg-muted, text-muted-foreground
```

## API Integration

### Base Configuration
```typescript
// src/lib/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Environment Variables
```bash
# .env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=School ERP
```

## Testing

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Extract reusable logic into custom hooks
   - Use TypeScript for type safety

2. **State Management**
   - Use React Query for server state
   - Use Zustand for global client state
   - Use local state for component-specific data

3. **Performance**
   - Lazy load routes with React.lazy()
   - Memoize expensive computations
   - Use React Query's caching

4. **Code Style**
   - Follow ESLint rules
   - Use Prettier for formatting
   - Write meaningful component names

5. **Error Handling**
   - Use try-catch in async functions
   - Show user-friendly error messages
   - Log errors for debugging

## Common Issues

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Type Errors
```bash
# Ensure types are installed
npm install -D @types/react @types/react-dom
```

### Build Errors
```bash
# Check TypeScript config
# Ensure all imports are correct
# Run type check: npm run type-check
```

## Deployment

### Production Build
```bash
npm run build
# Output in dist/ folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Query](https://tanstack.com/query)
- [React Router](https://reactrouter.com)
