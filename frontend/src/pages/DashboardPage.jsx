import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock4,
  XCircle,
} from 'lucide-react';
import { dashboardService } from '@/services/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Spinner } from '@/components/ui/spinner';
import { IncidentRow } from '@/components/incidents/IncidentRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuthContext } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/lib/constants';

export function DashboardPage() {
  const { user } = useAuthContext();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await dashboardService.stats();
      if (res.success) setData(res.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const stats = data?.stats ?? {};
  const recent = data?.recent ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Halo, ${user?.name?.split(' ')[0] ?? 'User'} `}
        description={`Ringkasan insiden untuk role ${ROLE_LABELS[user?.role] ?? user?.role}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total"
          value={stats.total ?? 0}
          icon={ClipboardList}
          accent="default"
        />
        <StatCard
          label="Pending"
          value={stats.pending_approval ?? 0}
          icon={Clock4}
          accent="warning"
        />
        <StatCard
          label="In Progress"
          value={stats.in_progress ?? 0}
          icon={AlertTriangle}
          accent="info"
        />
        <StatCard
          label="Resolved"
          value={stats.resolved ?? 0}
          icon={CheckCircle2}
          accent="success"
        />
        <StatCard
          label="Rejected"
          value={stats.rejected ?? 0}
          icon={XCircle}
          accent="destructive"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Insiden Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {recent.length === 0 ? (
            <EmptyState
              title="Belum ada aktivitas"
              description="Belum ada insiden yang tercatat untuk Anda."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">Judul</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Prioritas</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Pelapor</th>
                    <th className="px-4 py-3">Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((i) => (
                    <IncidentRow key={i.id} incident={i} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}