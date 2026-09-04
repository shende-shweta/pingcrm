<?php

namespace App\Legacy\Services;

class TrunksGodService extends AbstractGodService
{
    protected string $table = 'ivr_trunks';

    protected array $allowedFields = ['name', 'payload', 'host'];
}
