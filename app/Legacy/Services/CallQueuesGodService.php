<?php

namespace App\Legacy\Services;

class CallQueuesGodService extends AbstractGodService
{
    protected string $table = 'ivr_call_queues';

    protected array $allowedFields = ['name', 'payload', 'strategy'];
}
