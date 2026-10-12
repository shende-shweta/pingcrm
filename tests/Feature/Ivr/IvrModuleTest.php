<?php

namespace Tests\Feature\Ivr;

use App\Models\Account;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class IvrModuleTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'account_id' => Account::create(['name' => 'Acme IVR Corp'])->id,
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'owner' => true,
        ]);
    }

    public function test_modules_index_renders_correct_component(): void
    {
        $this->actingAs($this->user)
            ->get('/ivr/modules')
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Ivr/Module/Index')
                ->has('moduleSlug')
                ->has('moduleKey')
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

    public function test_modules_index_defaults_to_live_monitoring(): void
    {
        $this->actingAs($this->user)
            ->get('/ivr/modules')
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Ivr/Module/Index')
                ->where('moduleSlug', 'live-monitoring')
                ->where('title', 'Live Monitoring')
            );
    }

    public function test_modules_index_accepts_module_query_param(): void
    {
        $this->actingAs($this->user)
            ->get('/ivr/modules?module=call-flow')
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Ivr/Module/Index')
                ->where('moduleSlug', 'call-flow')
                ->where('title', 'Call Flow Designer')
            );
    }

    public function test_modules_index_falls_back_on_invalid_slug(): void
    {
        $this->actingAs($this->user)
            ->get('/ivr/modules?module=nonexistent')
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Ivr/Module/Index')
                ->where('moduleSlug', 'live-monitoring')
            );
    }

    public function test_modules_index_passes_search_filter(): void
    {
        $this->actingAs($this->user)
            ->get('/ivr/modules?module=live-monitoring&q=test-search')
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Ivr/Module/Index')
                ->where('filters.q', 'test-search')
            );
    }

    public function test_slug_route_redirects_to_modules(): void
    {
        $this->actingAs($this->user)
            ->get('/ivr/call-flow')
            ->assertRedirect('/ivr/modules?module=call-flow');
    }

    public function test_unknown_slug_route_returns_404(): void
    {
        $this->actingAs($this->user)
            ->get('/ivr/nonexistent-module')
            ->assertNotFound();
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/ivr/modules')
            ->assertRedirect('/login');
    }

    public function test_account_name_matches_user_account(): void
    {
        $this->actingAs($this->user)
            ->get('/ivr/modules')
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Ivr/Module/Index')
                ->where('accountName', 'Acme IVR Corp')
            );
    }

    public function test_second_account_data_is_isolated(): void
    {
        $otherUser = User::factory()->create([
            'account_id' => Account::create(['name' => 'Other Corp'])->id,
            'first_name' => 'Bob',
            'last_name' => 'Smith',
            'email' => 'bob@other.com',
            'owner' => true,
        ]);

        $this->actingAs($otherUser)
            ->get('/ivr/modules')
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Ivr/Module/Index')
                ->where('accountName', 'Other Corp')
            );
    }
}
