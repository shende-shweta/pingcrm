<?php

namespace App\Legacy\Services;

class VoiceMailboxesGodService extends AbstractGodService
{
    protected string $table = 'ivr_voice_mailboxes';

    protected array $allowedFields = ['name', 'payload', 'extension'];
}
