import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ClipboardList } from 'lucide-react';
import { incidentService } from '@/services/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterBar } from '@/components/shared/FilterBar';
import { Pagination } from '@/components/shared/Pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { IncidentRow } from '@/components/incidents/IncidentRow';
import { useAuthContext } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/constants';
import { toast } from 'sonner';

const DEFAULT_FILTERS = { status: '', priority: '', category: '', search: '', page: 1 };

export function IncidentListPage() {
  const { user } = useAuthContext();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [data, setData] = useState({ items: [], meta: null });
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== null)
      );
      const res = await incidentService.list(params);
      if (res.success) {
        setData({ items: res.data ?? [], meta: res.meta ?? null });
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal memuat daftar insiden.'));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Insiden"
        description={
          user?.role === 'approver'
            ? 'Semua insiden yang masuk ke sistem.'
            : user?.role === 'assignee'
            ? 'Insiden yang ditugaskan kepada Anda.'
            : 'Insiden yang Anda laporkan.'
        }
        actions={
          user?.role === 'reporter' && (
            <Button asChild>
              <Link to="/incidents/new">
                <Plus className="h-4 w-4" /> Laporkan Insiden
              </Link>
            </Button>
          )
        }
      />

      <FilterBar filters={filters} onChange={setFilters} />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : data.items.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={ClipboardList}
                title="Tidak ada insiden"
                description={
                  filters.search || filters.status || filters.priority || filters.category
                    ? 'Coba ubah filter atau reset pencarian.'
                    : 'Belum ada insiden yang tercatat.'
                }
                action={
                  filters.search || filters.status || filters.priority || filters.category ? (
                    <Button variant="outline" onClick={() => setFilters(DEFAULT_FILTERS)}>
                      Reset Filter
                    </Button>
                  ) : user?.role === 'reporter' ? (
                    <Button asChild>
                      <Link to="/incidents/new">
                        <Plus className="h-4 w-4" /> Buat Laporan Pertama
                      </Link>
                    </Button>
                  ) : null
                }
              />
            </div>
          ) : (
            <>
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
                    {data.items.map((i) => (
                      <IncidentRow key={i.id} incident={i} />
                    ))}
                  </tbody>
                </table>
              </div>
              {data.meta && (
                <div className="border-t border-border px-4 py-3">
                  <Pagination meta={data.meta} onPageChange={(p) => setFilters({ ...filters, page: p })} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}