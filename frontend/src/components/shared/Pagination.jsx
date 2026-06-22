import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Pagination({ meta, onPageChange, className }) {
  if (!meta || meta.last_page <= 1) return null;
  const { current_page, last_page } = meta;

  const goTo = (p) => {
    if (p < 1 || p > last_page || p === current_page) return;
    onPageChange(p);
  };

  const pages = [];
  const range = 1;
  for (let i = 1; i <= last_page; i++) {
    if (i === 1 || i === last_page || Math.abs(i - current_page) <= range) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  return (
    <div className={cn('flex items-center justify-between gap-2 text-sm', className)}>
      <span className="text-xs text-muted-foreground">
        Halaman {current_page} dari {last_page}
      </span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" onClick={() => goTo(current_page - 1)} disabled={current_page === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((p, idx) =>
          p === '…' ? (
            <span key={`dots-${idx}`} className="px-2 text-xs text-muted-foreground">…</span>
          ) : (
            <Button
              key={p}
              variant={p === current_page ? 'default' : 'outline'}
              size="icon"
              onClick={() => goTo(p)}
            >
              {p}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => goTo(current_page + 1)}
          disabled={current_page === last_page}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}