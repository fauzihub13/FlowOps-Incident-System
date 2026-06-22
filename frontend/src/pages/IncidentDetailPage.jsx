import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { incidentService, userService } from '@/services/api';
import { useAuthContext } from '@/context/AuthContext';
import { IncidentDetailHeader } from '@/components/incidents/IncidentDetailHeader';
import { IncidentInfoPanel } from '@/components/incidents/IncidentInfoPanel';
import { IncidentTimeline } from '@/components/shared/IncidentTimeline';
import { ApproveForm } from '@/components/incidents/ApproveForm';
import { DeclineForm } from '@/components/incidents/DeclineForm';
import { AddLogForm } from '@/components/incidents/AddLogForm';
import { ResolveForm } from '@/components/incidents/ResolveForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { getErrorMessage, getValidationErrors } from '@/lib/constants';

export function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [incident, setIncident] = useState(null);
  const [assignees, setAssignees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await incidentService.show(id);
      if (res.success) {
        setIncident(res.data);
        if (user?.role === 'approver') {
          const ar = await userService.assignees();
          if (ar.success) setAssignees(ar.data ?? []);
        }
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal memuat detail insiden.'));
      navigate('/incidents', { replace: true });
    } finally {
      setIsLoading(false);
    }
  }, [id, user, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAction = async (serviceCall, payload, mode = 'replace', hooks = {}) => {
    setActionLoading(true);
    try {
      const res = await serviceCall(payload);
      if (res.success) {
        toast.success(res.message);
        if (mode === 'appendLog') {
          setIncident((prev) =>
            prev
              ? { ...prev, logs: [...(prev.logs ?? []), res.data] }
              : prev
          );
        } else {
          setIncident(res.data);
        }
        hooks.onSuccess?.();
      } else {
        hooks.onError?.(res.message);
        toast.error(res.message);
      }
      return res;
    } catch (err) {
      const vErrors = getValidationErrors(err);
      const msg = vErrors
        ? Object.values(vErrors).flat()[0] || getErrorMessage(err)
        : getErrorMessage(err);
      hooks.onError?.(msg);
      toast.error(msg);
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!incident) return null;

  const isApprover = user?.role === 'approver';
  const isAssignee = user?.role === 'assignee';
  const isReporter = user?.role === 'reporter';

  const isAssignedToMe =
    isAssignee && incident.assignees?.some((a) => a.id === user.id);

  const showApproveDecline =
    isApprover && incident.status === 'Pending_Approval';

  const showAddLogResolve =
    isAssignee && isAssignedToMe && incident.status === 'In_Progress';

  return (
    <div className="space-y-6">
      <IncidentDetailHeader incident={incident} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deskripsi</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 pt-0">
              {incident.description}
              {incident.attachment_url && (
                <div className="mt-3 rounded-md border border-border bg-muted/40 p-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Lampiran</span>
                  <a
                    href={incident.attachment_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-1 block break-all text-sm text-primary hover:underline"
                  >
                    {incident.attachment_url}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline Aktivitas</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <IncidentTimeline logs={incident.logs ?? []} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <IncidentInfoPanel incident={incident} />

          {showApproveDecline && (
            <>
              <ApproveForm
                assignees={assignees}
                isLoading={actionLoading}
                onSubmit={(payload, hooks) =>
                  handleAction(
                    (p) => incidentService.approve(id, p),
                    payload,
                    hooks
                  )
                }
              />
              <DeclineForm
                isLoading={actionLoading}
                onSubmit={(payload, hooks) =>
                  handleAction(
                    (p) => incidentService.decline(id, p),
                    payload,
                    hooks
                  )
                }
              />
            </>
          )}

          {showAddLogResolve && (
            <>
              <AddLogForm
                isLoading={actionLoading}
                onSubmit={(payload, hooks) =>
                  handleAction(
                    (p) => incidentService.addLog(id, p),
                    payload,
                    'appendLog',
                    hooks
                  )
                }
              />
              <ResolveForm
                isLoading={actionLoading}
                onSubmit={(payload, hooks) =>
                  handleAction(
                    (p) => incidentService.resolve(id, p),
                    payload,
                    hooks
                  )
                }
              />
            </>
          )}

          {(isReporter || (!showApproveDecline && !showAddLogResolve)) &&
            (incident.status === 'Resolved' || incident.status === 'Rejected') && (
              <Card>
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  {incident.status === 'Resolved'
                    ? '✅ Insiden ini telah diselesaikan.'
                    : '❌ Insiden ini telah ditolak.'}
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}