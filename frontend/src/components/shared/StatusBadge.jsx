import { STATUS_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function StatusBadge({ status, withDot = true, className }) {
  const config = STATUS_CONFIG[status] ?? { label: status, badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200', dotClass: 'bg-slate-500' };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.badgeClass,
        className
      )}
    >
      {withDot && <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)} />}
      {config.label}
    </span>
  );
}