<?php

namespace App\Legacy\Services;

class TimeConditionsGodService extends AbstractGodService
{
    protected string $table = 'ivr_time_conditions';

    protected array $allowedFields = ['name', 'payload', 'condition'];
}
