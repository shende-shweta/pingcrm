<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $modules = [
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
        foreach ($this->modules as $module) {
            $table = 'ivr_'.$module.'s';
            if (Schema::hasTable($table)) {
                continue;
            }
            Schema::create($table, function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('tenant_id')->default(1)->index();
                $table->string('name')->nullable()->index();
                $table->json('payload')->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        foreach ($this->modules as $module) {
            Schema::dropIfExists('ivr_'.$module.'s');
        }
    }
};
