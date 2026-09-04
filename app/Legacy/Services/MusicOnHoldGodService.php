<?php

namespace App\Legacy\Services;

class MusicOnHoldGodService extends AbstractGodService
{
    protected string $table = 'ivr_music_on_hold';

    protected array $allowedFields = ['name', 'payload', 'audio_file'];
}
