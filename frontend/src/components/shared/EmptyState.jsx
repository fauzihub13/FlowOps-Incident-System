import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-12 text-center ${className ?? ''}`}>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function EmptyStateAction({ children, ...props }) {
  return <Button {...props}>{children}</Button>;
}