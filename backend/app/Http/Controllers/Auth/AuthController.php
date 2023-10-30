<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Role;
use App\Models\User;
use App\Rules\Rules\Name;
use App\Rules\Rules\Password as RulesPassword;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Google2FA;

class AuthController extends Controller
{

    // register
    /**
     * @OA\Post(
     *   tags={"Auth"},
     *   path="/api/auth/register",
     *   summary="Register",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent( 
     *       @OA\Property(property="first_name", type="string"), 
     *       @OA\Property(property="last_name", type="string"), 
     *       @OA\Property(property="email", type="string") 
     *     ) 
     *   ), 
     *   @OA\Response(response=200, description="Successful operation") 
     *) 
     */

    public function register(Request $request)
    {
        // get value from .env file and set default password if in test mode 
        $test_mode = config('app.testing');
        $request->validate([
            // 'project_id' => 'required|string',
            'first_name' => ['required', 'string', new Name()],
            'last_name' => ['required', 'string', new Name()],
            'email' => [
                'required', 'string', 'email', 'unique:users'
                // Rule::unique('users')->where(function ($query) use ($request) {
                //     return $query->where('email', $request->email)
                //         ->where('project_id', $request->project_id)                    ;
                // }),
            ],
        ]);
        $request->first_name = $this->removeSpace($request->first_name);
        $request->last_name = $this->removeSpace($request->last_name);


        // check if in test mode 
        if ($test_mode) {
            $password = '12345'; // set default password 
        } else {
            $password = Str::random(5); // generate random password 
        }
        // get role id with name 'parent'
        $role_id = config('constants.role_base.parent');
        $user = new User();
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->password = Hash::make($password);
        $user->role_id = $role_id;
        // // get value from .env file
        // $test_mode = config('app.testing');
        if ($test_mode == true) {
            $user['password'] = Hash::make('12345');
            $user->save();
            return response()->json(['message' => __('auth.registered_local')], 200);
        } else {
            try {
                $user->sendPasswordNotification($password);
                event(new Registered($user));
            } catch (\Exception $e) {
                Log::error($e->getMessage());
                return response()->json(['message' => __('Could not send email. Please check your email address and try again.')], 400);
            }
            $user->save();
            return response()->json(['message' => __('auth.registered', ['email' => $request->email])], 200);
        }
    }

    public function removeSpace($value)
    {
        $value = trim($value);
        $value = preg_replace('/\s+/', ' ', $value);
        return $value;
    }

    /**
     * @OA\Post(
     *  tags={"Auth"},
     *   path="/api/auth/login",
     *   summary="Login",
     * 
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       type="object",
     *       @OA\Property(property="email", type="string" ),
     *       @OA\Property(property="password", type="string" )
     *     )
     *   ), 
     *   @OA\Response(
     *      response=200, 
     *      description="Successful operation" 
     *) 
     *) 
     */
    public function login(LoginRequest $request)
    {
        $request->authenticate();
        $user = Auth::user();
        $token = $user->createToken('authToken')->accessToken;
        $user->load('role.permissions');
        // check if two factor authentication is enabled
        if ($user->two_factor_auth && !$request->has('code')) {
            //    return to user enter 2fa code
            return response()->json([
                'message' => 'Two factor authentication is enabled',
                'two_factor_auth' => true,
            ], 200);
        }

        // update last login
        $user = Auth::user();
        $user->last_login = now();
        $user->save();
        return response()->json([
            'auth_token' => $token,
            'user' => $user,
            'two_factor_auth' => false,
        ], 200);
    }

    /**
     * @OA\Post(
     *  tags={"Auth"},
     *   path="/api/auth/logout",
     *   summary="Logout",
     * 
     *   @OA\Response(
     *     response=200,
     *     description="Successful logout"
     *   )
     *)  */


    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json(['message' => __('Successfully logged out')], 200);
    }


    /**
     * @OA\Post(
     *   tags={"Auth"},
     *   path="/api/auth/forgotPassword",
     *   summary="Forgot Password",
     * 
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       type="object",
     *       @OA\Property(property="email", type="string" )
     *     )
     *   ), 
     *   @OA\Response(
     *     response=200,
     *     description="Successful operation"
     *   )
     * )
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            // 'project_id' => 'required|string',
            'email' => 'required|string|email|max:254'
        ]);

        $user = User::where('email', $request->email)
            // ->where('project_id', $request->project_id)
            ->first();

        $password = Str::random(5);
        $message = 'passwords.sent';

        if ($user) {
            if (config('app.testing')) {
                $user->password = Hash::make('54321');
                $user->save();
                $message = 'You have sent a request to reset your password in localhost environment - Your password is: 54321';
                return response()->json(['message' => __($message)], 200);
            } else {
                $user->password = Hash::make($password);
                $user->save();
                $user->sendPasswordNotification($password, true);
            }

            return response()->json(['message' => __($message)], 200);
        } else {
            return response()->json(['message' => __('auth.wrong_email')], 400);
        }
    }

    // change password
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:5|confirmed',
        ]);

        $user = Auth::user();
        if (Hash::check($request->current_password, $user->password)) {
            $user->password = Hash::make($request->password);
            $user->save();
            return response()->json(['message' => __('auth.password_changed')], 200);
        } else {
            return response()->json([
                'message' => __('auth.wrong_old_password'),
                'errors' =>  ['current_password' => [__('auth.wrong_password')]]
            ], 400);
        }
    }

    /**
     * @OA\GET(
     *  tags={"Auth"},
     *   path="/api/auth/userInfo",
     *   summary="Get User Info",
     * 
     *   @OA\Response(
     *     response=200,
     *     description="Successful operation"
     *   )
     * )
     */
    public function userInfo()
    {
        $user = Auth::user()->load('role.permissions');
        return response()->json($user, 200);
    }

    public function generate2faSecret()
    {
        $user = Auth::user();
        $google2fa = app('pragmarx.google2fa');
        $secret = Google2FA::generateSecretKey();
        $url = Google2FA::getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );
        return response()->json(['secret' => $secret, 'url' => $url], 200);
    }

    // enable 2fa
    public function enable2fa(Request $request)
    {
        $request->validate([
            'auth_code' => 'required|string',
            'code' => 'required|string',
            'is_enabled' => 'required|boolean'
        ]);

        Log::info($request->all());

        $user = Auth::user();
        if ($request->is_enabled) {
            $valid = Google2FA::verifyKey($request->auth_code, $request->code);
            if (!$valid) {
                return response()->json(['message' => __('auth.wrong_2fa_code')], 400);
            }

            $user->auth_code = $request->auth_code;
            $user->two_factor_auth = 1;
            $user->save();
            return response()->json(['message' => __('auth.2fa_enabled')], 200);
        }
    }

    public function disable2fa(Request $request)
    {
        $user = Auth::user();
        $user->auth_code = null;
        $user->two_factor_auth = 0;
        $user->save();
        return response()->json(['message' => __('auth.2fa_disabled')], 200);
    }

    // verify 2fa
    public function verify2fa(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $user = Auth::user();
        $valid = Google2FA::verifyKey($user->auth_code, $request->code);
        if (!$valid) {
            return response()->json(['message' => __('auth.wrong_2fa_code')], 400);
        }

        return response()->json(['message' => __('auth.2fa_verified')], 200);
    }

    public function reset2fa(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:254',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                try {
                    $user->sendResetCode2FA();
                    return response()->json(['message' => __('Sent email successfully')], 200);
                } catch (\Exception $e) {
                    return response()->json(['message' => __('Cannot send email')], 400);
                }
            } else {
                return response()->json(['message' => __('auth.failed')], 400);
            }
        } else {
            return response()->json(['message' => __('auth.failed')], 400);
        }
    }
}
