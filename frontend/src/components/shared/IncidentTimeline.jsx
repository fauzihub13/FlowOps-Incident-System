import { formatDate, formatRelative } from '@/lib/utils';
import {
  CheckCheck,
  CheckCircle2,
  MessageSquare,
  Plus,
  UserPlus,
  XCircle,
} from 'lucide-react';
import { LOG_TYPE_CONFIG } from '@/lib/constants';
import { UserAvatar } from '@/components/shared/UserAvatar';

const ICONS = { Plus, CheckCircle2, XCircle, UserPlus, MessageSquare, CheckCheck };

export function IncidentTimeline({ logs = [] }) {
  if (!logs.length) {
    return (
      <p className="text-sm text-muted-foreground">Belum ada aktivitas pada insiden ini.</p>
    );
  }

  return (
    <ol className="relative space-y-4 border-l border-border pl-6">
      {logs.map((log) => {
        const config = LOG_TYPE_CONFIG[log.log_type] ?? LOG_TYPE_CONFIG.progress_update;
        const Icon = ICONS[config.icon] ?? MessageSquare;
        return (
          <li key={log.id} className="relative">
            <span
              className={`absolute -left-9 flex h-7 w-7 items-center justify-center rounded-full ${config.bg} ${config.color} ring-4 ring-background`}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{config.label}</span>
                {log.author && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <UserAvatar user={log.author} size="xs" />
                    <span>{log.author.name}</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground" title={formatDate(log.created_at)}>
                  • {formatRelative(log.created_at)}
                </span>
              </div>
              <p className="text-sm text-foreground/90">{log.message}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}