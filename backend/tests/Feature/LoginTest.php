<?php

namespace Tests\Feature;

use Tests\TestCase;

class LoginTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */

    public $login_api_url = '/api/auth/login';
    public function test_login_with_correct_credentials()
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
    }

    // test logout with correct token
   



    public function test_login_with_incorrect_credentials()
    {
        // login with incorrect credentials
        $response = $this->withHeaders(
            ['Accept' => 'application/json']
        )->post($this->login_api_url, [
            'email' => 'superadmin@ezactive.com',
            'password' => '1234567'
        ]);

        // log response
        // $response->dump();

        $response->assertStatus(422)
            // check if response has error message
            ->assertJson([
                'message' => 'Wrong email or password!',
            ]);
    }

    public function test_login_with_incorrect_email()
    {
        // login with incorrect email
        $response = $this->withHeaders(
            ['Accept' => 'application/json']
        )->post($this->login_api_url, [
            'email' => 'superadmin@',
            'password' => '12345678'
        ]);
        // $response->dump();
        $response->assertStatus(422)
            // check if response has error message
            ->assertJson([
                'message' => 'The email must be a valid email address.',
            ]);
    }

    public function test_login_with_empty_email()
    {
        // login with incorrect email
        $response = $this->withHeaders(
            ['Accept' => 'application/json']
        )->post($this->login_api_url, [
            'email' => '',
            'password' => '12345678'
        ]);
        // $response->dump();
        $response->assertStatus(422)
            // check if response has error message
            ->assertJson([
                'message' => 'The email field is required.',
            ]);
    }

    public function test_login_with_empty_password()
    {
        // login with incorrect email
        $response = $this->withHeaders(
            ['Accept' => 'application/json']
        )->post($this->login_api_url, [
            'email' => 'superadmin@ezactive.com',
            'password' => ''
        ]);
        // $response->dump();
        $response->assertStatus(422)
            // check if response has error message
            ->assertJson([
                'message' => 'The password field is required.',
            ]);
    }
}
