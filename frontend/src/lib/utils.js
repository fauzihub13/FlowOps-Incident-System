import { clsx } from 'clsx';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso, fmt = 'dd MMM yyyy, HH:mm') {
  if (!iso) return '-';
  try {
    return format(parseISO(iso), fmt, { locale: id });
  } catch {
    return '-';
  }
}

export function formatRelative(iso) {
  if (!iso) return '-';
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: id });
  } catch {
    return '-';
  }
}

export function initials(name) {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}