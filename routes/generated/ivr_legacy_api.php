<?php

use App\Http\Controllers\Ivr\BaseLegacyController;
use App\Http\Middleware\VerifyLegacyApiKey;
use Illuminate\Support\Facades\Route;

Route::prefix('ivr-legacy')->middleware(['web', 'auth', VerifyLegacyApiKey::class])->group(function () {
    $modules = [
        'agent-desk',
        'business-hours',
        'call-queues',
        'ivr-menus',
        'voice-mailboxes',
        'holiday-schedules',
        'time-conditions',
        'ring-groups',
        'announcements',
        'music-on-hold',
        'outbound-routes',
        'trunks',
    ];

    foreach ($modules as $module) {
        $slug = $module;
        Route::get("$slug/index", [BaseLegacyController::class, 'index'])->defaults('module', $slug);
        Route::post("$slug/store", [BaseLegacyController::class, 'store'])->defaults('module', $slug);
        Route::post("$slug/update", [BaseLegacyController::class, 'update'])->defaults('module', $slug);
        Route::post("$slug/destroy", [BaseLegacyController::class, 'destroy'])->defaults('module', $slug);
        Route::get("$slug/export", [BaseLegacyController::class, 'export'])->defaults('module', $slug);
        Route::post("$slug/import", [BaseLegacyController::class, 'import'])->defaults('module', $slug);
        Route::post("$slug/sync", [BaseLegacyController::class, 'sync'])->defaults('module', $slug);
    }
});
