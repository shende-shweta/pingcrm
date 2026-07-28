import { Head, Link, router, useForm } from '@inertiajs/react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'
import Icon from '@/Shared/Icon'
import LoadingButton from '@/Shared/LoadingButton'
import SelectInput from '@/Shared/SelectInput'
import TextInput from '@/Shared/TextInput'
import TrashedMessage from '@/Shared/TrashedMessage'

interface ContactSummary {
    id: number
    name: string
    city: string | null
    phone: string | null
    deleted_at: string | null
}

interface Organization {
    id: number
    name: string
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    region: string | null
    country: string | null
    postal_code: string | null
    deleted_at: string | null
    contacts: ContactSummary[]
}

function OrganizationsEdit({ organization }: { organization: Organization }) {
    const form = useForm({
        name: organization.name,
        email: organization.email ?? '',
        phone: organization.phone ?? '',
        address: organization.address ?? '',
        city: organization.city ?? '',
        region: organization.region ?? '',
        country: organization.country ?? '',
        postal_code: organization.postal_code ?? '',
    })

    return (
        <div>
            <Head title={form.data.name} />
            <h1 className="mb-8 text-3xl font-bold">
                <Link className="text-indigo-400 hover:text-indigo-600" href="/organizations">
                    Organizations
                </Link>
                <span className="font-medium text-indigo-400">/</span> {form.data.name}
            </h1>
            {organization.deleted_at && (
                <div className="mb-6">
                    <TrashedMessage
                        onRestore={() => {
                            if (confirm('Are you sure you want to restore this organization?')) {
                                router.put(`/organizations/${organization.id}/restore`)
                            }
                        }}
                    >
                        This organization has been deleted.
                    </TrashedMessage>
                </div>
            )}
            <div className="max-w-3xl overflow-hidden rounded-md bg-white shadow">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.put(`/organizations/${organization.id}`)
                    }}
                >
                    <div className="-mb-8 -mr-6 flex flex-wrap p-8">
                        <TextInput className="w-full pb-8 pr-6 lg:w-1/2" label="Name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} error={form.errors.name} />
                        <TextInput className="w-full pb-8 pr-6 lg:w-1/2" label="Email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} error={form.errors.email} />
                        <TextInput className="w-full pb-8 pr-6 lg:w-1/2" label="Phone" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} error={form.errors.phone} />
                        <TextInput className="w-full pb-8 pr-6 lg:w-1/2" label="Address" value={form.data.address} onChange={(e) => form.setData('address', e.target.value)} error={form.errors.address} />
                        <TextInput className="w-full pb-8 pr-6 lg:w-1/2" label="City" value={form.data.city} onChange={(e) => form.setData('city', e.target.value)} error={form.errors.city} />
                        <TextInput className="w-full pb-8 pr-6 lg:w-1/2" label="Province/State" value={form.data.region} onChange={(e) => form.setData('region', e.target.value)} error={form.errors.region} />
                        <SelectInput className="w-full pb-8 pr-6 lg:w-1/2" label="Country" value={form.data.country} onChange={(e) => form.setData('country', e.target.value)} error={form.errors.country}>
                            <option value="" />
                            <option value="CA">Canada</option>
                            <option value="US">United States</option>
                        </SelectInput>
                        <TextInput className="w-full pb-8 pr-6 lg:w-1/2" label="Postal code" value={form.data.postal_code} onChange={(e) => form.setData('postal_code', e.target.value)} error={form.errors.postal_code} />
                    </div>
                    <div className="flex items-center border-t border-gray-100 bg-gray-50 px-8 py-4">
                        {!organization.deleted_at && (
                            <button
                                className="text-red-600 hover:underline"
                                tabIndex={-1}
                                type="button"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this organization?')) {
                                        router.delete(`/organizations/${organization.id}`)
                                    }
                                }}
                            >
                                Delete Organization
                            </button>
                        )}
                        <LoadingButton loading={form.processing} className="btn-indigo ml-auto" type="submit">
                            Update Organization
                        </LoadingButton>
                    </div>
                </form>
            </div>
            <h2 className="mt-12 text-2xl font-bold">Contacts</h2>
            <div className="mt-6 overflow-x-auto rounded bg-white shadow">
                <table className="w-full whitespace-nowrap">
                    <tbody>
                        <tr className="text-left font-bold">
                            <th className="px-6 pb-4 pt-6">Name</th>
                            <th className="px-6 pb-4 pt-6">City</th>
                            <th className="px-6 pb-4 pt-6" colSpan={2}>
                                Phone
                            </th>
                        </tr>
                        {organization.contacts.map((contact) => (
                            <tr key={contact.id} className="hover:bg-gray-100 focus-within:bg-gray-100">
                                <td className="border-t">
                                    <Link className="flex items-center px-6 py-4 focus:text-indigo-500" href={`/contacts/${contact.id}/edit`}>
                                        {contact.name}
                                        {contact.deleted_at && <Icon name="trash" className="ml-2 h-3 w-3 shrink-0 fill-gray-400" />}
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
                        {organization.contacts.length === 0 && (
                            <tr>
                                <td className="border-t px-6 py-4" colSpan={4}>
                                    No contacts found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

OrganizationsEdit.layout = authenticatedLayout

export default OrganizationsEdit
