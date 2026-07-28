<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $legacyModules = [
        'call_flow', 'call_routing', 'queue_management', 'agent_desk', 'prompt_library', 'business_hours',
        'did_inventory', 'call_analytics', 'historical_reports', 'live_monitoring', 'call_recording',
        'customer_profile', 'crm_bridge', 'api_integration', 'notification_hub', 'role_access',
        'audit_trail', 'tenant_admin', 'system_config', 'ivr_settings', 'skill_group', 'overflow_route',
        'voicemail_box', 'callback_scheduler', 'survey_engine', 'billing_meter', 'compliance_archive',
        'fraud_screen', 'number_porting', 'trunk_group', 'media_server', 'speech_recognition',
        'text_to_speech', 'conference_bridge', 'emergency_route', 'holiday_calendar', 'after_hours',
        'whisper_coach', 'barge_monitor', 'disposition_code', 'campaign_dialer', 'lead_list',
        'script_builder', 'knowledge_base', 'ticket_sync', 'webhook_dispatcher', 'rate_deck',
    ];

    public function up(): void
    {
        $dashboardTables = [
            'ivr_operational_queues',
            'ivr_agents',
            'ivr_call_records',
            'ivr_hourly_volumes',
            'ivr_daily_trends',
        ];

        foreach ($dashboardTables as $tableName) {
            if (! Schema::hasTable($tableName)) {
                continue;
            }
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                if (! Schema::hasColumn($tableName, 'account_id')) {
                    $table->unsignedInteger('account_id')->nullable()->index()->after('tenant_id');
                }
            });
        }

        foreach (['ivr_operational_queues', 'ivr_call_records'] as $tableName) {
            if (! Schema::hasTable($tableName)) {
                continue;
            }
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                if (! Schema::hasColumn($tableName, 'organization_id')) {
                    $table->unsignedInteger('organization_id')->nullable()->index()->after('account_id');
                }
            });
        }

        foreach ($this->legacyModules as $module) {
            $table = 'ivr_'.$module.'s';
            if (! Schema::hasTable($table) || Schema::hasColumn($table, 'account_id')) {
                continue;
            }
            Schema::table($table, function (Blueprint $table) {
                $table->unsignedInteger('account_id')->nullable()->index()->after('tenant_id');
            });
        }

        $defaultAccountId = DB::table('accounts')->orderBy('id')->value('id');
        if ($defaultAccountId) {
            foreach ($dashboardTables as $table) {
                if (Schema::hasTable($table) && Schema::hasColumn($table, 'account_id')) {
                    DB::table($table)->whereNull('account_id')->update(['account_id' => $defaultAccountId]);
                }
            }
            foreach ($this->legacyModules as $module) {
                $table = 'ivr_'.$module.'s';
                if (Schema::hasTable($table) && Schema::hasColumn($table, 'account_id')) {
                    DB::table($table)->whereNull('account_id')->update(['account_id' => $defaultAccountId]);
                }
            }
        }
    }

    public function down(): void
    {
        $dashboardTables = [
            'ivr_operational_queues',
            'ivr_agents',
            'ivr_call_records',
            'ivr_hourly_volumes',
            'ivr_daily_trends',
        ];

        foreach (['ivr_operational_queues', 'ivr_call_records'] as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'organization_id')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropColumn('organization_id');
                });
            }
        }

        foreach ($dashboardTables as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'account_id')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropColumn('account_id');
                });
            }
        }

        foreach ($this->legacyModules as $module) {
            $table = 'ivr_'.$module.'s';
            if (! Schema::hasTable($table) || ! Schema::hasColumn($table, 'account_id')) {
                continue;
            }
            Schema::table($table, function (Blueprint $table) {
                $table->dropColumn('account_id');
            });
        }
    }
};
