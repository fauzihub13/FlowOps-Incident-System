import { PRIORITY_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function PriorityBadge({ priority, className }) {
  const config = PRIORITY_CONFIG[priority] ?? { label: priority, badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200' };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.badgeClass,
        className
      )}
    >
      {config.label}
    </span>
  );
}