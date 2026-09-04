<?php

namespace App\Http\Controllers\Ivr\Concerns;

use App\Http\Controllers\Ivr\IvrModuleController;
use App\Support\IvrAccountContext;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

trait LoadsIvrModuleData
{
    private array $allowedModules = [
        'CallFlow',
        'PromptLibrary',
        'BusinessHours',
        'DidInventory',
        'CallRecording',
        'CustomerProfile',
        'CrmBridge',
        'ApiIntegration',
        'NotificationHub',
        'RoleAccess',
        'AuditTrail',
        'TenantAdmin',
        'SystemConfig',
    ];

    protected function columnsForView(string $view): array
    {
        return match ($view) {
            'queues' => [
                ['key' => 'name', 'label' => 'Queue'],
                ['key' => 'organization', 'label' => 'Organization'],
                ['key' => 'waiting', 'label' => 'Waiting'],
                ['key' => 'longest_wait', 'label' => 'Longest wait'],
                ['key' => 'agents', 'label' => 'Agents'],
                ['key' => 'sla_pct', 'label' => 'SLA %'],
                ['key' => 'status', 'label' => 'Status'],
            ],
            'agents' => [
                ['key' => 'name', 'label' => 'Agent'],
                ['key' => 'extension', 'label' => 'Extension'],
                ['key' => 'status', 'label' => 'Status'],
                ['key' => 'organization', 'label' => 'Organization'],
                ['key' => 'queue', 'label' => 'Queue'],
                ['key' => 'calls_today', 'label' => 'Calls today'],
            ],
            'calls' => [
                ['key' => 'id', 'label' => 'Call ID'],
                ['key' => 'caller', 'label' => 'Caller'],
                ['key' => 'organization', 'label' => 'Organization'],
                ['key' => 'queue', 'label' => 'Queue'],
                ['key' => 'agent', 'label' => 'Agent'],
                ['key' => 'duration', 'label' => 'Duration'],
                ['key' => 'disposition', 'label' => 'Disposition'],
                ['key' => 'started_at', 'label' => 'Started'],
            ],
            'hourly' => [
                ['key' => 'hour', 'label' => 'Hour'],
                ['key' => 'inbound', 'label' => 'Inbound calls'],
            ],
            'trends' => [
                ['key' => 'day', 'label' => 'Day'],
                ['key' => 'answered', 'label' => 'Answered'],
                ['key' => 'abandoned', 'label' => 'Abandoned'],
            ],
            default => [
                ['key' => 'name', 'label' => 'Name'],
                ['key' => 'summary', 'label' => 'Configuration'],
                ['key' => 'updated_at', 'label' => 'Updated'],
            ],
        };
    }

    protected function loadModuleRows(Request $request, string $moduleSlug, string $view, array $filters): array
    {
        $ctx = IvrAccountContext::fromRequest($request);
        $q = $filters['q'] ?? '';

        return match ($view) {
            'queues' => $this->loadQueueRows($ctx, $q),
            'agents' => $this->loadAgentRows($ctx, $q),
            'calls' => $this->loadCallRows($ctx, $q),
            'hourly' => $this->loadHourlyRows($ctx),
            'trends' => $this->loadTrendRows($ctx),
            default => $this->loadConfigRows($this->moduleKeyForSlug($moduleSlug), $ctx, $q),
        };
    }

    protected function moduleKeyForSlug(string $moduleSlug): string
    {
        return IvrModuleController::SLUG_MAP[$moduleSlug];
    }

    protected function loadQueueRows(IvrAccountContext $ctx, string $q): array
    {
        $query = DB::table('ivr_operational_queues as q')
            ->leftJoin('organizations as o', 'o.id', '=', 'q.organization_id')
            ->where('q.account_id', $ctx->accountId)
            ->select('q.*', 'o.name as organization_name');
        if ($ctx->organizationId) {
            $query->where('q.organization_id', $ctx->organizationId);
        }
        if ($q !== '') {
            $query->where(function ($inner) use ($q) {
                $inner->where('q.name', 'like', '%'.$q.'%')
                    ->orWhere('o.name', 'like', '%'.$q.'%');
            });
        }

        return $query->orderBy('q.name')->get()->map(fn ($r) => [
            'id' => $r->id,
            'name' => $r->name,
            'organization' => $r->organization_name ?? '\u2014',
            'waiting' => (int) $r->waiting,
            'longest_wait' => $this->formatModuleDuration((int) $r->longest_wait_sec),
            'agents' => (int) $r->agents_available,
            'sla_pct' => (float) $r->sla_pct,
            'status' => $r->status,
        ])->all();
    }

    protected function loadAgentRows(IvrAccountContext $ctx, string $q): array
    {
        $query = DB::table('ivr_agents as a')
            ->leftJoin('ivr_operational_queues as q', 'q.id', '=', 'a.queue_id')
            ->leftJoin('organizations as o', 'o.id', '=', 'q.organization_id')
            ->where('a.account_id', $ctx->accountId)
            ->select('a.*', 'q.name as queue_name', 'o.name as organization_name');

        if ($ctx->organizationId) {
            $query->where('q.organization_id', $ctx->organizationId);
        }

        if ($q !== '') {
            $query->where(function ($inner) use ($q) {
                $inner->where('a.name', 'like', '%'.$q.'%')
                    ->orWhere('a.extension', 'like', '%'.$q.'%');
            });
        }

        return $query->orderBy('a.name')->get()->map(fn ($r) => [
            'id' => $r->id,
            'name' => $r->name,
            'extension' => $r->extension,
            'status' => $r->status,
            'organization' => $r->organization_name ?? '\u2014',
            'queue' => $r->queue_name ?? '\u2014',
            'calls_today' => (int) $r->calls_today,
        ])->all();
    }

    protected function loadCallRows(IvrAccountContext $ctx, string $q): array
    {
        $query = DB::table('ivr_call_records as c')
            ->leftJoin('ivr_operational_queues as q', 'q.id', '=', 'c.queue_id')
            ->leftJoin('organizations as o', 'o.id', '=', 'c.organization_id')
            ->where('c.account_id', $ctx->accountId)
            ->when($ctx->organizationId, fn ($inner) => $inner->where('c.organization_id', $ctx->organizationId))
            ->select('c.*', 'q.name as queue_name', 'o.name as organization_name');

        if ($q !== '') {
            $query->where(function ($inner) use ($q) {
                $inner->where('c.caller', 'like', '%'.$q.'%')
                    ->orWhere('c.external_id', 'like', '%'.$q.'%');
            });
        }

        return $query->orderByDesc('c.started_at')->limit(50)->get()->map(fn ($r) => [
            'id' => $r->external_id,
            'caller' => $r->caller,
            'organization' => $r->organization_name ?? '\u2014',
            'queue' => $r->queue_name ?? '\u2014',
            'agent' => $r->agent_name ?? '\u2014',
            'duration' => $this->formatModuleDuration((int) $r->duration_sec),
            'disposition' => $r->disposition ?? '\u2014',
            'started_at' => Carbon::parse($r->started_at)->format('Y-m-d H:i:s'),
        ])->all();
    }

    protected function loadHourlyRows(IvrAccountContext $ctx): array
    {
        return DB::table('ivr_hourly_volumes')
            ->where('account_id', $ctx->accountId)
            ->whereDate('stat_date', Carbon::today())
            ->orderBy('hour_sort')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'hour' => $r->hour_label,
                'inbound' => (int) $r->inbound_count,
            ])
            ->all();
    }

    protected function loadTrendRows(IvrAccountContext $ctx): array
    {
        $weekStart = Carbon::today()->startOfWeek();

        return DB::table('ivr_daily_trends')
            ->where('account_id', $ctx->accountId)
            ->whereDate('week_start', $weekStart)
            ->orderBy('day_sort')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'day' => $r->day_label,
                'answered' => (int) $r->answered,
                'abandoned' => (int) $r->abandoned,
            ])
            ->all();
    }

    protected function loadConfigRows(string $module, IvrAccountContext $ctx, string $q): array
    {
        $table = $this->tableForModule($module);

        try {
            $query = DB::table($table)->where('account_id', $ctx->accountId);
            if ($q !== '') {
                $query->where('name', 'like', '%'.$q.'%');
            }

            return $query->orderByDesc('updated_at')->limit(100)->get()->map(function ($r) {
                $payload = $r->payload ?? null;
                if (is_string($payload)) {
                    $payload = json_decode($payload, true);
                }
                $summary = is_array($payload)
                    ? ($payload['summary'] ?? json_encode($payload))
                    : (string) $payload;

                return [
                    'id' => $r->id,
                    'name' => $r->name ?? '\u2014',
                    'summary' => is_string($summary) ? $summary : json_encode($summary),
                    'updated_at' => isset($r->updated_at) ? Carbon::parse($r->updated_at)->format('Y-m-d H:i') : '\u2014',
                ];
            })->all();
        } catch (\Throwable $e) {
            return [];
        }
    }

    protected function tableForModule(string $module): string
    {
        if (! in_array($module, $this->allowedModules)) {
            abort(404, 'Invalid module');
        }

        $snake = strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $module));

        return 'ivr_'.$snake.'s';
    }

    protected function formatModuleDuration(int $seconds): string
    {
        if ($seconds <= 0) {
            return '\u2014';
        }
        $m = intdiv($seconds, 60);
        $s = $seconds % 60;

        return sprintf('%d:%02d', $m, $s);
    }

    /** @return list<array{slug: string, title: string}> */
    protected function moduleTabCatalog(): array
    {
        $tabs = [];
        $preferredFirst = 'live-monitoring';
        if (isset(IvrModuleController::MODULE_META[$preferredFirst])) {
            $tabs[] = [
                'slug' => $preferredFirst,
                'title' => IvrModuleController::MODULE_META[$preferredFirst]['title'],
            ];
        }
        foreach (IvrModuleController::MODULE_META as $slug => $meta) {
            if ($slug === $preferredFirst) {
                continue;
            }
            $tabs[] = ['slug' => $slug, 'title' => $meta['title']];
        }

        return $tabs;
    }
}
