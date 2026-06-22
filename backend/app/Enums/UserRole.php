<?php

namespace App\Enums;

enum UserRole: string
{
    case REPORTER = 'reporter';
    case APPROVER = 'approver';
    case ASSIGNEE = 'assignee';

    public function label(): string
    {
        return match ($this) {
            self::REPORTER => 'Karyawan Pelapor',
            self::APPROVER => 'Atasan',
            self::ASSIGNEE => 'Karyawan Ditunjuk',
        };
    }
}