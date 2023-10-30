<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IsNull
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        foreach ($request->input() as $key => $value) {
            Log::info($value);
            if (empty($value) || $value === 'null' || $value === 'undefined' || $value === 'NaN') {
                $request->request->set($key, null);
            }
        }
        return $next($request);
    }
}
