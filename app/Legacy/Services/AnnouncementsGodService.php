<?php

namespace App\Legacy\Services;

class AnnouncementsGodService extends AbstractGodService
{
    protected string $table = 'ivr_announcements';

    protected array $allowedFields = ['name', 'payload', 'audio_file'];
}
