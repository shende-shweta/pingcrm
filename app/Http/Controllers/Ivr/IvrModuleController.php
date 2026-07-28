<?php

namespace App\Http\Controllers\Ivr;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Ivr\Concerns\LoadsIvrModuleData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class IvrModuleController extends Controller
{
    use LoadsIvrModuleData;

    public const DEFAULT_MODULE_SLUG = 'live-monitoring';

    /** @var array<string, string> slug => PascalCase module folder name */
    public const SLUG_MAP = [
        'call-flow' => 'CallFlow',
        'queue-management' => 'QueueManagement',
        'agent-desk' => 'AgentDesk',
        'prompt-library' => 'PromptLibrary',
        'business-hours' => 'BusinessHours',
        'did-inventory' => 'DidInventory',
        'call-analytics' => 'CallAnalytics',
        'historical-reports' => 'HistoricalReports',
        'live-monitoring' => 'LiveMonitoring',
        'call-recording' => 'CallRecording',
        'customer-profile' => 'CustomerProfile',
        'crm-bridge' => 'CrmBridge',
        'api-integration' => 'ApiIntegration',
        'notification-hub' => 'NotificationHub',
        'role-access' => 'RoleAccess',
        'audit-trail' => 'AuditTrail',
        'tenant-admin' => 'TenantAdmin',
        'system-config' => 'SystemConfig',
    ];

    /** @var array<string, array{title: string, description: string, view: string}> */
    public const MODULE_META = [
        'call-flow' => [
            'title' => 'Call Flow Designer',
            'description' => 'Design IVR menus, DTMF branches, and transfer points.',
            'view' => 'config',
        ],
        'queue-management' => [
            'title' => 'Queue Management',
            'description' => 'Live queue depth, SLA, and agent capacity.',
            'view' => 'queues',
        ],
        'agent-desk' => [
            'title' => 'Agent Management',
            'description' => 'Agent status, extensions, and daily call counts.',
            'view' => 'agents',
        ],
        'prompt-library' => [
            'title' => 'Prompt / Audio Library',
            'description' => 'Manage voice prompts and audio assets used in call flows.',
            'view' => 'config',
        ],
        'business-hours' => [
            'title' => 'Business Hours',
            'description' => 'Schedules that route callers to open or closed treatments.',
            'view' => 'config',
        ],
        'did-inventory' => [
            'title' => 'DID Numbers',
            'description' => 'Inbound numbers and their routing targets.',
            'view' => 'config',
        ],
        'call-analytics' => [
            'title' => 'Call Analytics',
            'description' => 'Today’s inbound volume by hour.',
            'view' => 'hourly',
        ],
        'historical-reports' => [
            'title' => 'Historical Reports',
            'description' => 'Weekly answered vs abandoned call trends.',
            'view' => 'trends',
        ],
        'live-monitoring' => [
            'title' => 'Live Monitoring',
            'description' => 'Recent call activity across queues.',
            'view' => 'calls',
        ],
        'call-recording' => [
            'title' => 'Call Recordings',
            'description' => 'Recording metadata and retention settings.',
            'view' => 'config',
        ],
        'customer-profile' => [
            'title' => 'Customer Profiles',
            'description' => 'Caller profile records linked to CRM context.',
            'view' => 'config',
        ],
        'crm-bridge' => [
            'title' => 'CRM Integrations',
            'description' => 'Connectors to Salesforce and other CRM systems.',
            'view' => 'config',
        ],
        'api-integration' => [
            'title' => 'API Integrations',
            'description' => 'Webhook and REST integration endpoints.',
            'view' => 'config',
        ],
        'notification-hub' => [
            'title' => 'Notifications',
            'description' => 'Alert rules for queue SLA and system events.',
            'view' => 'config',
        ],
        'role-access' => [
            'title' => 'Users & Roles',
            'description' => 'Role-based access for IVR administration.',
            'view' => 'config',
        ],
        'audit-trail' => [
            'title' => 'Audit Logs',
            'description' => 'Configuration and access audit history.',
            'view' => 'config',
        ],
        'tenant-admin' => [
            'title' => 'Tenant Admin',
            'description' => 'Multi-tenant settings and isolation policies.',
            'view' => 'config',
        ],
        'system-config' => [
            'title' => 'System Administration',
            'description' => 'Platform-wide switches, limits, and maintenance windows.',
            'view' => 'config',
        ],
    ];

    public function modulesIndex(Request $request)
    {
        $moduleSlug = $request->input('module', self::DEFAULT_MODULE_SLUG);
        if (! isset(self::SLUG_MAP[$moduleSlug], self::MODULE_META[$moduleSlug])) {
            $moduleSlug = self::DEFAULT_MODULE_SLUG;
        }

        return Inertia::render('Ivr/Module/Index', $this->modulePageProps($request, $moduleSlug));
    }

    public function show(Request $request, string $moduleSlug)
    {
        if (! isset(self::SLUG_MAP[$moduleSlug], self::MODULE_META[$moduleSlug])) {
            throw new NotFoundHttpException('Unknown IVR module.');
        }

        return redirect()->route('ivr.modules', array_filter([
            'module' => $moduleSlug,
            'q' => $request->input('q'),
            'organization_id' => $request->input('organization_id'),
        ]));
    }

    /** @return array<string, mixed> */
    private function modulePageProps(Request $request, string $moduleSlug): array
    {
        $meta = self::MODULE_META[$moduleSlug];
        $filters = [
            'q' => $request->input('q', ''),
            'organization_id' => $request->input('organization_id'),
        ];

        return [
            'moduleSlug' => $moduleSlug,
            'moduleKey' => self::SLUG_MAP[$moduleSlug],
            'moduleTabs' => $this->moduleTabCatalog(),
            'title' => $meta['title'],
            'description' => $meta['description'],
            'viewType' => $meta['view'],
            'filters' => $filters,
            'columns' => $this->columnsForView($meta['view']),
            'rows' => $this->loadModuleRows($request, $moduleSlug, $meta['view'], $filters),
            'accountName' => $request->user()->account->name,
        ];
    }
}
