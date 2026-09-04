<?php

namespace Tests\Feature\Ivr;

use App\Legacy\Services\AgentDeskGodService;
use App\Legacy\Services\LegacyModuleService;
use App\Models\Account;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class BaseLegacyControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! DB::getSchemaBuilder()->hasTable('ivr_agent_desks')) {
            DB::statement('CREATE TABLE ivr_agent_desks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_id INTEGER NOT NULL,
                name VARCHAR(255),
                payload TEXT,
                status VARCHAR(50),
                created_at DATETIME,
                updated_at DATETIME
            )');
        }
    }

    private function makeUser(): User
    {
        $account = Account::create(['name' => 'Test Account']);
        return User::factory()->create([
            'account_id' => $account->id,
            'owner' => true,
        ]);
    }

    public function test_unauthenticated_request_redirects(): void
    {
        $response = $this->get('/ivr-legacy/agent-desk/index');

        $response->assertStatus(302);
    }

    public function test_valid_authenticated_index_returns_json_envelope(): void
    {
        $user = $this->makeUser();

        $response = $this->actingAs($user)
            ->getJson('/ivr-legacy/agent-desk/index');

        $response->assertStatus(200);
        $this->assertTrue($response->json('ok'));
    }

    public function test_invalid_payload_returns_422_envelope(): void
    {
        $user = $this->makeUser();

        $response = $this->actingAs($user)
            ->postJson('/ivr-legacy/agent-desk/store', []);

        $response->assertStatus(422);
        $this->assertFalse($response->json('ok'));
        $this->assertEquals(422, $response->json('code'));
    }

    public function test_unknown_module_returns_404(): void
    {
        $user = $this->makeUser();

        $response = $this->actingAs($user)
            ->getJson('/ivr-legacy/unknown-module/index');

        $response->assertStatus(404);
    }

    public function test_exception_returns_500_json_not_html(): void
    {
        $user = $this->makeUser();

        $this->app->bind(AgentDeskGodService::class, function () {
            $mock = $this->createMock(AgentDeskGodService::class);
            $mock->method('index')->willThrowException(new \RuntimeException('Simulated failure'));

            return $mock;
        });

        $response = $this->actingAs($user)
            ->getJson('/ivr-legacy/agent-desk/index');

        $response->assertStatus(500);
        $this->assertFalse($response->json('ok'));
        $response->assertHeader('Content-Type', 'application/json');
    }
}
