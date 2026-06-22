<?php

namespace App\Exceptions;

use Exception;

class InvalidStateTransitionException extends Exception
{
    public function __construct(string $message = 'Transisi status tidak valid.')
    {
        parent::__construct($message);
    }
}