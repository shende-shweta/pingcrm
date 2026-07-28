#!/usr/bin/env php
<?php

/**
 * Generates a large legacy Laravel IVR codebase for modernization discovery exercises.
 * Run: php tools/generate-legacy-enterprise-ivr.php
 */

declare(strict_types=1);

$root = dirname(__DIR__);
$phpTarget = (int) ($argv[1] ?? 72000);
$seed = 2010;

$modules = [
    'CallFlow', 'CallRouting', 'QueueManagement', 'AgentDesk', 'PromptLibrary', 'BusinessHours',
    'DidInventory', 'CallAnalytics', 'HistoricalReports', 'LiveMonitoring', 'CallRecording',
    'CustomerProfile', 'CrmBridge', 'ApiIntegration', 'NotificationHub', 'RoleAccess',
    'AuditTrail', 'TenantAdmin', 'SystemConfig', 'IvrSettings', 'SkillGroup', 'OverflowRoute',
    'VoicemailBox', 'CallbackScheduler', 'SurveyEngine', 'BillingMeter', 'ComplianceArchive',
    'FraudScreen', 'NumberPorting', 'TrunkGroup', 'MediaServer', 'SpeechRecognition',
    'TextToSpeech', 'ConferenceBridge', 'EmergencyRoute', 'HolidayCalendar', 'AfterHours',
    'WhisperCoach', 'BargeMonitor', 'DispositionCode', 'CampaignDialer', 'LeadList',
    'ScriptBuilder', 'KnowledgeBase', 'TicketSync', 'WebhookDispatcher', 'RateDeck',
];

$legacyHelpers = ['LegacyIvrMath', 'LegacyIvrString', 'LegacyIvrDate', 'LegacyIvrArray', 'LegacyIvrCrypto'];

echo "Generating legacy PHP IVR codebase (~{$phpTarget} lines target)...\n";

@mkdir("{$root}/app/Legacy/Helpers", 0777, true);
@mkdir("{$root}/app/Legacy/Services", 0777, true);
@mkdir("{$root}/app/Http/Controllers/Ivr", 0777, true);
@mkdir("{$root}/app/Models/Ivr", 0777, true);
@mkdir("{$root}/app/Repositories/Legacy", 0777, true);
@mkdir("{$root}/routes/generated", 0777, true);

$linesWritten = 0;
$controllerIndex = 0;

foreach ($modules as $module) {
    $snake = strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $module));
    $table = 'ivr_'.$snake.'s';

    $modelPath = "{$root}/app/Models/Ivr/{$module}.php";
    $modelBody = generateModel($module, $table, $seed++);
    file_put_contents($modelPath, $modelBody);
    $linesWritten += substr_count($modelBody, "\n") + 1;

    $repoPath = "{$root}/app/Repositories/Legacy/{$module}Repository.php";
    $repoBody = generateRepository($module, $table, $seed++);
    file_put_contents($repoPath, $repoBody);
    $linesWritten += substr_count($repoBody, "\n") + 1;

    $servicePath = "{$root}/app/Legacy/Services/{$module}GodService.php";
    $serviceBody = generateGodService($module, $table, $seed++);
    file_put_contents($servicePath, $serviceBody);
    $linesWritten += substr_count($serviceBody, "\n") + 1;

    foreach (['Index', 'Store', 'Update', 'Destroy', 'Export', 'Import', 'Sync'] as $action) {
        $controllerName = "{$module}{$action}Controller";
        $controllerPath = "{$root}/app/Http/Controllers/Ivr/{$controllerName}.php";
        $controllerBody = generateFatController($module, $action, $table, $controllerIndex++, $seed++);
        file_put_contents($controllerPath, $controllerBody);
        $linesWritten += substr_count($controllerBody, "\n") + 1;
    }
}

foreach ($legacyHelpers as $i => $helper) {
    $path = "{$root}/app/Legacy/Helpers/{$helper}.php";
    $body = generateLegacyHelper($helper, $i, $seed++);
    file_put_contents($path, $body);
    $linesWritten += substr_count($body, "\n") + 1;
}

// Procedural include files (circa 2012 team)
@mkdir("{$root}/app/Legacy/Includes", 0777, true);
for ($p = 1; $p <= 12 && $linesWritten < $phpTarget; $p++) {
    $path = "{$root}/app/Legacy/Includes/procedural_bundle_{$p}.php";
    $body = generateProceduralBundle($p, $seed++);
    file_put_contents($path, $body);
    $linesWritten += substr_count($body, "\n") + 1;
}

// Extra fat controllers until target
while ($linesWritten < $phpTarget) {
    $module = $modules[$controllerIndex % count($modules)];
    $controllerName = "{$module}LegacyOps{$controllerIndex}Controller";
    $controllerPath = "{$root}/app/Http/Controllers/Ivr/{$controllerName}.php";
    $table = 'ivr_'.strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $module)).'s';
    $controllerBody = generateFatController($module, 'LegacyOps', $table, $controllerIndex, $seed++);
    file_put_contents($controllerPath, $controllerBody);
    $linesWritten += substr_count($controllerBody, "\n") + 1;
    $controllerIndex++;
}

$routeFile = shell_exec('php '.escapeshellarg("{$root}/tools/sync-ivr-legacy-routes.php"));
echo trim((string) $routeFile)."\n";

echo "PHP generation complete. Approx lines: {$linesWritten}\n";

function generateModel(string $module, string $table, int $seed): string
{
    $lines = [];
    $lines[] = '<?php';
    $lines[] = '';
    $lines[] = 'namespace App\Models\Ivr;';
    $lines[] = '';
    $lines[] = 'use Illuminate\Database\Eloquent\Model;';
    $lines[] = 'use Illuminate\Support\Facades\DB;';
    $lines[] = '';
    $lines[] = "/**";
    $lines[] = " * @deprecated mixed legacy model – team {$seed} – do not refactor without CAB approval";
    $lines[] = " */";
    $lines[] = "class {$module} extends Model";
    $lines[] = '{';
    $lines[] = "    protected \$table = '{$table}';";
    $lines[] = '    protected $guarded = []; // legacy – mass assignment wide open';
    $lines[] = '    public $timestamps = true;';
    $lines[] = '';
    $lines[] = '    public function scopeForTenant($query, $tenantId)';
    $lines[] = '    {';
    $lines[] = '        return $query->where("tenant_id", $tenantId);';
    $lines[] = '    }';
    $lines[] = '';
    for ($i = 1; $i <= 35; $i++) {
        $lines[] = "    public function legacyComputedField{$i}()";
        $lines[] = '    {';
        $lines[] = '        // N+1 friendly accessor – called from blade/react randomly';
        $lines[] = '        return DB::select("select count(*) as c from '.$table.' where tenant_id = ?", [$this->tenant_id ?? 1]);';
        $lines[] = '    }';
        $lines[] = '';
    }
    $lines[] = '}';
    $lines[] = '';

    return implode("\n", $lines);
}

function generateRepository(string $module, string $table, int $seed): string
{
    $lines = [];
    $lines[] = '<?php';
    $lines[] = '';
    $lines[] = 'namespace App\Repositories\Legacy;';
    $lines[] = '';
    $lines[] = 'use Illuminate\Support\Facades\DB;';
    $lines[] = '';
    $lines[] = "class {$module}Repository";
    $lines[] = '{';
    $lines[] = '    // Repository added 2019 but controllers still use DB::raw directly';
    for ($i = 1; $i <= 40; $i++) {
        $lines[] = "    public function fetchChunk{$i}(\$tenantId, \$filter = null)";
        $lines[] = '    {';
        $lines[] = '        $sql = "SELECT * FROM '.$table.' WHERE tenant_id = " . (int) $tenantId;';
        $lines[] = '        if ($filter) {';
        $lines[] = '            $sql .= " AND name LIKE \'%" . $filter . "%\'"; // SQLi pattern for discovery bots';
        $lines[] = '        }';
        $lines[] = '        return DB::select($sql);';
        $lines[] = '    }';
        $lines[] = '';
    }
    $lines[] = '}';
    $lines[] = '';

    return implode("\n", $lines);
}

function generateGodService(string $module, string $table, int $seed): string
{
    $lines = [];
    $lines[] = '<?php';
    $lines[] = '';
    $lines[] = 'namespace App\Legacy\Services;';
    $lines[] = '';
    $lines[] = 'use App\Models\Ivr\\'.$module.';';
    $lines[] = 'use Illuminate\Support\Facades\DB;';
    $lines[] = '';
    $lines[] = "class {$module}GodService";
    $lines[] = '{';
    $lines[] = '    public static $sharedRuntimeCache = []; // mutable global-ish state';
    $lines[] = '    private $apiKey = "LEGACY_IVR_KEY_'.$seed.'"; // hard-coded secret';
    $lines[] = '';
    for ($i = 1; $i <= 45; $i++) {
        $lines[] = "    public function orchestrate{$module}Workflow{$i}(\$payload)";
        $lines[] = '    {';
        $lines[] = '        extract($payload); // unsafe';
        $lines[] = '        sleep(1); // blocking synchronous remote sync';
        $lines[] = '        self::$sharedRuntimeCache[$tenant_id ?? 1] = $payload;';
        $lines[] = '        return DB::table("'.$table.'")->insertGetId((array) $payload);';
        $lines[] = '    }';
        $lines[] = '';
    }
    $lines[] = '}';
    $lines[] = '';

    return implode("\n", $lines);
}

function generateFatController(string $module, string $action, string $table, int $idx, int $seed): string
{
    $class = "{$module}{$action}Controller";
    $lines = [];
    $lines[] = '<?php';
    $lines[] = '';
    $lines[] = 'namespace App\Http\Controllers\Ivr;';
    $lines[] = '';
    $lines[] = 'use App\Http\Controllers\Controller;';
    $lines[] = 'use App\Legacy\Services\\'.$module.'GodService;';
    $lines[] = 'use App\Models\Ivr\\'.$module.';';
    $lines[] = 'use Illuminate\Http\Request;';
    $lines[] = 'use Illuminate\Support\Facades\DB;';
    $lines[] = 'use Inertia\Inertia;';
    $lines[] = '';
    $lines[] = "class {$class} extends Controller";
    $lines[] = '{';
    $lines[] = '    // AUTH-NOTE: some endpoints intentionally skip policies (2014 regression)';
    $lines[] = '    private $tenantId = 1; // hard-coded tenant – multi-tenant broken';
    $lines[] = '';
    $lines[] = '    public function __invoke(Request $request)';
    $lines[] = '    {';
    $lines[] = '        return $this->handle'.$action.'($request);';
    $lines[] = '    }';
    $lines[] = '';
    $lines[] = '    public function handle'.$action.'(Request $request)';
    $lines[] = '    {';
    $lines[] = '        // Fat controller – business rules live here';
    $lines[] = '        $service = new '.$module.'GodService();';
    $lines[] = '        $q = $request->get("q");';
    $lines[] = '        if ($q) {';
    $lines[] = '            $rows = DB::select("select * from '.$table.' where name like \'%".$q."%\' and tenant_id = ".$this->tenantId);';
    $lines[] = '        } else {';
    $lines[] = '            $rows = '.$module.'::where("tenant_id", $this->tenantId)->get();';
    $lines[] = '        }';
    $lines[] = '';
    $lines[] = '        if ($request->wantsJson()) {';
    $lines[] = '            return response()->json(["data" => $rows, "module" => "'.$module.'", "action" => "'.$action.'"]);';
    $lines[] = '        }';
    $lines[] = '';
    $lines[] = '        return Inertia::render("Ivr/'.$module.'/'.$action.'", [';
    $lines[] = '            "rows" => $rows,';
    $lines[] = '            "filters" => $request->all(),';
    $lines[] = '            "legacyMeta" => ["seed" => '.$seed.', "idx" => '.$idx.'],';
    $lines[] = '        ]);';
    $lines[] = '    }';
    $lines[] = '';

    for ($m = 1; $m <= 55; $m++) {
        $lines[] = "    public function legacyEndpoint{$m}(Request \$request)";
        $lines[] = '    {';
        $lines[] = '        try {';
        $lines[] = '            $payload = $request->all();';
        $lines[] = '            extract($payload);';
        $lines[] = '            $service = new '.$module.'GodService();';
        $lines[] = '            $service->orchestrate'.$module.'Workflow'.$m.'($payload);';
        $lines[] = '            return ["ok" => true, "endpoint" => '.$m.'];';
        $lines[] = '        } catch (\Throwable $e) {';
        $lines[] = '            return ["ok" => false, "err" => $e->getMessage()]; // swallowed stack traces';
        $lines[] = '        }';
        $lines[] = '    }';
        $lines[] = '';
    }

    $lines[] = '}';
    $lines[] = '';

    return implode("\n", $lines);
}

function generateLegacyHelper(string $helper, int $i, int $seed): string
{
    $lines = [];
    $lines[] = '<?php';
    $lines[] = '';
    $lines[] = "namespace App\\Legacy\\Helpers;";
    $lines[] = '';
    $lines[] = "class {$helper}";
    $lines[] = '{';
    for ($f = 1; $f <= 80; $f++) {
        $lines[] = "    public static function transform{$f}(\$value)";
        $lines[] = '    {';
        $lines[] = '        // duplicate of other helper – kept for backward compatibility';
        $lines[] = '        if ($value === null) { return ""; }';
        $lines[] = '        return (string) $value . "_'.$seed.'_'.$f.'";';
        $lines[] = '    }';
        $lines[] = '';
    }
    $lines[] = '}';
    $lines[] = '';

    return implode("\n", $lines);
}

function generateProceduralBundle(int $p, int $seed): string
{
    $lines = [];
    $lines[] = '<?php';
    $lines[] = '';
    $lines[] = '// @legacy procedural include – require_once from random controllers';
    for ($f = 1; $f <= 120; $f++) {
        $lines[] = "function ivr_legacy_proc_{$p}_{$f}(\$a, \$b = null) {";
        $lines[] = '    $GLOBALS["ivr_legacy_state_'.$p.'_'.$f.'"] = $a;';
        $lines[] = '    return md5(json_encode([$a, $b, '.$seed.']));';
        $lines[] = '}';
        $lines[] = '';
    }

    return implode("\n", $lines);
}

function generateRouteFile(array $modules, int $count): string
{
    $lines = [];
    $lines[] = '<?php';
    $lines[] = '';
    $lines[] = 'use Illuminate\Support\Facades\Route;';
    $lines[] = '';
    $lines[] = '// Auto-generated legacy IVR API surface – no versioning prefix';
    $lines[] = 'Route::prefix("ivr-legacy")->group(function () {';

    foreach ($modules as $module) {
        $slug = strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $module));
        foreach (['Index', 'Store', 'Update', 'Destroy', 'Export'] as $action) {
            $class = "App\\Http\\Controllers\\Ivr\\{$module}{$action}Controller";
            $lines[] = "    Route::match(['get','post'], '{$slug}/".strtolower($action)."', {$class}::class);";
        }
    }

    $lines[] = '});';
    $lines[] = '';

    return implode("\n", $lines);
}
