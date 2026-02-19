import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getRoleBasedRoute = (role: string) => {
    const routes: Record<string, string> = {
      admin: '/admin',
      principal: '/admin',
      teacher: '/teacher',
      student: '/student',
      parent: '/parent',
      accountant: '/accountant',
      admissions_staff: '/admissions',
    };
    return routes[role] || '/admin';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success('Welcome back!');
      
      // Get the user role and navigate to appropriate dashboard
      const userRole = user?.role || 'admin';
      const route = getRoleBasedRoute(userRole);
      navigate(route);
    } catch (error: any) {
      toast.error(error.message || error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role: string) => {
    const credentials: Record<string, { email: string; password: string }> = {
      admin: { email: 'admin@school.com', password: 'admin123' },
      teacher: { email: 'teacher@school.com', password: 'teacher123' },
      student: { email: 'student@school.com', password: 'student123' },
      parent: { email: 'parent@school.com', password: 'parent123' },
      accountant: { email: 'accountant@school.com', password: 'accountant123' },
      admissions: { email: 'admissions@school.com', password: 'admissions123' },
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
            <School className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">School SaaS</CardTitle>
          <CardDescription className="text-base">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="admin@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                onClick={() => quickLogin('admin')}
                className="text-xs"
              >
                Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickLogin('teacher')}
                className="text-xs"
              >
                Teacher
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickLogin('student')}
                className="text-xs"
              >
                Student
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickLogin('parent')}
                className="text-xs"
              >
                Parent
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickLogin('accountant')}
                className="text-xs"
              >
                Accountant
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickLogin('admissions')}
                className="text-xs"
              >
                Admissions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
