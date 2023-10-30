<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthenticate
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::user()->role_id != config('constants.role_base.admin')) {
            return response()->json(['message' => __('Unauthorized')], 401);
        }
        return $next($request);
    }
}
