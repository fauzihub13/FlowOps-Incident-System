import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES, PRIORITIES, STATUSES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function FilterBar({
  filters,
  onChange,
  showStatus = true,
  showPriority = true,
  showCategory = true,
  searchPlaceholder = 'Cari judul...',
  className,
}) {
  const update = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };
  const hasFilter =
    filters.status || filters.priority || filters.category || filters.search;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="relative flex-1 min-w-[200px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search ?? ''}
          onChange={(e) => update('search', e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>

      {showStatus && (
        <Select
          value={filters.status ?? 'all'}
          onValueChange={(v) => update('status', v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showPriority && (
        <Select
          value={filters.priority ?? 'all'}
          onValueChange={(v) => update('priority', v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Prioritas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Prioritas</SelectItem>
            {PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showCategory && (
        <Select
          value={filters.category ?? 'all'}
          onValueChange={(v) => update('category', v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ page: 1 })}
          className="text-muted-foreground"
        >
          <X className="mr-1 h-4 w-4" /> Reset
        </Button>
      )}
    </div>
  );
}