<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrganizationsControllerTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(): User
    {
        $account = Account::create(['name' => 'Test Account '.uniqid()]);

        return User::factory()->create([
            'account_id' => $account->id,
            'owner' => true,
        ]);
    }

    public function test_invalid_country_code_rejected(): void
    {
        $user = $this->makeUser();

        $response = $this->actingAs($user)->post('/organizations', [
            'name' => 'Test Org',
            'country' => 'XX',  // invalid ISO code
        ]);

        $response->assertSessionHasErrors('country');
    }

    public function test_valid_country_code_accepted(): void
    {
        $user = $this->makeUser();

        $response = $this->actingAs($user)->post('/organizations', [
            'name' => 'Test Org',
            'country' => 'US',  // valid ISO code
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('organizations'));
    }

    public function test_null_country_accepted(): void
    {
        $user = $this->makeUser();

        $response = $this->actingAs($user)->post('/organizations', [
            'name' => 'Test Org',
            'country' => null,
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('organizations'));
    }
}
