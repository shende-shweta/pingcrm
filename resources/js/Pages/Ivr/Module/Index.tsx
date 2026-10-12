import { Head, router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'
import IvrDataTable from '@/components/ivr/IvrDataTable'
import IvrSearchForm from '@/components/ivr/IvrSearchForm'
import type { IvrColumn, IvrModuleTab, IvrRow } from '@/types/ivr'

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
    moduleTabs: IvrModuleTab[]
    title: string
    description: string
    viewType: string
    filters: { q: string; organization_id?: string | number | null }
    columns: IvrColumn[]
    rows: IvrRow[]
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

    const emptyMessage = (
        <>
            No records found. Run{' '}
            <code className="text-xs">php artisan db:seed --class=Database\\Seeders\\IvrModuleSampleSeeder</code>
        </>
    )

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

                <IvrSearchForm
                    value={search}
                    onChange={setSearch}
                    onSubmit={() => visitModule(moduleSlug, search)}
                    onClear={() => {
                        setSearch('')
                        visitModule(moduleSlug, '')
                    }}
                />

                <IvrDataTable
                    columns={columns}
                    rows={rows}
                    viewType={viewType}
                    emptyMessage={emptyMessage}
                />
            </div>
        </div>
    )
}

IvrModulesIndex.layout = authenticatedLayout

export default IvrModulesIndex
