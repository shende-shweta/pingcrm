<?php

namespace Tests\Unit\Legacy;

use App\Jobs\IvrSyncJob;
use App\Legacy\Services\AbstractGodService;
use App\Legacy\Services\AgentDeskGodService;
use App\Legacy\Services\LegacyModuleService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Collection;
use Tests\TestCase;

class LegacyModuleServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_invalid_input_returns_error_envelope(): void
    {
        $godService = new AgentDeskGodService();
        $service = new LegacyModuleService($godService);

        $result = $service->store(1, []);

        $this->assertFalse($result['ok']);
        $this->assertEquals(422, $result['code']);
        $this->assertEquals('Validation failed', $result['error']);
        $this->assertArrayHasKey('details', $result);
    }

    public function test_valid_store_calls_god_service(): void
    {
        $mock = $this->createMock(AbstractGodService::class);
        $mock->expects($this->once())
            ->method('store')
            ->with(1, $this->arrayHasKey('name'))
            ->willReturn(42);

        $service = new LegacyModuleService($mock);

        $result = $service->store(1, ['name' => 'Test Desk', 'payload' => '{}', 'status' => 'active']);

        $this->assertTrue($result['ok']);
        $this->assertEquals(42, $result['id']);
    }

    public function test_sync_dispatches_ivr_sync_job(): void
    {
        Queue::fake();

        $godService = new AgentDeskGodService();
        $service = new LegacyModuleService($godService);

        $result = $service->sync(1, ['name' => 'Desk', 'payload' => '{}', 'status' => 'active']);

        Queue::assertPushed(IvrSyncJob::class);
        $this->assertTrue($result['ok']);
        $this->assertEquals('queued', $result['status']);
        $this->assertFalse($result['implemented']);
    }

    public function test_mutating_operations_log_info(): void
    {
        Log::spy();

        $mock = $this->createMock(AbstractGodService::class);
        $mock->method('store')->willReturn(1);

        $service = new LegacyModuleService($mock);
        $service->store(1, ['name' => 'Test']);

        Log::shouldHaveReceived('info')
            ->once()
            ->with('IVR record mutated', \Mockery::on(fn ($ctx) => $ctx['op'] === 'store' && $ctx['account_id'] === 1));
    }
}
