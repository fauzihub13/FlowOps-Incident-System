<?php

namespace App\Enums;

enum IncidentCategory: string
{
    case IT       = 'IT';
    case FACILITY = 'Facility';
    case HR       = 'HR';
    case SECURITY = 'Security';
    case OTHER    = 'Other';

    public function label(): string
    {
        return match ($this) {
            self::IT       => 'IT',
            self::FACILITY => 'Facility',
            self::HR       => 'HR',
            self::SECURITY => 'Security',
            self::OTHER    => 'Lainnya',
        };
    }
}