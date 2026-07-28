<?php

namespace Database\Seeders;

use App\Models\Account;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IvrModuleSampleSeeder extends Seeder
{
    public function run(): void
    {
        $account = Account::query()->orderBy('id')->first();
        if (! $account) {
            return;
        }

        $accountId = $account->id;
        $tenantId = 1;
        $samples = [
            'SystemConfig' => [
                ['name' => 'Max concurrent calls', 'summary' => 'Platform cap: 500 concurrent sessions'],
                ['name' => 'Recording retention', 'summary' => 'Retain call recordings for 90 days'],
                ['name' => 'Maintenance window', 'summary' => 'Sundays 02:00–04:00 UTC'],
            ],
            'CallFlow' => [
                ['name' => 'Main greeting EN', 'summary' => 'Welcome → language select → queue'],
                ['name' => 'After-hours flow', 'summary' => 'Closed message → voicemail'],
            ],
            'PromptLibrary' => [
                ['name' => 'welcome_en.wav', 'summary' => 'Duration 12s · en-US'],
                ['name' => 'queue_music.mp3', 'summary' => 'MOH default loop'],
            ],
            'BusinessHours' => [
                ['name' => 'North America', 'summary' => 'Mon–Fri 08:00–18:00 EST'],
            ],
            'DidInventory' => [
                ['name' => '+1-800-555-0100', 'summary' => 'Routes to Sales – East'],
            ],
            'CustomerProfile' => [
                ['name' => 'Acme Corp – VIP', 'summary' => 'Priority queue flag enabled'],
            ],
            'CrmBridge' => [
                ['name' => 'Salesforce OAuth', 'summary' => 'Sync contacts every 15 minutes'],
            ],
            'ApiIntegration' => [
                ['name' => 'Webhook – ticket created', 'summary' => 'POST /hooks/ticket'],
            ],
            'NotificationHub' => [
                ['name' => 'SLA breach email', 'summary' => 'Notify supervisors when SLA below 80%'],
            ],
            'RoleAccess' => [
                ['name' => 'IVR Admin', 'summary' => 'Full config + recordings'],
            ],
            'AuditTrail' => [
                ['name' => 'Queue edit – billing', 'summary' => 'User johndoe@example.com'],
            ],
            'TenantAdmin' => [
                ['name' => 'Tenant Acme', 'summary' => 'Isolation: dedicated trunk group'],
            ],
            'CallRecording' => [
                ['name' => 'Support recordings', 'summary' => 'Encrypt at rest · 90 day retention'],
            ],
        ];

        foreach ($samples as $module => $rows) {
            $table = $this->tableForModule($module);
            try {
                DB::table($table)->where('account_id', $accountId)->delete();
            } catch (\Throwable $e) {
                try {
                    DB::table($table)->where('tenant_id', $tenantId)->delete();
                } catch (\Throwable $e2) {
                    continue;
                }
            }

            foreach ($rows as $row) {
                try {
                    DB::table($table)->insert([
                        'tenant_id' => $tenantId,
                        'account_id' => $accountId,
                        'name' => $row['name'],
                        'payload' => json_encode(['summary' => $row['summary']]),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                } catch (\Throwable $e) {
                    // table may not exist until legacy migration ran
                }
            }
        }
    }

    private function tableForModule(string $module): string
    {
        $snake = strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $module));

        return 'ivr_'.$snake.'s';
    }
}
