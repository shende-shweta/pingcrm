import { Head, Link, router } from '@inertiajs/react'
import mapValues from 'lodash/mapValues'
import pickBy from 'lodash/pickBy'
import throttle from 'lodash/throttle'
import { useCallback, useEffect, useRef, useState } from 'react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'
import Icon from '@/Shared/Icon'
import SearchFilter from '@/Shared/SearchFilter'
import { SharedPageProps } from '@/types'

interface UserRow {
    id: number
    name: string
    email: string
    owner: boolean
    photo: string | null
    deleted_at: string | null
}

interface Props extends SharedPageProps {
    filters: { search: string | null; role: string | null; trashed: string | null }
    users: UserRow[]
}

function UsersIndex({ filters, users }: Props) {
    const [form, setForm] = useState({
        search: filters.search ?? '',
        role: filters.role ?? '',
        trashed: filters.trashed ?? '',
    })
    const isFirst = useRef(true)

    const visit = useCallback(
        throttle((next: typeof form) => {
            router.get('/users', pickBy(next), { preserveState: true })
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
            <Head title="Users" />
            <h1 className="mb-8 text-3xl font-bold">Users</h1>
            <div className="mb-6 flex items-center justify-between">
                <SearchFilter
                    className="mr-4 w-full max-w-md"
                    value={form.search}
                    onChange={(search) => setForm((f) => ({ ...f, search }))}
                    onReset={() => setForm(mapValues(form, () => '') as typeof form)}
                >
                    <label className="block text-gray-700">Role:</label>
                    <select className="form-select mt-1 w-full" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                        <option value="" />
                        <option value="user">User</option>
                        <option value="owner">Owner</option>
                    </select>
                    <label className="mt-4 block text-gray-700">Trashed:</label>
                    <select className="form-select mt-1 w-full" value={form.trashed} onChange={(e) => setForm((f) => ({ ...f, trashed: e.target.value }))}>
                        <option value="" />
                        <option value="with">With Trashed</option>
                        <option value="only">Only Trashed</option>
                    </select>
                </SearchFilter>
                <Link className="btn-indigo" href="/users/create">
                    <span>Create</span>
                    <span className="hidden md:inline">&nbsp;User</span>
                </Link>
            </div>
            <div className="overflow-x-auto rounded-md bg-white shadow">
                <table className="w-full whitespace-nowrap">
                    <tbody>
                        <tr className="text-left font-bold">
                            <th className="px-6 pb-4 pt-6">Name</th>
                            <th className="px-6 pb-4 pt-6">Email</th>
                            <th className="px-6 pb-4 pt-6" colSpan={2}>
                                Role
                            </th>
                        </tr>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-100 focus-within:bg-gray-100">
                                <td className="border-t">
                                    <Link className="flex items-center px-6 py-4 focus:text-indigo-500" href={`/users/${user.id}/edit`}>
                                        {user.photo && <img className="-my-2 mr-2 block h-5 w-5 rounded-full" src={user.photo} alt="" />}
                                        {user.name}
                                        {user.deleted_at && <Icon name="trash" className="ml-2 h-3 w-3 shrink-0 fill-gray-400" />}
                                    </Link>
                                </td>
                                <td className="border-t">
                                    <Link className="flex items-center px-6 py-4" href={`/users/${user.id}/edit`} tabIndex={-1}>
                                        {user.email}
                                    </Link>
                                </td>
                                <td className="border-t">
                                    <Link className="flex items-center px-6 py-4" href={`/users/${user.id}/edit`} tabIndex={-1}>
                                        {user.owner ? 'Owner' : 'User'}
                                    </Link>
                                </td>
                                <td className="w-px border-t">
                                    <Link className="flex items-center px-4" href={`/users/${user.id}/edit`} tabIndex={-1}>
                                        <Icon name="cheveron-right" className="block h-6 w-6 fill-gray-400" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td className="border-t px-6 py-4" colSpan={4}>
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

UsersIndex.layout = authenticatedLayout

export default UsersIndex
