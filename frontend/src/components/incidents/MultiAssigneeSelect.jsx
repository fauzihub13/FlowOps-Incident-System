import { useMemo, useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { cn } from '@/lib/utils';

export function MultiAssigneeSelect({
  options = [],
  value = [],
  onChange,
  placeholder = 'Pilih assignee...',
  error,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = useMemo(
    () => options.filter((o) => value.includes(o.id)),
    [options, value]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.name?.toLowerCase().includes(q) ||
        o.email?.toLowerCase().includes(q) ||
        o.department?.toLowerCase().includes(q)
    );
  }, [options, search]);

  const toggle = (id) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'h-auto min-h-9 w-full justify-between px-3 py-1.5',
              error && 'border-destructive'
            )}
          >
            <div className="flex flex-1 flex-wrap items-center gap-1">
              {selected.length === 0 && (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              {selected.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                >
                  <UserAvatar user={s} size="xs" />
                  {s.name}
                  <span
                    role="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggle(s.id);
                    }}
                    className="rounded p-0.5 hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </span>
                </span>
              ))}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            className="z-50 w-[--radix-popover-trigger-width] rounded-md border border-border bg-popover p-0 shadow-md outline-none"
          >
            <div className="border-b border-border p-2">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari assignee..."
                className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="max-h-64 overflow-y-auto p-1 scrollbar-thin">
              {filtered.length === 0 ? (
                <p className="p-3 text-center text-sm text-muted-foreground">
                  Tidak ada assignee ditemukan.
                </p>
              ) : (
                filtered.map((opt) => {
                  const isSelected = value.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggle(opt.id)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground',
                        isSelected && 'bg-accent/40'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-input'
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </span>
                      <UserAvatar user={opt} size="sm" showName />
                    </button>
                  );
                })
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}