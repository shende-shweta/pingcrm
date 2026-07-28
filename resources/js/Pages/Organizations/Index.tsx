import { Head, Link, router } from '@inertiajs/react'
import mapValues from 'lodash/mapValues'
import pickBy from 'lodash/pickBy'
import throttle from 'lodash/throttle'
import { useCallback, useEffect, useRef, useState } from 'react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'
import Icon from '@/Shared/Icon'
import Pagination from '@/Shared/Pagination'
import SearchFilter from '@/Shared/SearchFilter'
import { Paginated, SharedPageProps } from '@/types'

interface OrganizationRow {
    id: number
    name: string
    city: string | null
    phone: string | null
    deleted_at: string | null
}

interface Props extends SharedPageProps {
    filters: { search: string | null; trashed: string | null }
    organizations: Paginated<OrganizationRow>
}

function OrganizationsIndex({ filters, organizations }: Props) {
    const [form, setForm] = useState({
        search: filters.search ?? '',
        trashed: filters.trashed ?? '',
    })
    const isFirst = useRef(true)

    const visit = useCallback(
        throttle((next: typeof form) => {
            router.get('/organizations', pickBy(next), { preserveState: true })
        }, 150),
        [],
    )

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false
            return
        }
        visit(form)
    }, [form, visit])

    return (
        <div>
            <Head title="Organizations" />
            <h1 className="mb-8 text-3xl font-bold">Organizations</h1>
            <div className="mb-6 flex items-center justify-between">
                <SearchFilter
                    className="mr-4 w-full max-w-md"
                    value={form.search}
                    onChange={(search) => setForm((f) => ({ ...f, search }))}
                    onReset={() => setForm(mapValues(form, () => '') as typeof form)}
                >
                    <label className="block text-gray-700">Trashed:</label>
                    <select
                        className="form-select mt-1 w-full"
                        value={form.trashed}
                        onChange={(e) => setForm((f) => ({ ...f, trashed: e.target.value }))}
                    >
                        <option value="" />
                        <option value="with">With Trashed</option>
                        <option value="only">Only Trashed</option>
                    </select>
                </SearchFilter>
                <Link className="btn-indigo" href="/organizations/create">
                    <span>Create</span>
                    <span className="hidden md:inline">&nbsp;Organization</span>
                </Link>
            </div>
            <div className="overflow-x-auto rounded-md bg-white shadow">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="text-left font-bold">
                            <th className="px-6 pb-4 pt-6">Name</th>
                            <th className="px-6 pb-4 pt-6">City</th>
                            <th className="px-6 pb-4 pt-6" colSpan={2}>
                                Phone
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {organizations.data.map((organization) => (
                            <tr key={organization.id} className="hover:bg-gray-100 focus-within:bg-gray-100">
                                <td className="border-t">
                                    <Link className="flex items-center px-6 py-4 focus:text-indigo-500" href={`/organizations/${organization.id}/edit`}>
                                        {organization.name}
                                        {organization.deleted_at && <Icon name="trash" className="ml-2 h-3 w-3 shrink-0 fill-gray-400" />}
                                    </Link>
                                </td>
                                <td className="border-t">
                                    <Link className="flex items-center px-6 py-4" href={`/organizations/${organization.id}/edit`} tabIndex={-1}>
                                        {organization.city}
                                    </Link>
                                </td>
                                <td className="border-t">
                                    <Link className="flex items-center px-6 py-4" href={`/organizations/${organization.id}/edit`} tabIndex={-1}>
                                        {organization.phone}
                                    </Link>
                                </td>
                                <td className="w-px border-t">
                                    <Link className="flex items-center px-4" href={`/organizations/${organization.id}/edit`} tabIndex={-1}>
                                        <Icon name="cheveron-right" className="block h-6 w-6 fill-gray-400" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {organizations.data.length === 0 && (
                            <tr>
                                <td className="border-t px-6 py-4" colSpan={4}>
                                    No organizations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-6">
                <Pagination links={organizations.links} />
            </div>
        </div>
    )
}

OrganizationsIndex.layout = authenticatedLayout

export default OrganizationsIndex
