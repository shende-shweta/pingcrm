#!/usr/bin/env php
<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$controllerDir = "{$root}/app/Http/Controllers/Ivr";
$out = "{$root}/routes/generated/ivr_legacy_api.php";

$files = glob("{$controllerDir}/*Controller.php") ?: [];
sort($files);

$lines = [];
$lines[] = '<?php';
$lines[] = '';
$lines[] = 'use Illuminate\Support\Facades\Route;';
$lines[] = '';
$lines[] = '// Auto-synced from existing IVR controllers – avoids missing invokable classes';
$lines[] = 'Route::prefix("ivr-legacy")->group(function () {';

foreach ($files as $file) {
    $base = basename($file, '.php');
    if (!preg_match('/^(.+?)(Index|Store|Update|Destroy|Export|Import|Sync|LegacyOps\d+)Controller$/', $base, $m)) {
        continue;
    }

    $module = $m[1];
    $action = strtolower($m[2]);
    if (str_starts_with($action, 'legacyops')) {
        $action = 'legacy-ops-'.substr($action, 9);
    }

    $slug = strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $module));
    $class = "App\\Http\\Controllers\\Ivr\\{$base}";

    if (!is_invokable_controller("{$controllerDir}/{$base}.php")) {
        continue;
    }

    $lines[] = "    Route::match(['get','post'], '{$slug}/{$action}', {$class}::class);";
}

$lines[] = '});';
$lines[] = '';

file_put_contents($out, implode("\n", $lines));
echo 'Synced '.(count($lines) - 8)." routes to {$out}\n";

function is_invokable_controller(string $path): bool
{
    $code = file_get_contents($path);
    return str_contains($code, 'function __invoke');
}
