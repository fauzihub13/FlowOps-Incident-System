import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { X } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { dashboardService } from '@/services/api';
import { useAuthContext } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const { user } = useAuthContext();
  const [pendingCount, setPendingCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user?.role !== 'approver') return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await dashboardService.stats();
        if (!cancelled && res.success) {
          setPendingCount(res.data?.stats?.pending_approval ?? 0);
        }
      } catch {
        /* silent */
      }
    };
    load();
    const interval = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user]);

  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      <Sidebar pendingCount={pendingCount} />
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-200 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar
          pendingCount={pendingCount}
          className="flex h-full flex-col"
        />
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Tutup menu"
          className="absolute right-3 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setMobileOpen((o) => !o)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}