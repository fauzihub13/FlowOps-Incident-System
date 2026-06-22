# FlowOps — Incident Workflow & Approval Management System

Sistem pelaporan dan penanganan insiden internal dengan alur kerja formal: **Reporter → Approver → Assignee(s) → Resolved**. Setiap transisi tercatat dalam audit trail yang transparan.

## Tech Stack

- **Backend:** Laravel 13, PHP 8.4, MySQL 9, Laravel Sanctum
- **Frontend:** React 19, Vite, Tailwind CSS v4, shadcn/ui-style components, Radix UI, Axios, React Hook Form + Zod, Sonner

## Struktur Proyek

```
flowops-incident-system/
├── backend/          # Laravel REST API
│   ├── app/
│   │   ├── Enums/             # IncidentStatus, IncidentCategory, IncidentPriority, UserRole
│   │   ├── Exceptions/        # InvalidStateTransitionException, NotAssigneeException
│   │   ├── Http/
│   │   │   ├── Controllers/   # Auth, Incident, IncidentLog, Dashboard, User
│   │   │   ├── Middleware/    # RoleMiddleware
│   │   │   ├── Requests/      # Login, CreateIncident, Approve, Decline, AddLog, Resolve
│   │   │   ├── Resources/     # Incident, IncidentLog, User
│   │   │   └── Responses/     # ApiResponse
│   │   ├── Models/            # User, Incident, IncidentAssignee, IncidentLog
│   │   ├── Policies/          # IncidentPolicy
│   │   └── Services/          # IncidentWorkflowService (state machine)
│   ├── bootstrap/app.php      # Exception handlers, middleware alias
│   ├── database/
│   │   ├── migrations/        # users, incidents, incident_assignees, incident_logs
│   │   └── seeders/           # DatabaseSeeder (3 reporter, 2 approver, 4 assignee, 15 insiden)
│   └── routes/api.php
└── frontend/         # React + Vite SPA
    └── src/
        ├── components/
        │   ├── shared/        # StatusBadge, DataTable, FilterBar, ConfirmDialog, dll
        │   ├── incidents/     # ApproveForm, DeclineForm, AddLogForm, ResolveForm
        │   ├── layout/        # AppLayout, Sidebar, TopBar
        │   └── ui/            # Button, Input, Card, Dialog, Select, Badge, Spinner
        ├── pages/             # Login, Dashboard, IncidentList, IncidentDetail, CreateIncident
        ├── context/           # AuthContext
        ├── hooks/             # (consumed inline)
        ├── lib/               # utils, constants
        ├── services/          # api (axios + interceptors)
        └── router.jsx
```

## Setup & Menjalankan

### Prasyarat
- PHP 8.4+, Composer
- Node.js 18+, npm
- MySQL 8+

### Backend

```bash
cd backend
composer install
cp .env.example .env       # atau gunakan .env yang ada
php artisan key:generate
# Atur DB_* dan SANCTUM_STATEFUL_DOMAINS di .env
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env       # lalu sesuaikan VITE_API_URL bila perlu
npm run dev
# buka http://localhost:5173
```

Vite otomatis proxy request `/api/*` ke `http://127.0.0.1:8000` (lihat `vite.config.js`). Untuk produksi, isi `VITE_API_URL` di `.env` dengan URL backend absolut, mis. `https://api.flowops.company.com/api`.

## Akun Demo (password: `password`)

| Role | Email | Departemen |
|------|-------|------------|
| Reporter | `budi@company.com` | Engineering |
| Reporter | `rina@company.com` | HR |
| Reporter | `andi@company.com` | Operations |
| Approver | `hendra@company.com` | Management |
| Approver | `maya@company.com` | Management |
| Assignee | `dito@company.com` | IT Support |
| Assignee | `sari@company.com` | IT Support |
| Assignee | `rio@company.com` | Facility |
| Assignee | `lia@company.com` | Facility |

## Alur Kerja

```
[Reporter: Buat Laporan] → Pending_Approval
                                  │
                          ┌───────┴───────┐
                          ▼               ▼
              [Approver: Decline]   [Approver: Approve + Assign ≥1]
                          │               │
                          ▼               ▼
                      Rejected      In_Progress
                          │               │
                          │       ┌───────┴───────┐
                          │       ▼               ▼
                          │  [Assignee: Log]  [Assignee: Resolve]
                          │       │               │
                          │       ▼               ▼
                          │   In_Progress      Resolved
                          │       │
                          ▼       ▼
                       (final)  (final)
```

### Aturan Transisi
- **Approve** oleh Approver, hanya dari `Pending_Approval` → `In_Progress`, wajib pilih minimal 1 assignee aktif.
- **Decline** oleh Approver, hanya dari `Pending_Approval` → `Rejected`, wajib isi alasan min 10 karakter.
- **Add Log** oleh Assignee yang ter-assign, hanya saat `In_Progress`.
- **Resolve** oleh Assignee yang ter-assign, hanya dari `In_Progress` → `Resolved`, wajib isi catatan min 20 karakter.
- `Resolved` dan `Rejected` adalah status final, tidak dapat diubah.

## API Endpoints

Semua endpoint di bawah `/api` dan menggunakan Laravel Sanctum (kecuali login).

| Method | Endpoint | Role | Deskripsi |
|--------|----------|------|-----------|
| POST | `/auth/login` | – | Login, dapat token |
| POST | `/auth/logout` | All | Revoke token |
| GET | `/auth/me` | All | Profil user |
| GET | `/incidents` | All | Daftar insiden (scoped by role) |
| POST | `/incidents` | reporter | Buat insiden |
| GET | `/incidents/{id}` | All | Detail insiden |
| PATCH | `/incidents/{id}/approve` | approver | Approve + assign |
| PATCH | `/incidents/{id}/decline` | approver | Decline + alasan |
| POST | `/incidents/{id}/logs` | assignee (assigned) | Tambah progress log |
| PATCH | `/incidents/{id}/resolve` | assignee (assigned) | Tandai selesai |
| GET | `/users/assignees` | approver | Daftar assignee |
| GET | `/dashboard/stats` | All | Statistik ringkasan |

## Standar Response

```json
// Sukses
{ "success": true, "message": "...", "data": { }, "meta": { } }

// Gagal
{ "success": false, "message": "...", "error_code": "VALIDATION_ERROR|FORBIDDEN|...", "errors": { } }
```

## Skenario Demo

1. **Normal Flow (Multi Assignee):** Login sebagai `budi@company.com` → buat insiden → login `hendra@company.com` → approve dengan 2 assignee → login `dito@company.com` & `sari@company.com` → tambah log → resolve.
2. **Penolakan:** Login `budi@company.com` → buat insiden duplikat → `hendra@company.com` decline.
3. **Validasi Akses:** Login sebagai `dito@company.com` → coba akses endpoint approve → 403.
4. **Validasi Input:** Submit form dengan description < 30 karakter → error inline.

## Build Produksi

```bash
# Backend (opsional, untuk optimasi)
cd backend
php artisan config:cache
php artisan route:cache

# Frontend
cd frontend
npm run build
npm run preview
```
