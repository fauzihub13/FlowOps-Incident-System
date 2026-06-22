import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/context/AuthContext';

const navBase = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/incidents', label: 'Daftar Insiden', icon: ClipboardList },
];

function NavItem({ to, label, icon: Icon, badge, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )
      }
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1">{label}</span>
      {badge > 0 && (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-warning px-1.5 text-[10px] font-bold text-warning-foreground">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export function Sidebar({ pendingCount = 0, className }) {
  const { user } = useAuthContext();
  const items = [...navBase];

  return (
    <aside
      className={cn(
        'w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col',
        className ?? 'hidden'
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldAlert className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold">FlowOps</div>
          <div className="text-[11px] text-muted-foreground">Incident Workflow</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
        {items.map((item) => (
          <NavItem key={item.to} {...item} badge={item.to === '/incidents' && user?.role === 'approver' ? pendingCount : 0} />
        ))}
        {user?.role === 'reporter' && (
          <NavItem to="/incidents/new" label="Laporkan Insiden" icon={Plus} />
        )}
      </nav>
      <div className="border-t border-border p-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-3 w-3" />
          <span>v1.0.0 • {new Date().getFullYear()}</span>
        </div>
      </div>
    </aside>
  );
}