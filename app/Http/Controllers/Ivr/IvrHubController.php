<?php

namespace App\Http\Controllers\Ivr;

use App\Http\Controllers\Controller;
use App\Support\IvrAccountContext;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class IvrHubController extends Controller
{
    public function index(Request $request)
    {
        $ctx = IvrAccountContext::fromRequest($request);
        $filters = $this->filtersFromRequest($request);

        $payload = $this->buildDashboardPayload($ctx, $filters);

        return Inertia::render('Ivr/Hub/Index', array_merge($payload, [
            'filters' => $filters,
            'queueOptions' => $this->queueOptions($ctx),
            'dispositionOptions' => $this->dispositionOptions($ctx),
            'organizationOptions' => IvrAccountContext::organizationOptions($ctx->accountId),
            'accountName' => $request->user()->account->name,
            'refreshedAt' => now()->toIso8601String(),
        ]));
    }

    public function data(Request $request)
    {
        $ctx = IvrAccountContext::fromRequest($request);
        $filters = $this->filtersFromRequest($request);

        return response()->json(array_merge(
            $this->buildDashboardPayload($ctx, $filters),
            ['refreshedAt' => now()->toIso8601String()],
        ));
    }

    private function filtersFromRequest(Request $request): array
    {
        return [
            'date' => $request->input('date', Carbon::today()->toDateString()),
            'queue_id' => $request->input('queue_id'),
            'disposition' => $request->input('disposition'),
            'search' => $request->input('search'),
            'organization_id' => $request->input('organization_id'),
        ];
    }

    private function buildDashboardPayload(IvrAccountContext $ctx, array $filters): array
    {
        return [
            'stats' => $this->loadStats($ctx, $filters),
            'callVolumeByHour' => $this->loadHourlyVolume($ctx, $filters['date']),
            'callTrend' => $this->loadDailyTrend($ctx, $filters['date']),
            'queueDistribution' => $this->loadQueueDistribution($ctx, $filters),
            'queueMetrics' => $this->loadQueueMetrics($ctx, $filters),
            'recentCalls' => $this->loadRecentCalls($ctx, $filters),
            'agentSnapshot' => $this->loadAgents($ctx, $filters),
        ];
    }

    private function loadStats(IvrAccountContext $ctx, array $filters): array
    {
        $queueQuery = DB::table('ivr_operational_queues')->where('account_id', $ctx->accountId);
        $ctx->scopeOrganizationOn($queueQuery);
        if ($filters['queue_id']) {
            $queueQuery->where('id', $filters['queue_id']);
        }

        $queues = $queueQuery->get();
        $queueIds = $queues->pluck('id')->all();

        $agentsQuery = DB::table('ivr_agents')->where('account_id', $ctx->accountId);
        if ($filters['queue_id']) {
            $agentsQuery->where('queue_id', $filters['queue_id']);
        } elseif ($ctx->organizationId && $queueIds !== []) {
            $agentsQuery->whereIn('queue_id', $queueIds);
        } elseif ($ctx->organizationId) {
            $agentsQuery->whereRaw('1 = 0');
        }

        $agentsOnline = (clone $agentsQuery)
            ->whereIn('status', ['Available', 'On Call', 'Wrap-up'])
            ->count();

        $onCallAgents = (clone $agentsQuery)->where('status', 'On Call')->count();

        $callsQuery = DB::table('ivr_call_records')
            ->where('account_id', $ctx->accountId)
            ->whereDate('started_at', $filters['date']);
        $ctx->scopeOrganizationOn($callsQuery);
        if ($filters['queue_id']) {
            $callsQuery->where('queue_id', $filters['queue_id']);
        }
        if ($filters['disposition']) {
            $callsQuery->where('disposition', $filters['disposition']);
        }
        if ($filters['search']) {
            $callsQuery->where(function ($q) use ($filters) {
                $q->where('caller', 'like', '%'.$filters['search'].'%')
                    ->orWhere('external_id', 'like', '%'.$filters['search'].'%');
            });
        }

        $totalCalls = (clone $callsQuery)->count();
        $abandoned = (clone $callsQuery)->where('disposition', 'Abandoned')->count();
        $avgHandle = (clone $callsQuery)->where('duration_sec', '>', 0)->avg('duration_sec');

        $slaWeighted = $queues->count() > 0
            ? round((float) $queues->avg('sla_pct'), 1)
            : 0.0;

        $queued = (int) $queues->sum('waiting');

        return [
            'active_calls' => $onCallAgents + $queued,
            'queued_calls' => $queued,
            'agents_online' => $agentsOnline,
            'service_level_pct' => $slaWeighted,
            'avg_handle_time_sec' => (int) round($avgHandle ?? 0),
            'abandon_rate_pct' => $totalCalls > 0 ? round(($abandoned / $totalCalls) * 100, 1) : 0.0,
        ];
    }

    private function loadHourlyVolume(IvrAccountContext $ctx, string $date): array
    {
        if ($ctx->organizationId) {
            $rows = DB::table('ivr_call_records')
                ->where('account_id', $ctx->accountId)
                ->where('organization_id', $ctx->organizationId)
                ->whereDate('started_at', $date)
                ->selectRaw('CAST(strftime(\'%H\', started_at) AS INTEGER) as hour_sort, count(*) as inbound_count')
                ->groupBy('hour_sort')
                ->orderBy('hour_sort')
                ->get();

            return $rows->map(fn ($row) => [
                'label' => $this->hourLabel((int) $row->hour_sort),
                'value' => (int) $row->inbound_count,
                'color' => '#6366f1',
            ])->all();
        }

        return DB::table('ivr_hourly_volumes')
            ->where('account_id', $ctx->accountId)
            ->whereDate('stat_date', $date)
            ->orderBy('hour_sort')
            ->get()
            ->map(fn ($row) => [
                'label' => $row->hour_label,
                'value' => (int) $row->inbound_count,
                'color' => $row->bar_color ?? '#6366f1',
            ])
            ->all();
    }

    private function loadDailyTrend(IvrAccountContext $ctx, string $date): array
    {
        $weekStart = Carbon::parse($date)->startOfWeek();

        if ($ctx->organizationId) {
            $weekEnd = $weekStart->copy()->endOfWeek();
            $rows = DB::table('ivr_call_records')
                ->where('account_id', $ctx->accountId)
                ->where('organization_id', $ctx->organizationId)
                ->whereBetween('started_at', [$weekStart->startOfDay(), $weekEnd->endOfDay()])
                ->selectRaw('CAST(strftime(\'%w\', started_at) AS INTEGER) as day_sort, disposition, count(*) as total')
                ->groupBy('day_sort', 'disposition')
                ->get();

            $byDay = [];
            foreach ($rows as $row) {
                $sort = (int) $row->day_sort;
                if ($sort === 0) {
                    $sort = 7;
                }
                if (! isset($byDay[$sort])) {
                    $byDay[$sort] = ['answered' => 0, 'abandoned' => 0];
                }
                if ($row->disposition === 'Abandoned') {
                    $byDay[$sort]['abandoned'] += (int) $row->total;
                } else {
                    $byDay[$sort]['answered'] += (int) $row->total;
                }
            }

            $labels = [1 => 'Mon', 2 => 'Tue', 3 => 'Wed', 4 => 'Thu', 5 => 'Fri', 6 => 'Sat', 7 => 'Sun'];
            $out = [];
            for ($d = 1; $d <= 7; $d++) {
                $out[] = [
                    'label' => $labels[$d],
                    'answered' => $byDay[$d]['answered'] ?? 0,
                    'abandoned' => $byDay[$d]['abandoned'] ?? 0,
                ];
            }

            return $out;
        }

        return DB::table('ivr_daily_trends')
            ->where('account_id', $ctx->accountId)
            ->whereDate('week_start', $weekStart)
            ->orderBy('day_sort')
            ->get()
            ->map(fn ($row) => [
                'label' => $row->day_label,
                'answered' => (int) $row->answered,
                'abandoned' => (int) $row->abandoned,
            ])
            ->all();
    }

    private function loadQueueDistribution(IvrAccountContext $ctx, array $filters): array
    {
        $since = now()->subHour();

        $rows = DB::table('ivr_call_records as c')
            ->join('ivr_operational_queues as q', 'q.id', '=', 'c.queue_id')
            ->where('c.account_id', $ctx->accountId)
            ->where('c.started_at', '>=', $since)
            ->when($ctx->organizationId, fn ($q) => $q->where('c.organization_id', $ctx->organizationId))
            ->when($filters['queue_id'], fn ($q) => $q->where('c.queue_id', $filters['queue_id']))
            ->select('q.category', DB::raw('count(*) as total'))
            ->groupBy('q.category')
            ->get();

        if ($rows->isEmpty()) {
            $fallback = DB::table('ivr_operational_queues')
                ->where('account_id', $ctx->accountId);
            $ctx->scopeOrganizationOn($fallback);
            if ($filters['queue_id']) {
                $fallback->where('id', $filters['queue_id']);
            }

            return $fallback
                ->select('category as label', DB::raw('sum(waiting) as value'), DB::raw('max(chart_color) as color'))
                ->groupBy('category')
                ->get()
                ->map(fn ($r) => ['label' => $r->label, 'value' => (int) $r->value, 'color' => $r->color ?? '#6366f1'])
                ->all();
        }

        $colors = ['Sales' => '#6366f1', 'Support' => '#22c55e', 'Billing' => '#f59e0b', 'Overflow' => '#94a3b8'];

        return $rows->map(fn ($r) => [
            'label' => $r->category,
            'value' => (int) $r->total,
            'color' => $colors[$r->category] ?? '#6366f1',
        ])->all();
    }

    private function loadQueueMetrics(IvrAccountContext $ctx, array $filters): array
    {
        $query = DB::table('ivr_operational_queues as q')
            ->leftJoin('organizations as o', 'o.id', '=', 'q.organization_id')
            ->where('q.account_id', $ctx->accountId)
            ->select('q.*', 'o.name as organization_name');
        if ($ctx->organizationId) {
            $query->where('q.organization_id', $ctx->organizationId);
        }
        if ($filters['queue_id']) {
            $query->where('q.id', $filters['queue_id']);
        }

        return $query->orderBy('q.name')->get()->map(fn ($row) => [
            'id' => $row->id,
            'queue' => $row->name,
            'organization' => $row->organization_name ?? '—',
            'waiting' => (int) $row->waiting,
            'longest_wait_sec' => (int) $row->longest_wait_sec,
            'agents' => (int) $row->agents_available,
            'sla_pct' => (float) $row->sla_pct,
            'status' => $row->status,
        ])->all();
    }

    private function loadRecentCalls(IvrAccountContext $ctx, array $filters): array
    {
        return DB::table('ivr_call_records as c')
            ->leftJoin('ivr_operational_queues as q', 'q.id', '=', 'c.queue_id')
            ->leftJoin('organizations as o', 'o.id', '=', 'c.organization_id')
            ->where('c.account_id', $ctx->accountId)
            ->whereDate('c.started_at', $filters['date'])
            ->when($ctx->organizationId, fn ($q) => $q->where('c.organization_id', $ctx->organizationId))
            ->when($filters['queue_id'], fn ($q) => $q->where('c.queue_id', $filters['queue_id']))
            ->when($filters['disposition'], fn ($q) => $q->where('c.disposition', $filters['disposition']))
            ->when($filters['search'], function ($q) use ($filters) {
                $q->where(function ($inner) use ($filters) {
                    $inner->where('c.caller', 'like', '%'.$filters['search'].'%')
                        ->orWhere('c.external_id', 'like', '%'.$filters['search'].'%');
                });
            })
            ->orderByDesc('c.started_at')
            ->limit(25)
            ->get(['c.external_id as id', 'c.caller', 'q.name as queue', 'c.agent_name as agent', 'c.duration_sec', 'c.disposition', 'c.started_at', 'o.name as organization'])
            ->map(fn ($row) => [
                'id' => $row->id,
                'caller' => $row->caller,
                'queue' => $row->queue ?? '—',
                'agent' => $row->agent ?? '—',
                'organization' => $row->organization ?? '—',
                'duration_sec' => (int) $row->duration_sec,
                'disposition' => $row->disposition ?? '—',
                'started_at' => Carbon::parse($row->started_at)->format('H:i:s'),
            ])
            ->all();
    }

    private function loadAgents(IvrAccountContext $ctx, array $filters): array
    {
        $query = DB::table('ivr_agents as a')
            ->leftJoin('ivr_operational_queues as q', 'q.id', '=', 'a.queue_id')
            ->where('a.account_id', $ctx->accountId);

        if ($filters['queue_id']) {
            $query->where('a.queue_id', $filters['queue_id']);
        } elseif ($ctx->organizationId) {
            $queueIds = $ctx->queueIdsForScope();
            if ($queueIds === []) {
                return [];
            }
            $query->whereIn('a.queue_id', $queueIds);
        }

        return $query->orderBy('a.name')
            ->get(['a.name', 'a.extension', 'a.status', 'q.name as queue', 'a.calls_today'])
            ->map(fn ($row) => [
                'name' => $row->name,
                'extension' => $row->extension,
                'status' => $row->status,
                'queue' => $row->queue ?? '—',
                'calls_today' => (int) $row->calls_today,
            ])
            ->all();
    }

    private function queueOptions(IvrAccountContext $ctx): array
    {
        $query = DB::table('ivr_operational_queues')
            ->where('account_id', $ctx->accountId);
        $ctx->scopeOrganizationOn($query);

        return $query->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($q) => ['id' => $q->id, 'name' => $q->name])
            ->all();
    }

    private function dispositionOptions(IvrAccountContext $ctx): array
    {
        $query = DB::table('ivr_call_records')
            ->where('account_id', $ctx->accountId);
        $ctx->scopeOrganizationOn($query);

        return $query->whereNotNull('disposition')
            ->distinct()
            ->orderBy('disposition')
            ->pluck('disposition')
            ->all();
    }

    private function hourLabel(int $hour): string
    {
        if ($hour === 0) {
            return '12a';
        }
        if ($hour < 12) {
            return $hour.'a';
        }
        if ($hour === 12) {
            return '12p';
        }

        return ($hour - 12).'p';
    }

}
