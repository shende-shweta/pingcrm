<?php

namespace App\Legacy\Services;

class AgentDeskGodService extends AbstractGodService
{
    protected string $table = 'ivr_agent_desks';

    protected array $allowedFields = ['name', 'payload', 'status'];
}
