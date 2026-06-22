import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthContext } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

const demoAccounts = [
  { role: 'Reporter', email: 'budi@company.com' },
  { role: 'Approver', email: 'hendra@company.com' },
  { role: 'Assignee', email: 'dito@company.com' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const dest = location.state?.from?.pathname ?? '/dashboard';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Login berhasil. Selamat datang!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Login gagal.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const quickFill = (acc) => {
    setEmail(acc.email);
    setPassword('password');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <ShieldAlert className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">FlowOps Incident</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sistem Workflow & Approval Insiden</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Masuk ke akun Anda</CardTitle>
            <CardDescription>Gunakan kredensial kantor untuk melanjutkan.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-accent"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : 'Masuk'}
              </Button>
            </form>

            <div className="mt-6 rounded-md border border-dashed border-border bg-muted/30 p-3">
              <p className="text-xs font-semibold text-muted-foreground">Akun Demo (password: password)</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => quickFill(acc)}
                    className="rounded-md border border-border bg-card px-2 py-1.5 text-left text-xs transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <div className="font-semibold">{acc.role}</div>
                    <div className="truncate text-muted-foreground">{acc.email}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FlowOps. All rights reserved.
        </p>
      </div>
    </div>
  );
}