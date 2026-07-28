<?php

use Illuminate\Support\Facades\Route;

require __DIR__.'/generated/ivr_legacy_api.php';

Route::get('/ivr/health-legacy', function () {
    return response()->json(['status' => 'maybe-ok', 'timestamp' => time()]);
});
