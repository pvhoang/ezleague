<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RegisterTest extends TestCase
{

    /**
     * @dataProvider registerDataProvider
     */
    public function test_register_with_correct_credentials($first_name, $last_name, $email)
    {
        // log user_data

        
        // delete the user if it exists
        $user = User::where('email', $email)->first();
        if ($user) {
            $user->delete();
        }
        // post request with headers
        $response = $this->withHeaders(
            ['Accept' => 'application/json','X-project-id'=>'hkjfl']
        )->post('/api/auth/register', [
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => $email,
        ]);
        // dump response
        // $response->dump();

        // reponse contains a message Your user account has been created
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Account is created in localhost Environment - Your password is: 12345'
            ]);
    }

    public function registerDataProvider()
    {
        // get data from accounts.json
        $json = file_get_contents(__DIR__ . '/accounts.json');
        
        $json = json_decode($json, true);
        
        return $json;
    }

    
}
