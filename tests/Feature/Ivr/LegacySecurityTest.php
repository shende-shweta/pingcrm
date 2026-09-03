<?php

namespace Tests\Feature\Ivr;

use App\Models\Account;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class LegacySecurityTest extends TestCase
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

    private function makeUser(?int $accountId = null): User
    {
        $account = Account::create(['name' => 'Test Account '.uniqid()]);
        return User::factory()->create([
            'account_id' => $accountId ?? $account->id,
            'owner' => true,
        ]);
    }

    public function test_unauthenticated_get_index_redirects(): void
    {
        $response = $this->get('/ivr-legacy/agent-desk/index');

        $response->assertStatus(302);
    }

    public function test_unauthenticated_post_destroy_redirects(): void
    {
        $response = $this->post('/ivr-legacy/agent-desk/destroy', ['id' => 1]);

        $response->assertStatus(302);
    }

    public function test_authenticated_get_destroy_returns_405(): void
    {
        $user = $this->makeUser();

        $response = $this->actingAs($user)
            ->get('/ivr-legacy/agent-desk/destroy');

        $response->assertStatus(405);
    }

    public function test_sql_injection_attempt_returns_safe_results(): void
    {
        $user = $this->makeUser();

        DB::table('ivr_agent_desks')->insert([
            ['account_id' => $user->account_id, 'name' => 'Safe Desk', 'payload' => null, 'status' => 'active', 'created_at' => now()],
            ['account_id' => 999, 'name' => 'Other Account Desk', 'payload' => null, 'status' => 'active', 'created_at' => now()],
        ]);

        $response = $this->actingAs($user)
            ->getJson("/ivr-legacy/agent-desk/index?q=" . urlencode("1' OR '1'='1"));

        $response->assertStatus(200);
        $data = $response->json('data');

        // Should only return rows for the authenticated user's account
        foreach ($data as $row) {
            $this->assertEquals($user->account_id, $row['account_id'] ?? $user->account_id);
        }

        // Other account's desk should not be in results
        $names = array_column($data, 'name');
        $this->assertNotContains('Other Account Desk', $names);
    }

    public function test_account_scoping_prevents_cross_tenant_access(): void
    {
        $userA = $this->makeUser();
        $userB = $this->makeUser();

        DB::table('ivr_agent_desks')->insert([
            ['account_id' => $userA->account_id, 'name' => 'User A Desk', 'payload' => null, 'status' => 'active', 'created_at' => now()],
            ['account_id' => $userB->account_id, 'name' => 'User B Desk', 'payload' => null, 'status' => 'active', 'created_at' => now()],
        ]);

        $response = $this->actingAs($userA)
            ->getJson('/ivr-legacy/agent-desk/index');

        $response->assertStatus(200);
        $data = $response->json('data');

        $names = array_column($data, 'name');
        $this->assertContains('User A Desk', $names);
        $this->assertNotContains('User B Desk', $names);
    }
}
