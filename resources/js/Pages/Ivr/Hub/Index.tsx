import { Head, router } from '@inertiajs/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'
import { DonutChart, SimpleBarChart, StackedAreaChart } from '@/components/ivr/IvrHubCharts'

interface Stats {
    active_calls: number
    queued_calls: number
    agents_online: number
    service_level_pct: number
    avg_handle_time_sec: number
    abandon_rate_pct: number
}

interface QueueRow {
    id: number
    queue: string
    organization: string
    waiting: number
    longest_wait_sec: number
    agents: number
    sla_pct: number
    status: string
}

interface CallRow {
    id: string
    caller: string
    queue: string
    agent: string
    organization: string
    duration_sec: number
    disposition: string
    started_at: string
}

interface AgentRow {
    name: string
    extension: string
    status: string
    queue: string
    calls_today: number
}

interface Filters {
    date: string
    queue_id: string | number | null
    disposition: string | null
    search: string | null
    organization_id: string | number | null
}

interface OrgOption {
    id: number
    name: string
}

interface QueueOption {
    id: number
    name: string
}

const RELOAD_KEYS = [
    'stats',
    'callVolumeByHour',
    'callTrend',
    'queueDistribution',
    'queueMetrics',
    'recentCalls',
    'agentSnapshot',
    'refreshedAt',
] as const

function formatDuration(seconds: number) {
    if (seconds <= 0) return '—'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
}

function statusBadge(status: string) {
    const map: Record<string, string> = {
        Normal: 'bg-green-100 text-green-800',
        Warning: 'bg-yellow-100 text-yellow-800',
        Critical: 'bg-red-100 text-red-800',
        Available: 'bg-green-100 text-green-800',
        'On Call': 'bg-indigo-100 text-indigo-800',
        'Wrap-up': 'bg-gray-100 text-gray-800',
        Resolved: 'bg-green-100 text-green-800',
        Sale: 'bg-indigo-100 text-indigo-800',
        Escalated: 'bg-orange-100 text-orange-800',
        Abandoned: 'bg-red-100 text-red-800',
        Callback: 'bg-blue-100 text-blue-800',
    }
    return map[status] ?? 'bg-gray-100 text-gray-700'
}

function buildQuery(filters: Filters) {
    const q: Record<string, string> = { date: filters.date }
    if (filters.queue_id) q.queue_id = String(filters.queue_id)
    if (filters.disposition) q.disposition = filters.disposition
    if (filters.search) q.search = filters.search
    if (filters.organization_id) q.organization_id = String(filters.organization_id)
    return q
}

function IvrHub({
    stats,
    callVolumeByHour,
    callTrend,
    queueDistribution,
    queueMetrics,
    recentCalls,
    agentSnapshot,
    filters,
    queueOptions,
    dispositionOptions,
    organizationOptions,
    accountName,
    refreshedAt,
}: {
    stats: Stats
    callVolumeByHour: { label: string; value: number; color: string }[]
    callTrend: { label: string; answered: number; abandoned: number }[]
    queueDistribution: { label: string; value: number; color: string }[]
    queueMetrics: QueueRow[]
    recentCalls: CallRow[]
    agentSnapshot: AgentRow[]
    filters: Filters
    queueOptions: QueueOption[]
    dispositionOptions: string[]
    organizationOptions: OrgOption[]
    accountName: string
    refreshedAt: string
}) {
    const [localFilters, setLocalFilters] = useState<Filters>({
        date: filters.date,
        queue_id: filters.queue_id ?? '',
        disposition: filters.disposition ?? '',
        search: filters.search ?? '',
        organization_id: filters.organization_id ?? '',
    })
    const [autoRefresh, setAutoRefresh] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLocalFilters({
            date: filters.date,
            queue_id: filters.queue_id ?? '',
            disposition: filters.disposition ?? '',
            search: filters.search ?? '',
            organization_id: filters.organization_id ?? '',
        })
    }, [filters])

    const applyFilters = useCallback(
        (next: Filters) => {
            setLoading(true)
            router.get('/ivr', buildQuery(next), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onFinish: () => setLoading(false),
            })
        },
        [],
    )

    const refreshDashboard = useCallback(() => {
        router.reload({
            only: [...RELOAD_KEYS],
            preserveScroll: true,
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        })
    }, [])

    useEffect(() => {
        if (!autoRefresh) return
        const id = window.setInterval(refreshDashboard, 20000)
        return () => window.clearInterval(id)
    }, [autoRefresh, refreshDashboard, filters])

    const selectedQueueId = useMemo(() => String(filters.queue_id ?? ''), [filters.queue_id])

    return (
        <div>
            <Head title="IVR Enterprise Hub" />
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">IVR Enterprise Platform</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {accountName} · scoped to your CRM account
                        {filters.organization_id && organizationOptions.length > 0 && (
                            <>
                                {' '}
                                · Organization:{' '}
                                <span className="font-medium text-gray-700">
                                    {organizationOptions.find((o) => String(o.id) === String(filters.organization_id))?.name ??
                                        'Selected'}
                                </span>
                            </>
                        )}
                        {' '}
                        · Last updated {new Date(refreshedAt).toLocaleTimeString()}
                        {loading && <span className="ml-2 text-indigo-600">Refreshing…</span>}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
                        Auto-refresh (20s)
                    </label>
                    <button type="button" className="btn-indigo text-sm" onClick={refreshDashboard}>
                        Refresh now
                    </button>
                </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-3 rounded bg-white p-4 shadow">
                <div>
                    <label className="text-xs font-medium uppercase text-gray-500">Organization</label>
                    <select
                        className="form-select mt-1 min-w-[14rem]"
                        value={String(localFilters.organization_id ?? '')}
                        onChange={(e) => setLocalFilters((f) => ({ ...f, organization_id: e.target.value }))}
                    >
                        <option value="">All organizations</option>
                        {organizationOptions.map((o) => (
                            <option key={o.id} value={o.id}>
                                {o.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium uppercase text-gray-500">Date</label>
                    <input
                        type="date"
                        className="form-input mt-1 block"
                        value={localFilters.date}
                        onChange={(e) => setLocalFilters((f) => ({ ...f, date: e.target.value }))}
                    />
                </div>
                <div>
                    <label className="text-xs font-medium uppercase text-gray-500">Queue</label>
                    <select
                        className="form-select mt-1 min-w-[12rem]"
                        value={String(localFilters.queue_id ?? '')}
                        onChange={(e) => setLocalFilters((f) => ({ ...f, queue_id: e.target.value }))}
                    >
                        <option value="">All queues</option>
                        {queueOptions.map((q) => (
                            <option key={q.id} value={q.id}>
                                {q.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium uppercase text-gray-500">Disposition</label>
                    <select
                        className="form-select mt-1 min-w-[10rem]"
                        value={localFilters.disposition ?? ''}
                        onChange={(e) => setLocalFilters((f) => ({ ...f, disposition: e.target.value }))}
                    >
                        <option value="">All</option>
                        {dispositionOptions.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="min-w-[12rem] flex-1">
                    <label className="text-xs font-medium uppercase text-gray-500">Search caller / ID</label>
                    <input
                        type="search"
                        className="form-input mt-1 w-full"
                        placeholder="416, C-88421…"
                        value={localFilters.search ?? ''}
                        onChange={(e) => setLocalFilters((f) => ({ ...f, search: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters(localFilters)}
                    />
                </div>
                <div className="flex gap-2 pb-0.5">
                    <button type="button" className="btn-indigo mt-5" onClick={() => applyFilters(localFilters)}>
                        Apply filters
                    </button>
                    <button
                        type="button"
                        className="mt-5 rounded border px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={() =>
                            applyFilters({
                                date: localFilters.date,
                                queue_id: '',
                                disposition: '',
                                search: '',
                                organization_id: '',
                            })
                        }
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <div className="rounded bg-white p-4 shadow">
                    <div className="text-sm text-gray-500">Active calls</div>
                    <div className="text-2xl font-bold text-indigo-600">{stats.active_calls}</div>
                </div>
                <div className="rounded bg-white p-4 shadow">
                    <div className="text-sm text-gray-500">In queue</div>
                    <div className="text-2xl font-bold">{stats.queued_calls}</div>
                </div>
                <div className="rounded bg-white p-4 shadow">
                    <div className="text-sm text-gray-500">Agents online</div>
                    <div className="text-2xl font-bold">{stats.agents_online}</div>
                </div>
                <div className="rounded bg-white p-4 shadow">
                    <div className="text-sm text-gray-500">Service level</div>
                    <div className="text-2xl font-bold text-green-600">{stats.service_level_pct}%</div>
                </div>
                <div className="rounded bg-white p-4 shadow">
                    <div className="text-sm text-gray-500">Avg handle time</div>
                    <div className="text-2xl font-bold">{formatDuration(stats.avg_handle_time_sec)}</div>
                </div>
                <div className="rounded bg-white p-4 shadow">
                    <div className="text-sm text-gray-500">Abandon rate</div>
                    <div className="text-2xl font-bold text-red-600">{stats.abandon_rate_pct}%</div>
                </div>
            </div>

            <div className="mb-8 grid gap-4 lg:grid-cols-3">
                <SimpleBarChart title={`Inbound volume (${filters.date})`} series={callVolumeByHour} />
                <StackedAreaChart title="Weekly answered vs abandoned" points={callTrend} />
                <DonutChart title="Calls by category (last hour)" segments={queueDistribution} />
            </div>

            <div className="mb-8 overflow-x-auto rounded bg-white shadow">
                <div className="border-b px-4 py-3">
                    <h2 className="text-lg font-semibold">Queue performance</h2>
                    <p className="text-xs text-gray-500">Click a row to filter the dashboard by that queue.</p>
                </div>
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-4 py-3">Queue</th>
                            <th className="px-4 py-3">Organization</th>
                            <th className="px-4 py-3">Waiting</th>
                            <th className="px-4 py-3">Longest wait</th>
                            <th className="px-4 py-3">Agents</th>
                            <th className="px-4 py-3">SLA %</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queueMetrics.map((row) => (
                            <tr
                                key={row.id}
                                className={`cursor-pointer border-t hover:bg-indigo-50 ${String(row.id) === selectedQueueId ? 'bg-indigo-50 ring-1 ring-inset ring-indigo-200' : ''}`}
                                onClick={() =>
                                    applyFilters({
                                        ...localFilters,
                                        queue_id: String(row.id) === selectedQueueId ? '' : row.id,
                                    })
                                }
                            >
                                <td className="px-4 py-3 font-medium">{row.queue}</td>
                                <td className="px-4 py-3 text-gray-600">{row.organization}</td>
                                <td className="px-4 py-3">{row.waiting}</td>
                                <td className="px-4 py-3">{formatDuration(row.longest_wait_sec)}</td>
                                <td className="px-4 py-3">{row.agents}</td>
                                <td className="px-4 py-3">{row.sla_pct}%</td>
                                <td className="px-4 py-3">
                                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusBadge(row.status)}`}>{row.status}</span>
                                </td>
                            </tr>
                        ))}
                        {queueMetrics.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                    No queue data. Run <code className="text-xs">php artisan migrate --seed</code>.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mb-8 grid gap-4 xl:grid-cols-2">
                <div className="overflow-x-auto rounded bg-white shadow">
                    <div className="border-b px-4 py-3">
                        <h2 className="text-lg font-semibold">Recent calls</h2>
                    </div>
                    <table className="w-full min-w-[520px] text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Caller</th>
                                <th className="px-4 py-2">Organization</th>
                                <th className="px-4 py-2">Queue</th>
                                <th className="px-4 py-2">Agent</th>
                                <th className="px-4 py-2">Duration</th>
                                <th className="px-4 py-2">Disposition</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentCalls.map((call) => (
                                <tr
                                    key={call.id}
                                    className="cursor-pointer border-t hover:bg-gray-50"
                                    onClick={() =>
                                        applyFilters({
                                            ...localFilters,
                                            disposition: call.disposition === '—' ? '' : call.disposition,
                                        })
                                    }
                                >
                                    <td className="whitespace-nowrap px-4 py-2 font-mono text-xs">{call.id}</td>
                                    <td className="px-4 py-2">{call.caller}</td>
                                    <td className="px-4 py-2 text-gray-600">{call.organization}</td>
                                    <td className="px-4 py-2 text-gray-600">{call.queue}</td>
                                    <td className="px-4 py-2">{call.agent}</td>
                                    <td className="px-4 py-2">{formatDuration(call.duration_sec)}</td>
                                    <td className="px-4 py-2">
                                        <span className={`rounded px-2 py-0.5 text-xs ${statusBadge(call.disposition)}`}>{call.disposition}</span>
                                    </td>
                                </tr>
                            ))}
                            {recentCalls.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                                        No calls match your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="overflow-x-auto rounded bg-white shadow">
                    <div className="border-b px-4 py-3">
                        <h2 className="text-lg font-semibold">Agent snapshot</h2>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-2">Agent</th>
                                <th className="px-4 py-2">Ext</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Queue</th>
                                <th className="px-4 py-2">Calls today</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agentSnapshot.map((agent) => (
                                <tr key={agent.extension} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium">{agent.name}</td>
                                    <td className="px-4 py-2 font-mono text-xs">{agent.extension}</td>
                                    <td className="px-4 py-2">
                                        <span className={`rounded px-2 py-0.5 text-xs ${statusBadge(agent.status)}`}>{agent.status}</span>
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">{agent.queue}</td>
                                    <td className="px-4 py-2">{agent.calls_today}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

IvrHub.layout = authenticatedLayout

export default IvrHub
