import { Head, router } from '@inertiajs/react'
import { FormEvent, useEffect, useState } from 'react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'

interface Column {
    key: string
    label: string
}

interface Row {
    id?: string | number
    [key: string]: string | number | undefined
}

interface ModuleTab {
    slug: string
    title: string
}

function statusClass(value: string) {
    const map: Record<string, string> = {
        Normal: 'bg-green-100 text-green-800',
        Warning: 'bg-yellow-100 text-yellow-800',
        Critical: 'bg-red-100 text-red-800',
        Available: 'bg-green-100 text-green-800',
        'On Call': 'bg-indigo-100 text-indigo-800',
        'Wrap-up': 'bg-gray-100 text-gray-800',
        Resolved: 'bg-green-100 text-green-800',
        Abandoned: 'bg-red-100 text-red-800',
    }
    return map[value] ?? ''
}

function buildModuleQuery(moduleSlug: string, q: string, organizationId: string) {
    const params: Record<string, string> = { module: moduleSlug }
    if (q) params.q = q
    if (organizationId) params.organization_id = organizationId
    return params
}

function IvrModulesIndex({
    moduleSlug,
    moduleTabs,
    title,
    description,
    viewType,
    filters,
    columns,
    rows,
    accountName,
}: {
    moduleSlug: string
    moduleKey: string
    moduleTabs: ModuleTab[]
    title: string
    description: string
    viewType: string
    filters: { q: string; organization_id?: string | number | null }
    columns: Column[]
    rows: Row[]
    accountName: string
}) {
    const [search, setSearch] = useState(filters.q ?? '')

    useEffect(() => {
        setSearch(filters.q ?? '')
    }, [filters.q, moduleSlug])

    const orgId = filters.organization_id ? String(filters.organization_id) : ''

    const visitModule = (slug: string, q = search) => {
        router.get('/ivr/modules', buildModuleQuery(slug, q, orgId), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        })
    }

    const submitSearch = (e?: FormEvent) => {
        e?.preventDefault()
        visitModule(moduleSlug, search)
    }

    return (
        <div>
            <Head title={`Modules · ${title}`} />
            <h1 className="text-3xl font-bold">Modules</h1>
            <p className="mt-1 text-sm text-gray-500">{accountName} · select a module to view live configuration and operational data</p>

            <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {moduleTabs.map((tab) => {
                    const selected = tab.slug === moduleSlug
                    return (
                        <button
                            key={tab.slug}
                            type="button"
                            onClick={() => visitModule(tab.slug, '')}
                            className={`rounded border bg-white p-4 text-left shadow transition hover:border-indigo-500 ${
                                selected ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'
                            }`}
                        >
                            <span className={`font-medium ${selected ? 'text-indigo-700' : 'text-gray-900'}`}>{tab.title}</span>
                        </button>
                    )
                })}
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="mt-2 max-w-3xl text-gray-600">{description}</p>

                <form onSubmit={submitSearch} className="mt-6 flex flex-wrap items-end gap-3 rounded bg-white p-4 shadow">
                    <div className="min-w-[16rem] flex-1">
                        <label className="text-xs font-medium uppercase text-gray-500">Search</label>
                        <input
                            type="search"
                            className="form-input mt-1 w-full"
                            placeholder="Name, caller, extension…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-indigo">
                        Search
                    </button>
                    <button
                        type="button"
                        className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={() => {
                            setSearch('')
                            visitModule(moduleSlug, '')
                        }}
                    >
                        Clear
                    </button>
                </form>

                <div className="mt-6 overflow-x-auto rounded bg-white shadow">
                    <div className="border-b px-4 py-3 text-sm text-gray-500">
                        {rows.length} record{rows.length === 1 ? '' : 's'} · view:{' '}
                        <span className="font-medium text-gray-700">{viewType}</span>
                    </div>
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} className="px-4 py-3">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, idx) => (
                                <tr key={row.id ?? idx} className="border-t hover:bg-gray-50">
                                    {columns.map((col) => {
                                        const val = row[col.key]
                                        const text = val === undefined || val === null ? '—' : String(val)
                                        const badge = ['status', 'disposition'].includes(col.key) ? statusClass(text) : ''

                                        return (
                                            <td key={col.key} className="px-4 py-3">
                                                {badge ? (
                                                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${badge}`}>{text}</span>
                                                ) : (
                                                    text
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
                                        No records found. Run{' '}
                                        <code className="text-xs">php artisan db:seed --class=Database\\Seeders\\IvrModuleSampleSeeder</code>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

IvrModulesIndex.layout = authenticatedLayout

export default IvrModulesIndex
