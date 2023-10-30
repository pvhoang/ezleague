<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\VerifyEmailRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmailVerificationController extends Controller
{
    //
    public function verify(VerifyEmailRequest $request)
    {
        $request->fulfill();
        $client_url = 'app.client_url';
        return redirect(config($client_url));
    }

    /**
     * @OA\Post(
     *  tags={"Email Verification"},
     *   path="/api/auth/verification/resend",
     *   summary="Resend verification email",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       type="object",
     *       @OA\Property(property="first_name", type="string" ),
     *       @OA\Property(property="last_name", type="string" ),
     *       @OA\Property(property="email", type="string" )
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Successful operation"
     *   )
     * )
     */
    public function resend()
    {
        if (Auth::user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified'], 200);
        } else {
            Auth::user()->sendEmailVerificationNotification();
            return response()->json(['message' => 'Email verification link sent on your email id'], 200);
        }
    }
}
