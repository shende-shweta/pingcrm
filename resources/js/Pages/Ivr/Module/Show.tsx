import { Head, Link, router } from '@inertiajs/react'
import { FormEvent, useState } from 'react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'

interface Column {
    key: string
    label: string
}

interface Row {
    id?: string | number
    [key: string]: string | number | undefined
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

function IvrModuleShow({
    moduleSlug,
    title,
    description,
    viewType,
    filters,
    columns,
    rows,
}: {
    moduleSlug: string
    moduleKey: string
    title: string
    description: string
    viewType: string
    filters: { q: string }
    columns: Column[]
    rows: Row[]
}) {
    const [search, setSearch] = useState(filters.q ?? '')

    const submitSearch = (e?: FormEvent) => {
        e?.preventDefault()
        router.get(`/ivr/${moduleSlug}`, { q: search || undefined }, { preserveState: true, preserveScroll: true })
    }

    return (
        <div>
            <Head title={title} />
            <nav className="mb-4 text-sm text-gray-500">
                <Link href="/ivr" className="text-indigo-600 hover:underline">
                    IVR Platform
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-700">{title}</span>
            </nav>

            <h1 className="text-3xl font-bold">{title}</h1>
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
                        router.get(`/ivr/${moduleSlug}`, {}, { preserveScroll: true })
                    }}
                >
                    Clear
                </button>
                <Link href="/ivr" className="ml-auto text-sm text-indigo-600 underline">
                    Back to IVR hub
                </Link>
            </form>

            <div className="mt-6 overflow-x-auto rounded bg-white shadow">
                <div className="border-b px-4 py-3 text-sm text-gray-500">
                    {rows.length} record{rows.length === 1 ? '' : 's'} · view: <span className="font-medium text-gray-700">{viewType}</span>
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
    )
}

IvrModuleShow.layout = authenticatedLayout

export default IvrModuleShow
