<?php

namespace App\Legacy\Services;

class BusinessHoursGodService extends AbstractGodService
{
    protected string $table = 'ivr_business_hours';

    protected array $allowedFields = ['name', 'payload', 'schedule'];
}
