<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ForgotPasswordTest extends TestCase
{


    public $forgot_password_api_url = '/api/auth/forgot-password';
    /*
    * @test
    */
    public function test_forgot_password_with_correct_email()
    {
        $headers = ['Accept' => 'application/json'];
        $data = ['email' => 'mchoang98@gmail.com'];

        $response = $this->withHeaders($headers)->post($this->forgot_password_api_url, $data);

        // assert response status and message
        $response->assertStatus(200)->assertJson(['message' => 'You have sent a request to reset your password in localhost environment - Your password is: 54321']);
    }
}
