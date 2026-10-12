<?php

declare(strict_types=1);

namespace Tests\Feature\Ivr;

use App\Models\Account;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class IvrModuleTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'account_id' => Account::create(['name' => 'Test Corp'])->id,
            'owner' => true,
        ]);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/ivr/modules')->assertRedirect('/login');
    }

    public function test_modules_index_renders_default_live_monitoring_module(): void
    {
        $this->actingAs($this->user)
            ->get('/ivr/modules')
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Ivr/Module/Index')
                ->where('moduleSlug', 'live-monitoring')
                ->has('moduleTabs')
                ->has('title')
                ->has('description')
                ->has('viewType')
                ->has('filters')
                ->has('columns')
                ->has('rows')
                ->has('accountName')
            );
    }

    public function test_call_flow_module_shows_only_current_account_rows(): void
    {
        DB::table('ivr_call_flows')->insert([
            'account_id' => $this->user->account_id,
            'name' => 'Flow Alpha',
            'payload' => json_encode(['summary' => 'Main entry point']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $otherUser = User::factory()->create([
            'account_id' => Account::create(['name' => 'Other Corp'])->id,
        ]);
        DB::table('ivr_call_flows')->insert([
            'account_id' => $otherUser->account_id,
            'name' => 'Flow Beta',
            'payload' => json_encode(['summary' => 'Other account flow']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->actingAs($this->user)
            ->get('/ivr/modules?module=call-flow')
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Ivr/Module/Index')
                ->has('rows', 1)
                ->has('rows.0', fn (Assert $assert) => $assert
                    ->has('id')
                    ->where('name', 'Flow Alpha')
                    ->has('summary')
                    ->has('updated_at')
                )
            );
    }

    public function test_call_flow_search_filters_rows_by_name(): void
    {
        DB::table('ivr_call_flows')->insert([
            [
                'account_id' => $this->user->account_id,
                'name' => 'Flow Alpha',
                'payload' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'account_id' => $this->user->account_id,
                'name' => 'Flow Bravo',
                'payload' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $this->actingAs($this->user)
            ->get('/ivr/modules?module=call-flow&q=Alpha')
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Ivr/Module/Index')
                ->has('rows', 1)
                ->has('rows.0', fn (Assert $assert) => $assert
                    ->where('name', 'Flow Alpha')
                )
            );
    }

    public function test_unknown_module_falls_back_to_live_monitoring(): void
    {
        $this->actingAs($this->user)
            ->get('/ivr/modules?module=nope')
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Ivr/Module/Index')
                ->where('moduleSlug', 'live-monitoring')
            );
    }

    public function test_slug_route_redirects_to_modules_page(): void
    {
        $this->actingAs($this->user)
            ->get('/ivr/call-flow')
            ->assertRedirectToRoute('ivr.modules', ['module' => 'call-flow']);
    }
}
