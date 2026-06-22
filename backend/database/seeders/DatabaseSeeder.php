<?php

namespace Database\Seeders;

use App\Models\Incident;
use App\Models\IncidentAssignee;
use App\Models\IncidentLog;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $this->seedUsers();
            $this->seedIncidents();
        });
    }

    private function seedUsers(): void
    {
        $password = Hash::make('password');

        $reporters = [
            ['name' => 'Budi Santoso',    'email' => 'budi@company.com',    'department' => 'Engineering'],
            ['name' => 'Rina Kusuma',     'email' => 'rina@company.com',    'department' => 'HR'],
            ['name' => 'Andi Pratama',    'email' => 'andi@company.com',    'department' => 'Operations'],
        ];

        $approvers = [
            ['name' => 'Hendra Wijaya',   'email' => 'hendra@company.com',  'department' => 'Management'],
            ['name' => 'Maya Sari',       'email' => 'maya@company.com',    'department' => 'Management'],
        ];

        $assignees = [
            ['name' => 'Dito Wijaya',     'email' => 'dito@company.com',    'department' => 'IT Support'],
            ['name' => 'Sari Dewi',       'email' => 'sari@company.com',    'department' => 'IT Support'],
            ['name' => 'Rio Hartono',     'email' => 'rio@company.com',     'department' => 'Facility'],
            ['name' => 'Lia Anggraini',   'email' => 'lia@company.com',     'department' => 'Facility'],
        ];

        foreach ($reporters as $u) {
            User::create([...$u, 'password' => $password, 'role' => 'reporter', 'is_active' => true]);
        }
        foreach ($approvers as $u) {
            User::create([...$u, 'password' => $password, 'role' => 'approver', 'is_active' => true]);
        }
        foreach ($assignees as $u) {
            User::create([...$u, 'password' => $password, 'role' => 'assignee', 'is_active' => true]);
        }
    }

    private function seedIncidents(): void
    {
        $budi    = User::where('email', 'budi@company.com')->first();
        $rina    = User::where('email', 'rina@company.com')->first();
        $andi    = User::where('email', 'andi@company.com')->first();
        $hendra  = User::where('email', 'hendra@company.com')->first();
        $maya    = User::where('email', 'maya@company.com')->first();
        $dito    = User::where('email', 'dito@company.com')->first();
        $sari    = User::where('email', 'sari@company.com')->first();
        $rio     = User::where('email', 'rio@company.com')->first();
        $lia     = User::where('email', 'lia@company.com')->first();

        // 3 Pending_Approval
        $inc1 = $this->createIncident(
            reporter: $budi,
            title: 'Server Database Down',
            description: 'Database production tidak dapat diakses sejak pukul 09.00. Semua transaksi online terganggu dan customer tidak bisa melakukan order.',
            category: 'IT',
            priority: 'Critical',
            location: 'Data Center Lantai 2'
        );

        $inc2 = $this->createIncident(
            reporter: $rina,
            title: 'AC Lantai 3 Mati Total',
            description: 'AC di ruang meeting lantai 3 tidak berfungsi sejak pagi ini. Suhu ruangan menjadi sangat panas dan tidak nyaman untuk bekerja.',
            category: 'Facility',
            priority: 'High',
            location: 'Lantai 3, Ruang Meeting A'
        );

        $inc3 = $this->createIncident(
            reporter: $andi,
            title: 'Pintu Akses Lobby Utama Rusak',
            description: 'Pintu akses otomatis lobby utama tidak menutup sempurna, mengkhawatirkan keamanan gedung di luar jam kerja.',
            category: 'Security',
            priority: 'Medium',
            location: 'Lobby Utama'
        );

        // 4 In_Progress (1-2 assignees)
        $inc4 = $this->createAndApprove(
            reporter: $budi,
            approver: $hendra,
            assignees: [$dito, $sari],
            title: 'Email Internal Tidak Bisa Kirim',
            description: 'Beberapa staff tidak bisa mengirim email keluar sejak migrasi sistem kemarin. Mohon dicek konfigurasi mail server.',
            category: 'IT',
            priority: 'High',
            location: 'IT Infrastructure',
            approvalNotes: 'Prioritas tinggi, koordinasikan dengan tim network.'
        );
        $this->addProgressLogs($inc4, [$dito, $sari], 3);

        $inc5 = $this->createAndApprove(
            reporter: $rina,
            approver: $maya,
            assignees: [$rio],
            title: 'Lampu Koridor Lantai 4 Mati',
            description: 'Sebagian besar lampu koridor lantai 4 mati, area menjadi gelap dan berpotensi bahaya bagi karyawan yang lewat.',
            category: 'Facility',
            priority: 'Medium',
            location: 'Lantai 4 Koridor'
        );
        $this->addProgressLogs($inc5, [$rio], 2);

        $inc6 = $this->createAndApprove(
            reporter: $andi,
            approver: $hendra,
            assignees: [$lia, $rio],
            title: 'Kebocoran Pipa Toilet Lantai 2',
            description: 'Pipa air di toilet lantai 2 sebelah timur bocor dan menggenang. Air mulai merembes ke area kerja sebelah.',
            category: 'Facility',
            priority: 'High',
            location: 'Toilet Lantai 2 Timur'
        );
        $this->addProgressLogs($inc6, [$lia, $rio], 3);

        $inc7 = $this->createAndApprove(
            reporter: $budi,
            approver: $maya,
            assignees: [$dito],
            title: 'WiFi Lemot di Area Engineering',
            description: 'Sinyal WiFi di area engineering sangat lambat terutama saat meeting. Kecepatan download kurang dari 1 Mbps.',
            category: 'IT',
            priority: 'Medium',
            location: 'Lantai 5 Engineering'
        );
        $this->addProgressLogs($inc7, [$dito], 2);

        // 5 Resolved
        $inc8 = $this->createAndApprove(
            reporter: $budi,
            approver: $hendra,
            assignees: [$dito],
            title: 'Printer Lantai 3 Error',
            description: 'Printer bersama di lantai 3 selalu paper jam. Sudah dicoba restart tetap tidak bisa正常使用.',
            category: 'IT',
            priority: 'Low',
            location: 'Lantai 3 Ruang Administrasi',
            approvalNotes: 'Sudah dilaporkan vendor, mohon ditangani cepat.'
        );
        $this->addProgressLogs($inc8, [$dito], 3);
        $this->resolveIncident($inc8, $dito, 'Printer sudah dibersihkan dan cartridge diganti. Sudah tested print 50 halaman tanpa error.');

        $inc9 = $this->createAndApprove(
            reporter: $rina,
            approver: $maya,
            assignees: [$lia],
            title: 'Kursi Kerja Pecah',
            description: 'Kursi kerja staff HR di lantai 4 tiba-tiba patah bagian sandaran. Beruntung tidak ada yang terluka saat kejadian.',
            category: 'Facility',
            priority: 'Low',
            location: 'Lantai 4 HR',
            approvalNotes: 'Cek semua kursi kerja sejenis di area yang sama.'
        );
        $this->addProgressLogs($inc9, [$lia], 2);
        $this->resolveIncident($inc9, $lia, 'Kursi rusak sudah diganti baru. Sisa 5 kursi sejenis sudah diperiksa dan kondisinya masih baik.');

        $inc10 = $this->createAndApprove(
            reporter: $andi,
            approver: $hendra,
            assignees: [$rio, $lia],
            title: 'Layanan Catering Bermasalah',
            description: 'Vendor catering untuk makan siang staff terlambat dan kualitas makanan menurun. Banyak komplain dari karyawan.',
            category: 'Other',
            priority: 'Medium',
            location: 'Pantry Lantai 3'
        );
        $this->addProgressLogs($inc10, [$rio, $lia], 4);
        $this->resolveIncident($inc10, $rio, 'Vendor sudah ditegur dan komitmen perbaiki kualitas. Compensation snack box sudah diberikan untuk staff yang terdampak.');

        $inc11 = $this->createAndApprove(
            reporter: $budi,
            approver: $maya,
            assignees: [$sari],
            title: 'Aplikasi Mobile Error Login',
            description: 'User tidak bisa login ke aplikasi mobile menggunakan akun SSO. Error muncul "session expired" terus-menerus.',
            category: 'IT',
            priority: 'High',
            location: 'Mobile Platform'
        );
        $this->addProgressLogs($inc11, [$sari], 3);
        $this->resolveIncident($inc11, $sari, 'Bugfix sudah di-deploy ke production. Session token TTL disesuaikan. Sudah diverifikasi 10 user berhasil login normal.');

        $inc12 = $this->createAndApprove(
            reporter: $rina,
            approver: $hendra,
            assignees: [$dito],
            title: 'Proyektor Meeting Rusak',
            description: 'Proyektor di ruang meeting B tidak mau menyala. Lampu indikator berkedip merah terus.',
            category: 'IT',
            priority: 'Medium',
            location: 'Ruang Meeting B Lantai 3'
        );
        $this->addProgressLogs($inc12, [$dito], 2);
        $this->resolveIncident($inc12, $dito, 'Lampu proyektor diganti baru. Garansi 6 bulan. Test presentasi 2 jam tanpa masalah.');

        // 3 Rejected
        $inc13 = Incident::create([
            'title'            => 'Permintaan Kursi Tambahan (Duplikat)',
            'description'      => 'Mohon tambahan 1 unit kursi kerja untuk staff baru di divisi Engineering. Sudah dilaporkan minggu lalu juga.',
            'category'         => 'Facility',
            'priority'         => 'Low',
            'status'           => 'Rejected',
            'reporter_id'      => $andi->id,
            'approver_id'      => $hendra->id,
            'rejection_reason' => 'Laporan duplikat dengan tiket #5 yang sudah diproses. Mohon periksa daftar tiket sebelum membuat laporan baru.',
            'rejected_at'      => now()->subDays(7),
        ]);
        IncidentLog::create([
            'incident_id' => $inc13->id,
            'author_id'   => $andi->id,
            'author_role' => 'reporter',
            'log_type'    => 'created',
            'message'     => 'Insiden dilaporkan.',
            'created_at'  => now()->subDays(8),
        ]);
        IncidentLog::create([
            'incident_id' => $inc13->id,
            'author_id'   => $hendra->id,
            'author_role' => 'approver',
            'log_type'    => 'declined',
            'message'     => 'Insiden ditolak. Alasan: Laporan duplikat dengan tiket #5 yang sudah diproses. Mohon periksa daftar tiket sebelum membuat laporan baru.',
            'created_at'  => now()->subDays(7),
        ]);

        $inc14 = Incident::create([
            'title'            => 'Permohonan Internet Cepat (Tidak Termasuk Cakupan)',
            'description'      => 'Mohon upgrade bandwidth internet kantor menjadi 1 Gbps untuk kebutuhan kerja yang lebih cepat.',
            'category'         => 'IT',
            'priority'         => 'Low',
            'status'           => 'Rejected',
            'reporter_id'      => $budi->id,
            'approver_id'      => $maya->id,
            'rejection_reason' => 'Permintaan perubahan infrastruktur bukan merupakan insiden. Mohon ajukan melalui kanal procurement yang sesuai.',
            'rejected_at'      => now()->subDays(3),
        ]);
        IncidentLog::create([
            'incident_id' => $inc14->id,
            'author_id'   => $budi->id,
            'author_role' => 'reporter',
            'log_type'    => 'created',
            'message'     => 'Insiden dilaporkan.',
            'created_at'  => now()->subDays(4),
        ]);
        IncidentLog::create([
            'incident_id' => $inc14->id,
            'author_id'   => $maya->id,
            'author_role' => 'approver',
            'log_type'    => 'declined',
            'message'     => 'Insiden ditolak. Alasan: Permintaan perubahan infrastruktur bukan merupakan insiden. Mohon ajukan melalui kanal procurement yang sesuai.',
            'created_at'  => now()->subDays(3),
        ]);

        $inc15 = Incident::create([
            'title'            => 'Vending Machine Lantai 2 Tidak Berfungsi',
            'description'      => 'Mesin vending di lantai 2 tidak mau mengeluarkan minuman setelah pembayaran. Uang sudah terpotong.',
            'category'         => 'Other',
            'priority'         => 'Low',
            'status'           => 'Rejected',
            'reporter_id'      => $andi->id,
            'approver_id'      => $hendra->id,
            'rejection_reason' => 'Vending machine bukan aset perusahaan (milik vendor). Silakan hubungi vendor terkait untuk keluhan serupa.',
            'rejected_at'      => now()->subDays(1),
        ]);
        IncidentLog::create([
            'incident_id' => $inc15->id,
            'author_id'   => $andi->id,
            'author_role' => 'reporter',
            'log_type'    => 'created',
            'message'     => 'Insiden dilaporkan.',
            'created_at'  => now()->subDays(2),
        ]);
        IncidentLog::create([
            'incident_id' => $inc15->id,
            'author_id'   => $hendra->id,
            'author_role' => 'approver',
            'log_type'    => 'declined',
            'message'     => 'Insiden ditolak. Alasan: Vending machine bukan aset perusahaan (milik vendor). Silakan hubungi vendor terkait untuk keluhan serupa.',
            'created_at'  => now()->subDays(1),
        ]);
    }

    private function createIncident(
        $reporter, string $title, string $description, string $category,
        string $priority, ?string $location = null
    ): Incident {
        $incident = Incident::create([
            'title'       => $title,
            'description' => $description,
            'category'    => $category,
            'priority'    => $priority,
            'location'    => $location,
            'status'      => 'Pending_Approval',
            'reporter_id' => $reporter->id,
        ]);

        IncidentLog::create([
            'incident_id' => $incident->id,
            'author_id'   => $reporter->id,
            'author_role' => 'reporter',
            'log_type'    => 'created',
            'message'     => 'Insiden dilaporkan.',
        ]);

        return $incident;
    }

    private function createAndApprove(
        $reporter, $approver, array $assignees, string $title, string $description,
        string $category, string $priority, ?string $location = null, ?string $approvalNotes = null
    ): Incident {
        $incident = $this->createIncident($reporter, $title, $description, $category, $priority, $location);

        $incident->update([
            'status'         => 'In_Progress',
            'approver_id'    => $approver->id,
            'approval_notes' => $approvalNotes,
            'approved_at'    => now()->subDays(rand(1, 5)),
        ]);

        foreach ($assignees as $a) {
            IncidentAssignee::create([
                'incident_id' => $incident->id,
                'user_id'     => $a->id,
                'assigned_by' => $approver->id,
                'assigned_at' => now()->subDays(rand(1, 5)),
            ]);
        }

        $names = collect($assignees)->pluck('name')->join(', ');
        IncidentLog::create([
            'incident_id' => $incident->id,
            'author_id'   => $approver->id,
            'author_role' => 'approver',
            'log_type'    => 'approved',
            'message'     => "Insiden disetujui dan ditugaskan kepada: {$names}.",
            'meta'        => ['assignee_ids' => collect($assignees)->pluck('id')->all()],
        ]);

        return $incident;
    }

    private function addProgressLogs(Incident $incident, array $assignees, int $count): void
    {
        $messages = [
            'Sedang mendiagnosa masalah di lapangan.',
            'Sudah koordinasi dengan vendor terkait.',
            'Menunggu spare part dari gudang.',
            'Update: progress sudah 50%, estimasi selesai sore ini.',
            'Pengecekan awal sudah dilakukan, masalah teridentifikasi.',
            'Spare part sudah sampai, sedang instalasi.',
            'Testing awal berhasil, akan monitoring 1 jam ke depan.',
            'PIC sudah konfirmasi, menunggu approval final.',
        ];

        for ($i = 0; $i < $count; $i++) {
            $assignee = $assignees[array_rand($assignees)];
            IncidentLog::create([
                'incident_id' => $incident->id,
                'author_id'   => $assignee->id,
                'author_role' => 'assignee',
                'log_type'    => 'progress_update',
                'message'     => $messages[array_rand($messages)],
                'created_at'  => now()->subDays(rand(1, 4))->subHours(rand(0, 23)),
            ]);
        }
    }

    private function resolveIncident(Incident $incident, $assignee, string $notes): void
    {
        $incident->update([
            'status'           => 'Resolved',
            'resolution_notes' => $notes,
            'resolved_at'      => now()->subDays(rand(0, 1))->subHours(rand(1, 12)),
        ]);

        IncidentLog::create([
            'incident_id' => $incident->id,
            'author_id'   => $assignee->id,
            'author_role' => 'assignee',
            'log_type'    => 'resolved',
            'message'     => "Insiden diselesaikan. Catatan: {$notes}",
        ]);
    }
}