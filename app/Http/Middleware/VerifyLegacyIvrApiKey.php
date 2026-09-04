<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyLegacyIvrApiKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $configuredKey = config('ivr.legacy_api_key', '');

        if ($configuredKey !== '' && $request->header('X-IVR-API-Key') !== $configuredKey) {
            return response()->json(['ok' => false, 'error' => 'Unauthorized', 'code' => 401], 401);
        }

        return $next($request);
    }
}
