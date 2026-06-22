import { UserAvatar } from '@/components/shared/UserAvatar';
import { cn } from '@/lib/utils';

export function AssigneeList({ assignees = [], max = 3, size = 'sm', className }) {
  if (!assignees.length) {
    return <span className="text-xs text-muted-foreground">Belum ada</span>;
  }

  const visible = assignees.slice(0, max);
  const remaining = assignees.length - visible.length;

  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex -space-x-2">
        {visible.map((a) => (
          <span key={a.id} className="ring-2 ring-background rounded-full inline-block">
            <UserAvatar user={a} size={size} />
          </span>
        ))}
        {remaining > 0 && (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium ring-2 ring-background text-muted-foreground">
            +{remaining}
          </span>
        )}
      </div>
      <div className="ml-3 hidden text-xs text-muted-foreground sm:block">
        {assignees.map((a) => a.name).join(', ')}
      </div>
    </div>
  );
}