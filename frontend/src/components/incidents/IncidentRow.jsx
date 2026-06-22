import { Link } from 'react-router-dom';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AssigneeList } from '@/components/shared/AssigneeList';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { formatRelative } from '@/lib/utils';

export function IncidentRow({ incident }) {
  return (
    <tr className="border-b border-border transition-colors hover:bg-muted/40">
      <td className="px-4 py-3 align-top">
        <Link
          to={`/incidents/${incident.id}`}
          className="font-medium text-foreground hover:text-primary"
        >
          {incident.title}
        </Link>
        <div className="mt-0.5 text-xs text-muted-foreground">
          #{incident.id} • {formatRelative(incident.created_at)}
        </div>
      </td>
      <td className="px-4 py-3 align-top text-sm">{incident.category}</td>
      <td className="px-4 py-3 align-top">
        <PriorityBadge priority={incident.priority} />
      </td>
      <td className="px-4 py-3 align-top">
        <StatusBadge status={incident.status} />
      </td>
      <td className="px-4 py-3 align-top">
        {incident.reporter && <UserAvatar user={incident.reporter} size="xs" showName />}
      </td>
      <td className="px-4 py-3 align-top">
        <AssigneeList assignees={incident.assignees ?? []} max={3} />
      </td>
    </tr>
  );
}