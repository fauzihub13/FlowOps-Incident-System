import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export function IncidentDetailHeader({ incident }) {
  return (
    <div className="flex flex-col gap-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit text-muted-foreground">
        <Link to="/incidents"><ChevronLeft className="mr-1 h-4 w-4" /> Kembali ke daftar</Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">#{incident.id}</span>
            <StatusBadge status={incident.status} />
            <PriorityBadge priority={incident.priority} />
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{incident.title}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Dilaporkan {formatDate(incident.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}