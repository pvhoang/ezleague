<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LogoutTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public $login_api_url = '/api/auth/login';
    public $logout_api_url = '/api/auth/logout';

    public function test_logout_with_correct_token()
    {
        // login with correct credentials
        $response = $this->withHeaders(
            ['Accept' => 'application/json']
        )->post($this->login_api_url, [
            'email' => 'superadmin@ezactive.com',
            'password' => '12345678'
        ]);

        // log response
        // $response->dump();
        $response->assertStatus(200)
            // check if response has auth_token and user email matches
            ->assertJson([
                'auth_token' => true,
                'user' => [
                    'email' => 'superadmin@ezactive.com'
                ]
            ]);

        // get auth_token from response
        $auth_token = $response->json('auth_token');

        // logout with correct token
        $response = $this->withHeaders(
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ' . $auth_token]
        )->post($this->logout_api_url);

        // log response
        // $response->dump();

        $response->assertStatus(200)
            // check if response has auth_token and user email matches
            ->assertJson([
                'message' => 'Successfully logged out'
            ]);
    }
}
