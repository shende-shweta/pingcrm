<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class IvrSyncJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly string $table,
        public readonly int $accountId,
        public readonly array $payload
    ) {}

    public function handle(): void
    {
        Log::info('IvrSyncJob dispatched', [
            'table' => $this->table,
            'account_id' => $this->accountId,
            'payload_keys' => array_keys($this->payload),
        ]);

        // @todo Redmine #17 (Open Question #1) — replace this log-only skeleton once the
        //       remote sync target is confirmed and the design decision is closed.
    }
}
