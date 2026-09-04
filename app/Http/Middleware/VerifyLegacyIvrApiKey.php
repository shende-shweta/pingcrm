<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyLegacyIvrApiKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $configured = config('ivr.legacy_api_key', '');

        if ($configured !== '' && $request->header('X-IVR-API-Key') !== $configured) {
            return response()->json([
                'ok' => false,
                'error' => 'Unauthorized',
                'code' => 401,
            ], 401);
        }

        return $next($request);
    }
}
