<?php

namespace Tests\Unit\Legacy;

use App\Legacy\Services\AgentDeskGodService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AbstractGodServiceTest extends TestCase
{
    use RefreshDatabase;

    private AgentDeskGodService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = new AgentDeskGodService();

        // Ensure the ivr_agent_desks table exists for testing
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

    public function test_index_scopes_by_account_id(): void
    {
        DB::table('ivr_agent_desks')->insert([
            ['account_id' => 1, 'name' => 'Desk A', 'payload' => null, 'status' => 'active', 'created_at' => now()],
            ['account_id' => 1, 'name' => 'Desk B', 'payload' => null, 'status' => 'active', 'created_at' => now()],
            ['account_id' => 2, 'name' => 'Desk C', 'payload' => null, 'status' => 'active', 'created_at' => now()],
        ]);

        $results = $this->service->index(1);

        $this->assertCount(2, $results);
        $this->assertTrue($results->every(fn ($r) => $r->account_id === 1));
    }

    public function test_index_search_uses_bound_parameters(): void
    {
        DB::table('ivr_agent_desks')->insert([
            ['account_id' => 1, 'name' => 'Support Desk', 'payload' => null, 'status' => 'active', 'created_at' => now()],
        ]);

        DB::enableQueryLog();

        $this->service->index(1, 'Support');

        $log = DB::getQueryLog();
        DB::disableQueryLog();

        $this->assertNotEmpty($log);
        $lastQuery = end($log);

        // Verify the search term is passed as a binding, not embedded in the SQL
        $this->assertStringNotContainsString('Support', $lastQuery['query']);
        $this->assertNotEmpty($lastQuery['bindings']);
    }

    public function test_store_enforces_allowed_fields(): void
    {
        $id = $this->service->store(1, [
            'name' => 'Test Desk',
            'payload' => '{}',
            'status' => 'active',
            'injected_field' => 'malicious_value',
            'account_id' => 999, // should be ignored; account_id comes from parameter
        ]);

        $row = DB::table('ivr_agent_desks')->find($id);

        $this->assertNotNull($row);
        $this->assertEquals('Test Desk', $row->name);
        // The injected_field should not be in the row (column doesn't exist on table)
        $this->assertObjectNotHasProperty('injected_field', $row);
    }

    public function test_store_sets_account_id_from_parameter(): void
    {
        $id = $this->service->store(42, [
            'name' => 'Desk X',
            'payload' => null,
            'status' => 'active',
        ]);

        $row = DB::table('ivr_agent_desks')->find($id);

        $this->assertNotNull($row);
        $this->assertEquals(42, $row->account_id);
    }

    public function test_destroy_scopes_by_account_id(): void
    {
        $idAccountA = DB::table('ivr_agent_desks')->insertGetId([
            'account_id' => 1,
            'name' => 'Desk A',
            'payload' => null,
            'status' => 'active',
            'created_at' => now(),
        ]);

        // Account B tries to destroy Account A's record
        $result = $this->service->destroy(2, $idAccountA);

        // Should return false because account_id doesn't match
        $this->assertFalse($result);

        // Record should still exist
        $this->assertNotNull(DB::table('ivr_agent_desks')->find($idAccountA));
    }
}
