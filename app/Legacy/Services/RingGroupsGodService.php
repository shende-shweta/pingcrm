<?php

namespace App\Legacy\Services;

class RingGroupsGodService extends AbstractGodService
{
    protected string $table = 'ivr_ring_groups';

    protected array $allowedFields = ['name', 'payload', 'strategy'];
}
