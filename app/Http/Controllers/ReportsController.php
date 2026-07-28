<?php

namespace App\Http\Controllers;

use App\Support\IvrAccountContext;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportsController extends Controller
{
    public function index(Request $request): Response
    {
        $ctx = IvrAccountContext::fromRequest($request);
        $from = $request->input('from', Carbon::today()->subDays(6)->toDateString());
        $to = $request->input('to', Carbon::today()->toDateString());

        return Inertia::render('Reports/Index', [
            'filters' => [
                'from' => $from,
                'to' => $to,
                'organization_id' => $request->input('organization_id'),
            ],
            'organizationOptions' => IvrAccountContext::organizationOptions($ctx->accountId),
            'accountName' => $request->user()->account->name,
            'dailyTrend' => $this->dailyTrend($ctx),
            'callSummary' => $this->callSummary($ctx, $from, $to),
            'queueSummary' => $this->queueSummary($ctx),
            'recentCalls' => $this->recentCallsForReport($ctx, $from, $to),
        ]);
    }

    public function download(Request $request): StreamedResponse
    {
        $ctx = IvrAccountContext::fromRequest($request);
        $type = $request->input('type', 'calls');
        $from = $request->input('from', Carbon::today()->subDays(6)->toDateString());
        $to = $request->input('to', Carbon::today()->toDateString());
        $filename = sprintf('pingcrm-report-%s-%s-%s.csv', $type, $from, $to);

        return response()->streamDownload(function () use ($type, $ctx, $from, $to) {
            $out = fopen('php://output', 'w');
            match ($type) {
                'daily' => $this->streamDailyCsv($out, $ctx),
                'queues' => $this->streamQueuesCsv($out, $ctx),
                default => $this->streamCallsCsv($out, $ctx, $from, $to),
            };
            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    private function dailyTrend(IvrAccountContext $ctx): array
    {
        $weekStart = Carbon::today()->startOfWeek();

        return DB::table('ivr_daily_trends')
            ->where('account_id', $ctx->accountId)
            ->whereDate('week_start', $weekStart)
            ->orderBy('day_sort')
            ->get()
            ->map(fn ($r) => [
                'day' => $r->day_label,
                'answered' => (int) $r->answered,
                'abandoned' => (int) $r->abandoned,
                'total' => (int) $r->answered + (int) $r->abandoned,
            ])
            ->all();
    }

    private function callSummary(IvrAccountContext $ctx, string $from, string $to): array
    {
        $base = DB::table('ivr_call_records')
            ->where('account_id', $ctx->accountId)
            ->whereDate('started_at', '>=', $from)
            ->whereDate('started_at', '<=', $to);
        $ctx->scopeOrganizationOn($base);

        $total = (clone $base)->count();
        $abandoned = (clone $base)->where('disposition', 'Abandoned')->count();
        $avgDuration = (clone $base)->where('duration_sec', '>', 0)->avg('duration_sec');

        return [
            'total_calls' => $total,
            'abandoned' => $abandoned,
            'answered_or_handled' => max(0, $total - $abandoned),
            'abandon_rate_pct' => $total > 0 ? round(($abandoned / $total) * 100, 1) : 0,
            'avg_duration_sec' => (int) round($avgDuration ?? 0),
        ];
    }

    private function queueSummary(IvrAccountContext $ctx): array
    {
        $query = DB::table('ivr_operational_queues')
            ->where('account_id', $ctx->accountId);
        $ctx->scopeOrganizationOn($query);

        return $query->orderBy('name')
            ->get()
            ->map(fn ($r) => [
                'queue' => $r->name,
                'waiting' => (int) $r->waiting,
                'sla_pct' => (float) $r->sla_pct,
                'status' => $r->status,
            ])
            ->all();
    }

    private function recentCallsForReport(IvrAccountContext $ctx, string $from, string $to): array
    {
        return DB::table('ivr_call_records as c')
            ->leftJoin('ivr_operational_queues as q', 'q.id', '=', 'c.queue_id')
            ->leftJoin('organizations as o', 'o.id', '=', 'c.organization_id')
            ->where('c.account_id', $ctx->accountId)
            ->when($ctx->organizationId, fn ($q) => $q->where('c.organization_id', $ctx->organizationId))
            ->whereDate('c.started_at', '>=', $from)
            ->whereDate('c.started_at', '<=', $to)
            ->orderByDesc('c.started_at')
            ->limit(50)
            ->get([
                'c.external_id as id',
                'c.caller',
                'q.name as queue',
                'c.agent_name as agent',
                'c.duration_sec',
                'c.disposition',
                'c.started_at',
                'o.name as organization',
            ])
            ->map(fn ($r) => [
                'id' => $r->id,
                'caller' => $r->caller,
                'queue' => $r->queue ?? '—',
                'agent' => $r->agent ?? '—',
                'organization' => $r->organization ?? '—',
                'duration_sec' => (int) $r->duration_sec,
                'disposition' => $r->disposition ?? '—',
                'started_at' => Carbon::parse($r->started_at)->format('Y-m-d H:i:s'),
            ])
            ->all();
    }

    private function streamDailyCsv($out, IvrAccountContext $ctx): void
    {
        fputcsv($out, ['Day', 'Answered', 'Abandoned', 'Total']);
        foreach ($this->dailyTrend($ctx) as $row) {
            fputcsv($out, [$row['day'], $row['answered'], $row['abandoned'], $row['total']]);
        }
    }

    private function streamQueuesCsv($out, IvrAccountContext $ctx): void
    {
        fputcsv($out, ['Queue', 'Waiting', 'SLA %', 'Status']);
        foreach ($this->queueSummary($ctx) as $row) {
            fputcsv($out, [$row['queue'], $row['waiting'], $row['sla_pct'], $row['status']]);
        }
    }

    private function streamCallsCsv($out, IvrAccountContext $ctx, string $from, string $to): void
    {
        fputcsv($out, ['Call ID', 'Caller', 'Organization', 'Queue', 'Agent', 'Duration (sec)', 'Disposition', 'Started at']);
        $rows = DB::table('ivr_call_records as c')
            ->leftJoin('ivr_operational_queues as q', 'q.id', '=', 'c.queue_id')
            ->leftJoin('organizations as o', 'o.id', '=', 'c.organization_id')
            ->where('c.account_id', $ctx->accountId)
            ->when($ctx->organizationId, fn ($q) => $q->where('c.organization_id', $ctx->organizationId))
            ->whereDate('c.started_at', '>=', $from)
            ->whereDate('c.started_at', '<=', $to)
            ->orderByDesc('c.started_at')
            ->get([
                'c.external_id',
                'c.caller',
                'o.name as organization',
                'q.name as queue',
                'c.agent_name',
                'c.duration_sec',
                'c.disposition',
                'c.started_at',
            ]);

        foreach ($rows as $r) {
            fputcsv($out, [
                $r->external_id,
                $r->caller,
                $r->organization ?? '',
                $r->queue ?? '',
                $r->agent_name ?? '',
                $r->duration_sec,
                $r->disposition ?? '',
                Carbon::parse($r->started_at)->format('Y-m-d H:i:s'),
            ]);
        }
    }
}
