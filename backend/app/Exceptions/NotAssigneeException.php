<?php

namespace App\Exceptions;

use Exception;

class NotAssigneeException extends Exception
{
    public function __construct(string $message = 'Anda tidak ter-assign ke insiden ini.')
    {
        parent::__construct($message);
    }
}