<?php

namespace App\Legacy\Services;

class OutboundRoutesGodService extends AbstractGodService
{
    protected string $table = 'ivr_outbound_routes';

    protected array $allowedFields = ['name', 'payload', 'pattern'];
}
