<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyLegacyApiKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $expected = config('ivr.legacy_api_key', '');

        if ($expected !== '' && $request->header('X-Ivr-Api-Key') !== $expected) {
            return response()->json(['ok' => false, 'error' => 'Unauthorized', 'code' => 401], 401);
        }

        return $next($request);
    }
}
