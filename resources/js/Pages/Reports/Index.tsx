import { Head, router } from '@inertiajs/react'
import { FormEvent, useState } from 'react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'
import { SimpleBarChart } from '@/components/ivr/IvrHubCharts'

interface DailyRow {
    day: string
    answered: number
    abandoned: number
    total: number
}

interface CallSummary {
    total_calls: number
    abandoned: number
    answered_or_handled: number
    abandon_rate_pct: number
    avg_duration_sec: number
}

interface QueueRow {
    queue: string
    waiting: number
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

interface OrgOption {
    id: number
    name: string
}

function formatDuration(seconds: number) {
    if (seconds <= 0) return '—'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
}

function downloadUrl(type: 'calls' | 'daily' | 'queues', from: string, to: string, organizationId: string) {
    const params = new URLSearchParams({ type, from, to })
    if (organizationId) params.set('organization_id', organizationId)
    return `/reports/download?${params.toString()}`
}

function Reports({
    filters,
    dailyTrend,
    callSummary,
    queueSummary,
    recentCalls,
    organizationOptions,
    accountName,
}: {
    filters: { from: string; to: string; organization_id?: string | number | null }
    dailyTrend: DailyRow[]
    callSummary: CallSummary
    queueSummary: QueueRow[]
    recentCalls: CallRow[]
    organizationOptions: OrgOption[]
    accountName: string
}) {
    const [from, setFrom] = useState(filters.from)
    const [to, setTo] = useState(filters.to)
    const [organizationId, setOrganizationId] = useState(String(filters.organization_id ?? ''))

    const applyRange = (e?: FormEvent) => {
        e?.preventDefault()
        const query: Record<string, string> = { from, to }
        if (organizationId) query.organization_id = organizationId
        router.get('/reports', query, { preserveState: true, preserveScroll: true })
    }

    const chartSeries = dailyTrend.map((d, i) => ({
        label: d.day,
        value: d.total,
        color: ['#6366f1', '#818cf8', '#4f46e5', '#4338ca', '#6366f1', '#a5b4fc', '#22c55e'][i] ?? '#6366f1',
    }))

    return (
        <div>
            <Head title="Reports" />
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Reports</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        IVR metrics for {accountName}
                        {organizationId && (
                            <>
                                {' '}
                                ·{' '}
                                {organizationOptions.find((o) => String(o.id) === organizationId)?.name ?? 'Organization filter'}
                            </>
                        )}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <a className="btn-indigo text-sm" href={downloadUrl('calls', filters.from, filters.to, organizationId)}>
                        Download call detail (CSV)
                    </a>
                    <a className="rounded border border-indigo-600 px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50" href={downloadUrl('daily', filters.from, filters.to, organizationId)}>
                        Download weekly trend (CSV)
                    </a>
                    <a className="rounded border border-indigo-600 px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50" href={downloadUrl('queues', filters.from, filters.to, organizationId)}>
                        Download queue snapshot (CSV)
                    </a>
                </div>
            </div>

            <form onSubmit={applyRange} className="mb-8 flex flex-wrap items-end gap-3 rounded bg-white p-4 shadow">
                <div>
                    <label className="text-xs font-medium uppercase text-gray-500">From</label>
                    <input type="date" className="form-input mt-1" value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div>
                    <label className="text-xs font-medium uppercase text-gray-500">To</label>
                    <input type="date" className="form-input mt-1" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
                <div>
                    <label className="text-xs font-medium uppercase text-gray-500">Organization</label>
                    <select className="form-select mt-1 min-w-[14rem]" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
                        <option value="">All organizations</option>
                        {organizationOptions.map((o) => (
                            <option key={o.id} value={o.id}>
                                {o.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn-indigo">
                    Apply date range
                </button>
            </form>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded bg-white p-4 shadow">
                    <div className="text-sm text-gray-500">Calls in range</div>
                    <div className="text-2xl font-bold">{callSummary.total_calls}</div>
                </div>
                <div className="rounded bg-white p-4 shadow">
                    <div className="text-sm text-gray-500">Handled</div>
                    <div className="text-2xl font-bold text-green-600">{callSummary.answered_or_handled}</div>
                </div>
                <div className="rounded bg-white p-4 shadow">
                    <div className="text-sm text-gray-500">Abandon rate</div>
                    <div className="text-2xl font-bold text-red-600">{callSummary.abandon_rate_pct}%</div>
                </div>
                <div className="rounded bg-white p-4 shadow">
                    <div className="text-sm text-gray-500">Avg duration</div>
                    <div className="text-2xl font-bold">{formatDuration(callSummary.avg_duration_sec)}</div>
                </div>
            </div>

            <div className="mb-8 grid gap-4 lg:grid-cols-2">
                <SimpleBarChart title="Weekly call volume (answered + abandoned)" series={chartSeries} />
                <div className="overflow-x-auto rounded bg-white shadow">
                    <div className="border-b px-4 py-3 font-semibold">Daily breakdown</div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-2 text-left">Day</th>
                                <th className="px-4 py-2 text-right">Answered</th>
                                <th className="px-4 py-2 text-right">Abandoned</th>
                                <th className="px-4 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyTrend.map((row) => (
                                <tr key={row.day} className="border-t">
                                    <td className="px-4 py-2">{row.day}</td>
                                    <td className="px-4 py-2 text-right">{row.answered}</td>
                                    <td className="px-4 py-2 text-right">{row.abandoned}</td>
                                    <td className="px-4 py-2 text-right font-medium">{row.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mb-8 overflow-x-auto rounded bg-white shadow">
                <div className="border-b px-4 py-3 font-semibold">Queue snapshot</div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-4 py-2 text-left">Queue</th>
                            <th className="px-4 py-2 text-right">Waiting</th>
                            <th className="px-4 py-2 text-right">SLA %</th>
                            <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queueSummary.map((q) => (
                            <tr key={q.queue} className="border-t">
                                <td className="px-4 py-2">{q.queue}</td>
                                <td className="px-4 py-2 text-right">{q.waiting}</td>
                                <td className="px-4 py-2 text-right">{q.sla_pct}%</td>
                                <td className="px-4 py-2">{q.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="overflow-x-auto rounded bg-white shadow">
                <div className="border-b px-4 py-3 font-semibold">Call detail ({filters.from} → {filters.to})</div>
                <table className="w-full min-w-[640px] text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Caller</th>
                            <th className="px-4 py-2 text-left">Organization</th>
                            <th className="px-4 py-2 text-left">Queue</th>
                            <th className="px-4 py-2 text-left">Agent</th>
                            <th className="px-4 py-2 text-left">Duration</th>
                            <th className="px-4 py-2 text-left">Disposition</th>
                            <th className="px-4 py-2 text-left">Started</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentCalls.map((c) => (
                            <tr key={c.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2 font-mono text-xs">{c.id}</td>
                                <td className="px-4 py-2">{c.caller}</td>
                                <td className="px-4 py-2">{c.organization}</td>
                                <td className="px-4 py-2">{c.queue}</td>
                                <td className="px-4 py-2">{c.agent}</td>
                                <td className="px-4 py-2">{formatDuration(c.duration_sec)}</td>
                                <td className="px-4 py-2">{c.disposition}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{c.started_at}</td>
                            </tr>
                        ))}
                        {recentCalls.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                    No calls in this date range. Seed with{' '}
                                    <code className="text-xs">php artisan db:seed --class=Database\\Seeders\\IvrDashboardSeeder</code>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

Reports.layout = authenticatedLayout

export default Reports
