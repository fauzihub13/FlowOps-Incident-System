import { cn, initials } from '@/lib/utils';

const colorPalette = [
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-fuchsia-100 text-fuchsia-700',
  'bg-teal-100 text-teal-700',
  'bg-indigo-100 text-indigo-700',
];

function colorFor(id) {
  if (!id) return colorPalette[0];
  return colorPalette[id % colorPalette.length];
}

export function UserAvatar({ user, size = 'md', showName = false, className }) {
  const sizeClass =
    size === 'xs'
      ? 'h-6 w-6 text-[10px]'
      : size === 'sm'
      ? 'h-7 w-7 text-xs'
      : size === 'lg'
      ? 'h-10 w-10 text-sm'
      : 'h-8 w-8 text-xs';

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span
        title={user?.name}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-semibold ring-1 ring-inset ring-black/5',
          sizeClass,
          colorFor(user?.id ?? 0)
        )}
      >
        {initials(user?.name)}
      </span>
      {showName && <span className="text-sm font-medium">{user?.name}</span>}
    </div>
  );
}