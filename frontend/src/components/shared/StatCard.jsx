import { cn } from '@/lib/utils';

export function StatCard({ label, value, icon: Icon, accent = 'default', className }) {
  const accentMap = {
    default: 'bg-primary/10 text-primary',
    warning: 'bg-warning/10 text-warning',
    success: 'bg-success/10 text-success',
    destructive: 'bg-destructive/10 text-destructive',
    info: 'bg-blue-100 text-blue-700',
  };
  return (
    <div className={cn('rounded-xl border border-border bg-card p-5 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {Icon && (
          <span className={cn('inline-flex h-9 w-9 items-center justify-center rounded-lg', accentMap[accent])}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}