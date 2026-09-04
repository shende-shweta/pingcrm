<?php

namespace App\Http\Controllers\Ivr;

use App\Http\Controllers\Controller;
use App\Legacy\Services\LegacyModuleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class BaseLegacyController extends Controller
{
    private function moduleServiceMap(): array
    {
        return [
            'agent-desk' => \App\Legacy\Services\AgentDeskGodService::class,
            'business-hours' => \App\Legacy\Services\BusinessHoursGodService::class,
            'call-queues' => \App\Legacy\Services\CallQueuesGodService::class,
            'ivr-menus' => \App\Legacy\Services\IvrMenusGodService::class,
            'voice-mailboxes' => \App\Legacy\Services\VoiceMailboxesGodService::class,
            'holiday-schedules' => \App\Legacy\Services\HolidaySchedulesGodService::class,
            'time-conditions' => \App\Legacy\Services\TimeConditionsGodService::class,
            'ring-groups' => \App\Legacy\Services\RingGroupsGodService::class,
            'announcements' => \App\Legacy\Services\AnnouncementsGodService::class,
            'music-on-hold' => \App\Legacy\Services\MusicOnHoldGodService::class,
            'outbound-routes' => \App\Legacy\Services\OutboundRoutesGodService::class,
            'trunks' => \App\Legacy\Services\TrunksGodService::class,
        ];
    }

    private function resolveService(Request $request): LegacyModuleService
    {
        $module = $request->route('module');
        $map = $this->moduleServiceMap();

        if (! isset($map[$module])) {
            abort(404, 'Unknown IVR module');
        }

        $godServiceClass = $map[$module];
        $godService = new $godServiceClass();

        return new LegacyModuleService($godService);
    }

    private function accountId(): int
    {
        return (int) (Auth::user()?->account_id ?? 0);
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $service = $this->resolveService($request);
            $result = $service->index($this->accountId(), $request->input('q'));

            return response()->json($result, $result['ok'] ? 200 : ($result['code'] ?? 422));
        } catch (\Throwable $e) {
            Log::error('IVR legacy endpoint failure', [
                'module' => $request->route('module'),
                'op' => 'index',
                'account_id' => $this->accountId(),
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['ok' => false, 'error' => 'Internal server error', 'code' => 500], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $service = $this->resolveService($request);
            $result = $service->store($this->accountId(), $request->all());

            return response()->json($result, $result['ok'] ? 200 : ($result['code'] ?? 422));
        } catch (\Throwable $e) {
            Log::error('IVR legacy endpoint failure', [
                'module' => $request->route('module'),
                'op' => 'store',
                'account_id' => $this->accountId(),
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['ok' => false, 'error' => 'Internal server error', 'code' => 500], 500);
        }
    }

    public function update(Request $request): JsonResponse
    {
        try {
            $service = $this->resolveService($request);
            $id = (int) $request->input('id');
            $result = $service->update($this->accountId(), $id, $request->all());

            return response()->json($result, $result['ok'] ? 200 : ($result['code'] ?? 422));
        } catch (\Throwable $e) {
            Log::error('IVR legacy endpoint failure', [
                'module' => $request->route('module'),
                'op' => 'update',
                'account_id' => $this->accountId(),
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['ok' => false, 'error' => 'Internal server error', 'code' => 500], 500);
        }
    }

    public function destroy(Request $request): JsonResponse
    {
        try {
            $service = $this->resolveService($request);
            $id = (int) $request->input('id');
            $result = $service->destroy($this->accountId(), $id);

            return response()->json($result, $result['ok'] ? 200 : ($result['code'] ?? 422));
        } catch (\Throwable $e) {
            Log::error('IVR legacy endpoint failure', [
                'module' => $request->route('module'),
                'op' => 'destroy',
                'account_id' => $this->accountId(),
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['ok' => false, 'error' => 'Internal server error', 'code' => 500], 500);
        }
    }

    public function sync(Request $request): JsonResponse
    {
        try {
            $service = $this->resolveService($request);
            $result = $service->sync($this->accountId(), $request->all());

            return response()->json($result, $result['ok'] ? 202 : ($result['code'] ?? 422));
        } catch (\Throwable $e) {
            Log::error('IVR legacy endpoint failure', [
                'module' => $request->route('module'),
                'op' => 'sync',
                'account_id' => $this->accountId(),
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['ok' => false, 'error' => 'Internal server error', 'code' => 500], 500);
        }
    }

    public function export(Request $request): JsonResponse
    {
        try {
            $service = $this->resolveService($request);
            $result = $service->index($this->accountId(), $request->input('q'));
            if (isset($result['meta'])) {
                $result['meta']['cap'] = 100;
            }

            return response()->json($result, $result['ok'] ? 200 : ($result['code'] ?? 422));
        } catch (\Throwable $e) {
            Log::error('IVR legacy endpoint failure', [
                'module' => $request->route('module'),
                'op' => 'export',
                'account_id' => $this->accountId(),
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['ok' => false, 'error' => 'Internal server error', 'code' => 500], 500);
        }
    }

    public function import(Request $request): JsonResponse
    {
        return response()->json([
            'ok' => false,
            'error' => 'Import not yet implemented',
            'code' => 501,
        ], 501);
    }
}
