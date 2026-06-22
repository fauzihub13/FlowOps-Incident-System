<?php

namespace App\Enums;

enum IncidentStatus: string
{
    case PENDING_APPROVAL = 'Pending_Approval';
    case IN_PROGRESS      = 'In_Progress';
    case RESOLVED         = 'Resolved';
    case REJECTED         = 'Rejected';

    public function label(): string
    {
        return match ($this) {
            self::PENDING_APPROVAL => 'Menunggu Persetujuan',
            self::IN_PROGRESS      => 'Sedang Dikerjakan',
            self::RESOLVED         => 'Selesai',
            self::REJECTED         => 'Ditolak',
        };
    }

    public function isFinal(): bool
    {
        return in_array($this, [self::RESOLVED, self::REJECTED], true);
    }
}