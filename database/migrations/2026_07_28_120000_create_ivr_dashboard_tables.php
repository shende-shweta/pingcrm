<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ivr_operational_queues', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('name');
            $table->string('category')->nullable();
            $table->unsignedInteger('waiting')->default(0);
            $table->unsignedInteger('longest_wait_sec')->default(0);
            $table->unsignedInteger('agents_available')->default(0);
            $table->decimal('sla_pct', 5, 1)->default(0);
            $table->string('status')->default('Normal');
            $table->string('chart_color', 16)->nullable();
            $table->timestamps();
        });

        Schema::create('ivr_agents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->foreignId('queue_id')->nullable()->constrained('ivr_operational_queues')->nullOnDelete();
            $table->string('name');
            $table->string('extension', 16);
            $table->string('status')->default('Available');
            $table->unsignedInteger('calls_today')->default(0);
            $table->timestamps();
        });

        Schema::create('ivr_call_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('external_id')->index();
            $table->string('caller');
            $table->foreignId('queue_id')->nullable()->constrained('ivr_operational_queues')->nullOnDelete();
            $table->string('agent_name')->nullable();
            $table->unsignedInteger('duration_sec')->default(0);
            $table->string('disposition')->nullable();
            $table->timestamp('started_at');
            $table->timestamps();
        });

        Schema::create('ivr_hourly_volumes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->date('stat_date')->index();
            $table->string('hour_label', 8);
            $table->unsignedTinyInteger('hour_sort');
            $table->unsignedInteger('inbound_count')->default(0);
            $table->string('bar_color', 16)->nullable();
            $table->timestamps();
        });

        Schema::create('ivr_daily_trends', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->date('week_start')->index();
            $table->string('day_label', 8);
            $table->unsignedTinyInteger('day_sort');
            $table->unsignedInteger('answered')->default(0);
            $table->unsignedInteger('abandoned')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ivr_call_records');
        Schema::dropIfExists('ivr_agents');
        Schema::dropIfExists('ivr_daily_trends');
        Schema::dropIfExists('ivr_hourly_volumes');
        Schema::dropIfExists('ivr_operational_queues');
    }
};
