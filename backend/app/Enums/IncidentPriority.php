<?php

namespace App\Enums;

enum IncidentPriority: string
{
    case LOW      = 'Low';
    case MEDIUM   = 'Medium';
    case HIGH     = 'High';
    case CRITICAL = 'Critical';

    public function label(): string
    {
        return match ($this) {
            self::LOW      => 'Low',
            self::MEDIUM   => 'Medium',
            self::HIGH     => 'High',
            self::CRITICAL => 'Critical',
        };
    }

    public function weight(): int
    {
        return match ($this) {
            self::LOW      => 1,
            self::MEDIUM   => 2,
            self::HIGH     => 3,
            self::CRITICAL => 4,
        };
    }
}