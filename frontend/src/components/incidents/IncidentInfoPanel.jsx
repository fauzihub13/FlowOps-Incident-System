import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { AssigneeList } from '@/components/shared/AssigneeList';
import { formatDate } from '@/lib/utils';
import { Calendar, MapPin, Tag, User, UserCheck, Users, FileText } from 'lucide-react';

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-sm">{children}</div>
      </div>
    </div>
  );
}

export function IncidentInfoPanel({ incident }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Detail Insiden</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border pt-0">
        <InfoRow icon={FileText} label="Kategori">{incident.category}</InfoRow>
        {incident.location && (
          <InfoRow icon={MapPin} label="Lokasi">{incident.location}</InfoRow>
        )}
        <InfoRow icon={User} label="Pelapor">
          {incident.reporter && <UserAvatar user={incident.reporter} size="sm" showName />}
        </InfoRow>
        <InfoRow icon={UserCheck} label="Approver">
          {incident.approver ? (
            <UserAvatar user={incident.approver} size="sm" showName />
          ) : (
            <span className="text-muted-foreground">Belum diproses</span>
          )}
        </InfoRow>
        <InfoRow icon={Users} label="Assignee">
          <AssigneeList assignees={incident.assignees ?? []} max={5} />
        </InfoRow>
        {incident.approved_at && (
          <InfoRow icon={Calendar} label="Disetujui">{formatDate(incident.approved_at)}</InfoRow>
        )}
        {incident.resolved_at && (
          <InfoRow icon={Calendar} label="Diselesaikan">{formatDate(incident.resolved_at)}</InfoRow>
        )}
        {incident.rejected_at && (
          <InfoRow icon={Calendar} label="Ditolak">{formatDate(incident.rejected_at)}</InfoRow>
        )}
        {incident.rejection_reason && (
          <InfoRow icon={Tag} label="Alasan Penolakan">
            <span className="text-destructive">{incident.rejection_reason}</span>
          </InfoRow>
        )}
        {incident.approval_notes && (
          <InfoRow icon={Tag} label="Catatan Approver">{incident.approval_notes}</InfoRow>
        )}
        {incident.resolution_notes && (
          <InfoRow icon={Tag} label="Catatan Resolusi">{incident.resolution_notes}</InfoRow>
        )}
      </CardContent>
    </Card>
  );
}