<?php

namespace Tests\Unit\Legacy;

use App\Legacy\Services\AgentDeskGodService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Covers update() field allowlist and cross-tenant fence gaps not in AbstractGodServiceTest.
 *
 * @see Redmine #17 IVR Legacy Security Hardening (T-04, T-06, T-07, T-22)
 *
 * AC-T04 / T-06: update() filters payload through allowedFields; account_id cannot be overwritten.
 * AC-T07: update() must be scoped to the caller's account_id.
 * AC-T04: destroy() must also be scoped; cross-tenant deletes are prevented.
 */
class AbstractGodServiceUpdateTest extends TestCase
{
    use RefreshDatabase;

    private AgentDeskGodService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = new AgentDeskGodService();

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

    public function test_update_enforces_allowed_fields_and_ignores_account_id_injection(): void
    {
        $id = DB::table('ivr_agent_desks')->insertGetId([
            'account_id' => 1,
            'name' => 'Original Name',
            'payload' => null,
            'status' => 'active',
            'created_at' => now(),
        ]);

        $result = $this->service->update(1, $id, [
            'name' => 'Updated Name',
            'injected_field' => 'malicious',
            'account_id' => 999,
        ]);

        $row = DB::table('ivr_agent_desks')->find($id);
        $this->assertTrue($result);
        $this->assertEquals('Updated Name', $row->name);
        $this->assertEquals(1, $row->account_id, 'account_id must not be overwritten from payload');
    }

    public function test_update_cross_tenant_attempt_returns_false_and_leaves_record_unchanged(): void
    {
        $id = DB::table('ivr_agent_desks')->insertGetId([
            'account_id' => 1,
            'name' => 'Account A Desk',
            'payload' => null,
            'status' => 'active',
            'created_at' => now(),
        ]);

        $result = $this->service->update(2, $id, ['name' => 'Hijacked']);

        $this->assertFalse($result);
        $this->assertEquals('Account A Desk', DB::table('ivr_agent_desks')->find($id)->name);
    }

    public function test_index_returns_empty_collection_when_no_records_exist(): void
    {
        $results = $this->service->index(1);
        $this->assertCount(0, $results);
    }

    public function test_index_search_no_match_returns_empty(): void
    {
        DB::table('ivr_agent_desks')->insert([
            ['account_id' => 1, 'name' => 'Support Desk', 'payload' => null, 'status' => 'active', 'created_at' => now()],
        ]);

        $results = $this->service->index(1, 'zzz_nonexistent_xyz');
        $this->assertCount(0, $results);
    }

    public function test_index_search_with_sql_wildcard_chars_does_not_error(): void
    {
        DB::table('ivr_agent_desks')->insert([
            ['account_id' => 1, 'name' => '100% Desk', 'payload' => null, 'status' => 'active', 'created_at' => now()],
        ]);

        $results = $this->service->index(1, '%');
        $this->assertIsObject($results);
    }

    public function test_destroy_on_nonexistent_id_returns_false(): void
    {
        $result = $this->service->destroy(1, 99999);
        $this->assertFalse($result);
    }
}
