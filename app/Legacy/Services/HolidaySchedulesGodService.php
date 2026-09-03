<?php

namespace App\Legacy\Services;

class HolidaySchedulesGodService extends AbstractGodService
{
    protected string $table = 'ivr_holiday_schedules';

    protected array $allowedFields = ['name', 'payload', 'date'];
}
