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

interface ContactRow {
    id: number
    name: string
    city: string | null
    phone: string | null
    deleted_at: string | null
    organization?: { name: string } | null
}

interface Props extends SharedPageProps {
    filters: { search: string | null; trashed: string | null }
    contacts: Paginated<ContactRow>
}

function ContactsIndex({ filters, contacts }: Props) {
    const [form, setForm] = useState({
        search: filters.search ?? '',
        trashed: filters.trashed ?? '',
    })
    const isFirst = useRef(true)

    const visit = useCallback(
        throttle((next: typeof form) => {
            router.get('/contacts', pickBy(next), { preserveState: true })
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
            <Head title="Contacts" />
            <h1 className="mb-8 text-3xl font-bold">Contacts</h1>
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
                <Link className="btn-indigo" href="/contacts/create">
                    <span>Create</span>
                    <span className="hidden md:inline">&nbsp;Contact</span>
                </Link>
            </div>
            <div className="overflow-x-auto rounded-md bg-white shadow">
                <table className="w-full whitespace-nowrap">
                    <tbody>
                        <tr className="text-left font-bold">
                            <th className="px-6 pb-4 pt-6">Name</th>
                            <th className="px-6 pb-4 pt-6">Organization</th>
                            <th className="px-6 pb-4 pt-6">City</th>
                            <th className="px-6 pb-4 pt-6" colSpan={2}>
                                Phone
                            </th>
                        </tr>
                        {contacts.data.map((contact) => (
                            <tr key={contact.id} className="hover:bg-gray-100 focus-within:bg-gray-100">
                                <td className="border-t">
                                    <Link className="flex items-center px-6 py-4 focus:text-indigo-500" href={`/contacts/${contact.id}/edit`}>
                                        {contact.name}
                                        {contact.deleted_at && <Icon name="trash" className="ml-2 h-3 w-3 shrink-0 fill-gray-400" />}
                                    </Link>
                                </td>
                                <td className="border-t">
                                    <Link className="flex items-center px-6 py-4" href={`/contacts/${contact.id}/edit`} tabIndex={-1}>
                                        {contact.organization?.name}
                                    </Link>
                                </td>
                                <td className="border-t">
                                    <Link className="flex items-center px-6 py-4" href={`/contacts/${contact.id}/edit`} tabIndex={-1}>
                                        {contact.city}
                                    </Link>
                                </td>
                                <td className="border-t">
                                    <Link className="flex items-center px-6 py-4" href={`/contacts/${contact.id}/edit`} tabIndex={-1}>
                                        {contact.phone}
                                    </Link>
                                </td>
                                <td className="w-px border-t">
                                    <Link className="flex items-center px-4" href={`/contacts/${contact.id}/edit`} tabIndex={-1}>
                                        <Icon name="cheveron-right" className="block h-6 w-6 fill-gray-400" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {contacts.data.length === 0 && (
                            <tr>
                                <td className="border-t px-6 py-4" colSpan={4}>
                                    No contacts found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-6">
                <Pagination links={contacts.links} />
            </div>
        </div>
    )
}

ContactsIndex.layout = authenticatedLayout

export default ContactsIndex
