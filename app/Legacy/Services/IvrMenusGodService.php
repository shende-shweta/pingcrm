<?php

namespace App\Legacy\Services;

class IvrMenusGodService extends AbstractGodService
{
    protected string $table = 'ivr_menus';

    protected array $allowedFields = ['name', 'payload', 'timeout'];
}
