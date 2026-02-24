import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getRoleBasedRoute = (role: string) => {
    const routes: Record<string, string> = {
      ADMIN: '/admin/dashboard',
      PARENT: '/parent/dashboard',
    };
    return routes[role] || '/admin/dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }
    
    if (!password.trim()) {
      toast.error('Password is required');
      return;
    }
    
    setLoading(true);

    try {
      await login({ email, password });
      toast.success('Welcome back!');
      
      // Get the user from auth context after successful login
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = user?.role || 'ADMIN';
      const route = getRoleBasedRoute(userRole);
      navigate(route);
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role: 'ADMIN' | 'PARENT') => {
    const credentials: Record<string, { email: string; password: string }> = {
      ADMIN: { email: 'admin@school.com', password: 'admin123' },
      PARENT: { email: 'parent@school.com', password: 'parent123' },
    };
    
    const cred = credentials[role];
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
            <Bus className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">Transport Operations</CardTitle>
          <CardDescription className="text-base">
            Sign in to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="admin@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-center text-muted-foreground mb-3">
              Quick Login (Demo Mode)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickLogin('ADMIN')}
                className="text-xs"
                disabled={loading}
              >
                Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickLogin('PARENT')}
                className="text-xs"
                disabled={loading}
              >
                Parent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
