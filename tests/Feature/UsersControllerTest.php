<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UsersControllerTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(?int $accountId = null): User
    {
        if ($accountId === null) {
            $account = Account::create(['name' => 'Test Account '.uniqid()]);
            $accountId = $account->id;
        }

        return User::factory()->create([
            'account_id' => $accountId,
            'owner' => true,
        ]);
    }

    public function test_email_unique_within_same_account(): void
    {
        $user = $this->makeUser();

        // Create an existing user with the same email in the same account
        User::factory()->create([
            'account_id' => $user->account_id,
            'email' => 'duplicate@example.com',
        ]);

        $response = $this->actingAs($user)->post('/users', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'duplicate@example.com',
            'password' => 'password123',
            'owner' => false,
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_email_not_unique_across_accounts(): void
    {
        $userA = $this->makeUser();
        $accountB = Account::create(['name' => 'Account B']);

        // Create a user in account B with this email
        User::factory()->create([
            'account_id' => $accountB->id,
            'email' => 'shared@example.com',
        ]);

        // User A should be able to create a user with the same email in their own account
        $response = $this->actingAs($userA)->post('/users', [
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'shared@example.com',
            'password' => 'password123',
            'owner' => false,
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('users'));
    }

    public function test_password_min_8_chars(): void
    {
        $user = $this->makeUser();

        $response = $this->actingAs($user)->post('/users', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'newuser@example.com',
            'password' => 'short7',  // 6 chars, less than 8
            'owner' => false,
        ]);

        $response->assertSessionHasErrors('password');
    }

    public function test_password_8_chars_accepted(): void
    {
        $user = $this->makeUser();

        $response = $this->actingAs($user)->post('/users', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'newuser@example.com',
            'password' => 'exactly8',  // exactly 8 chars
            'owner' => false,
        ]);

        $response->assertSessionHasNoErrors();
    }

    public function test_empty_password_on_update_accepted(): void
    {
        $user = $this->makeUser();
        $targetUser = User::factory()->create([
            'account_id' => $user->account_id,
        ]);

        $response = $this->actingAs($user)->put("/users/{$targetUser->id}", [
            'first_name' => $targetUser->first_name,
            'last_name' => $targetUser->last_name,
            'email' => $targetUser->email,
            'password' => '',  // empty string, should be allowed
            'owner' => $targetUser->owner,
        ]);

        $response->assertSessionHasNoErrors();
    }
}
