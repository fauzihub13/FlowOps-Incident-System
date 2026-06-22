export const STATUS_CONFIG = {
  Pending_Approval: {
    label: 'Pending',
    badgeClass: 'bg-amber-100 text-amber-700 border border-amber-200',
    dotClass: 'bg-amber-500',
  },
  In_Progress: {
    label: 'In Progress',
    badgeClass: 'bg-blue-100 text-blue-700 border border-blue-200',
    dotClass: 'bg-blue-500',
  },
  Resolved: {
    label: 'Resolved',
    badgeClass: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  Rejected: {
    label: 'Rejected',
    badgeClass: 'bg-red-100 text-red-700 border border-red-200',
    dotClass: 'bg-red-500',
  },
};

export const PRIORITY_CONFIG = {
  Low: {
    label: 'Low',
    badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
    weight: 1,
  },
  Medium: {
    label: 'Medium',
    badgeClass: 'bg-blue-100 text-blue-700 border border-blue-200',
    weight: 2,
  },
  High: {
    label: 'High',
    badgeClass: 'bg-orange-100 text-orange-700 border border-orange-200',
    weight: 3,
  },
  Critical: {
    label: 'Critical',
    badgeClass: 'bg-red-100 text-red-700 border border-red-200',
    weight: 4,
  },
};

export const CATEGORIES = ['IT', 'Facility', 'HR', 'Security', 'Other'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
export const STATUSES = Object.keys(STATUS_CONFIG);

export const ROLE_LABELS = {
  reporter: 'Reporter',
  approver: 'Approver',
  assignee: 'Assignee',
};

export const LOG_TYPE_CONFIG = {
  created: {
    label: 'Insiden dilaporkan',
    icon: 'Plus',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
  },
  approved: {
    label: 'Insiden disetujui',
    icon: 'CheckCircle2',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
  },
  declined: {
    label: 'Insiden ditolak',
    icon: 'XCircle',
    color: 'text-red-700',
    bg: 'bg-red-100',
  },
  assigned: {
    label: 'Assignee ditambahkan',
    icon: 'UserPlus',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
  },
  progress_update: {
    label: 'Update progress',
    icon: 'MessageSquare',
    color: 'text-indigo-700',
    bg: 'bg-indigo-100',
  },
  resolved: {
    label: 'Insiden diselesaikan',
    icon: 'CheckCheck',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
  },
};

export function getErrorMessage(err, fallback = 'Terjadi kesalahan.') {
  return err?.response?.data?.message || err?.message || fallback;
}

export function getValidationErrors(err) {
  return err?.response?.data?.errors || null;
}