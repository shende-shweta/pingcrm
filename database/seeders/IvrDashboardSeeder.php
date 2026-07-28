<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Organization;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IvrDashboardSeeder extends Seeder
{
    public function run(): void
    {
        $account = Account::query()->orderBy('id')->first();
        if (! $account) {
            return;
        }

        $accountId = $account->id;
        $tenantId = 1;
        $today = Carbon::today();

        $organizations = Organization::query()
            ->where('account_id', $accountId)
            ->orderBy('name')
            ->limit(6)
            ->get();

        DB::table('ivr_call_records')->where('account_id', $accountId)->delete();
        DB::table('ivr_agents')->where('account_id', $accountId)->delete();
        DB::table('ivr_operational_queues')->where('account_id', $accountId)->delete();
        DB::table('ivr_hourly_volumes')->where('account_id', $accountId)->delete();
        DB::table('ivr_daily_trends')->where('account_id', $accountId)->delete();

        $queues = [
            ['name' => 'Sales – East', 'category' => 'Sales', 'waiting' => 12, 'longest_wait_sec' => 184, 'agents_available' => 8, 'sla_pct' => 91.2, 'status' => 'Normal', 'chart_color' => '#6366f1'],
            ['name' => 'Sales – West', 'category' => 'Sales', 'waiting' => 7, 'longest_wait_sec' => 96, 'agents_available' => 6, 'sla_pct' => 94.5, 'status' => 'Normal', 'chart_color' => '#818cf8'],
            ['name' => 'Support – Tier 1', 'category' => 'Support', 'waiting' => 18, 'longest_wait_sec' => 312, 'agents_available' => 14, 'sla_pct' => 82.1, 'status' => 'Warning', 'chart_color' => '#22c55e'],
            ['name' => 'Support – Tier 2', 'category' => 'Support', 'waiting' => 4, 'longest_wait_sec' => 145, 'agents_available' => 5, 'sla_pct' => 88.7, 'status' => 'Normal', 'chart_color' => '#4ade80'],
            ['name' => 'Billing', 'category' => 'Billing', 'waiting' => 3, 'longest_wait_sec' => 67, 'agents_available' => 4, 'sla_pct' => 96.0, 'status' => 'Normal', 'chart_color' => '#f59e0b'],
            ['name' => 'After Hours', 'category' => 'Overflow', 'waiting' => 9, 'longest_wait_sec' => 420, 'agents_available' => 2, 'sla_pct' => 71.4, 'status' => 'Critical', 'chart_color' => '#94a3b8'],
        ];

        $queueIds = [];
        $orgCount = max(1, $organizations->count());
        foreach ($queues as $index => $q) {
            $org = $organizations->get($index % $orgCount);
            $queueIds[$q['name']] = DB::table('ivr_operational_queues')->insertGetId(array_merge($q, [
                'tenant_id' => $tenantId,
                'account_id' => $accountId,
                'organization_id' => $org?->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        $agents = [
            ['name' => 'Jamie L.', 'extension' => '1042', 'status' => 'On Call', 'queue' => 'Support – Tier 1', 'calls_today' => 23],
            ['name' => 'Priya S.', 'extension' => '1088', 'status' => 'Available', 'queue' => 'Sales – East', 'calls_today' => 31],
            ['name' => 'Marcus T.', 'extension' => '1101', 'status' => 'Wrap-up', 'queue' => 'Billing', 'calls_today' => 18],
            ['name' => 'Alex K.', 'extension' => '1120', 'status' => 'On Call', 'queue' => 'Support – Tier 2', 'calls_today' => 15],
            ['name' => 'Sam R.', 'extension' => '1055', 'status' => 'Available', 'queue' => 'Support – Tier 1', 'calls_today' => 27],
        ];

        foreach ($agents as $a) {
            DB::table('ivr_agents')->insert([
                'tenant_id' => $tenantId,
                'account_id' => $accountId,
                'queue_id' => $queueIds[$a['queue']],
                'name' => $a['name'],
                'extension' => $a['extension'],
                'status' => $a['status'],
                'calls_today' => $a['calls_today'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $calls = [
            ['external_id' => 'C-88421', 'caller' => '+1 (416) 555-0192', 'queue' => 'Support – Tier 1', 'agent' => 'Jamie L.', 'duration' => 342, 'disposition' => 'Resolved', 'offset_min' => 2],
            ['external_id' => 'C-88420', 'caller' => '+1 (647) 555-4421', 'queue' => 'Sales – East', 'agent' => 'Priya S.', 'duration' => 128, 'disposition' => 'Sale', 'offset_min' => 3],
            ['external_id' => 'C-88419', 'caller' => '+1 (905) 555-8810', 'queue' => 'Billing', 'agent' => 'Marcus T.', 'duration' => 215, 'disposition' => 'Escalated', 'offset_min' => 5],
            ['external_id' => 'C-88418', 'caller' => '+1 (514) 555-3300', 'queue' => 'Support – Tier 2', 'agent' => 'Alex K.', 'duration' => 501, 'disposition' => 'Resolved', 'offset_min' => 8],
            ['external_id' => 'C-88417', 'caller' => '+1 (416) 555-7722', 'queue' => 'Sales – West', 'agent' => null, 'duration' => 0, 'disposition' => 'Abandoned', 'offset_min' => 10],
            ['external_id' => 'C-88416', 'caller' => '+1 (289) 555-1199', 'queue' => 'Support – Tier 1', 'agent' => 'Sam R.', 'duration' => 278, 'disposition' => 'Callback', 'offset_min' => 12],
            ['external_id' => 'C-88415', 'caller' => '+1 (613) 555-0044', 'queue' => 'Sales – East', 'agent' => 'Priya S.', 'duration' => 190, 'disposition' => 'Resolved', 'offset_min' => 15],
            ['external_id' => 'C-88414', 'caller' => '+1 (416) 555-9981', 'queue' => 'After Hours', 'agent' => null, 'duration' => 0, 'disposition' => 'Abandoned', 'offset_min' => 18],
        ];

        foreach ($calls as $c) {
            $queueId = $queueIds[$c['queue']];
            $orgId = DB::table('ivr_operational_queues')->where('id', $queueId)->value('organization_id');

            DB::table('ivr_call_records')->insert([
                'tenant_id' => $tenantId,
                'account_id' => $accountId,
                'organization_id' => $orgId,
                'external_id' => $c['external_id'],
                'caller' => $c['caller'],
                'queue_id' => $queueId,
                'agent_name' => $c['agent'],
                'duration_sec' => $c['duration'],
                'disposition' => $c['disposition'],
                'started_at' => now()->subMinutes($c['offset_min']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $hours = [
            ['label' => '6a', 'sort' => 6, 'count' => 42, 'color' => '#818cf8'],
            ['label' => '8a', 'sort' => 8, 'count' => 118, 'color' => '#6366f1'],
            ['label' => '10a', 'sort' => 10, 'count' => 186, 'color' => '#4f46e5'],
            ['label' => '12p', 'sort' => 12, 'count' => 204, 'color' => '#4338ca'],
            ['label' => '2p', 'sort' => 14, 'count' => 167, 'color' => '#6366f1'],
            ['label' => '4p', 'sort' => 16, 'count' => 143, 'color' => '#818cf8'],
            ['label' => '6p', 'sort' => 18, 'count' => 89, 'color' => '#a5b4fc'],
        ];

        foreach ($hours as $h) {
            DB::table('ivr_hourly_volumes')->insert([
                'tenant_id' => $tenantId,
                'account_id' => $accountId,
                'stat_date' => $today,
                'hour_label' => $h['label'],
                'hour_sort' => $h['sort'],
                'inbound_count' => $h['count'],
                'bar_color' => $h['color'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $weekStart = $today->copy()->startOfWeek();
        $days = [
            ['label' => 'Mon', 'sort' => 1, 'answered' => 820, 'abandoned' => 48],
            ['label' => 'Tue', 'sort' => 2, 'answered' => 910, 'abandoned' => 52],
            ['label' => 'Wed', 'sort' => 3, 'answered' => 880, 'abandoned' => 61],
            ['label' => 'Thu', 'sort' => 4, 'answered' => 940, 'abandoned' => 44],
            ['label' => 'Fri', 'sort' => 5, 'answered' => 1020, 'abandoned' => 58],
            ['label' => 'Sat', 'sort' => 6, 'answered' => 410, 'abandoned' => 22],
            ['label' => 'Sun', 'sort' => 7, 'answered' => 320, 'abandoned' => 18],
        ];

        foreach ($days as $d) {
            DB::table('ivr_daily_trends')->insert([
                'tenant_id' => $tenantId,
                'account_id' => $accountId,
                'week_start' => $weekStart,
                'day_label' => $d['label'],
                'day_sort' => $d['sort'],
                'answered' => $d['answered'],
                'abandoned' => $d['abandoned'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
