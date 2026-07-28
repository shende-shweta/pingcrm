import { Head, Link, useForm } from '@inertiajs/react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'
import LoadingButton from '@/Shared/LoadingButton'
import SelectInput from '@/Shared/SelectInput'
import TextInput from '@/Shared/TextInput'

interface Organization {
    id: number
    name: string
}

function ContactsCreate({ organizations }: { organizations: Organization[] }) {
    const form = useForm({
        first_name: '',
        last_name: '',
        organization_id: '' as string | number,
        email: '',
        phone: '',
        address: '',
        city: '',
        region: '',
        country: '',
        postal_code: '',
    })

    return (
        <div>
            <Head title="Create Contact" />
            <h1 className="mb-8 text-3xl font-bold">
                <Link className="text-indigo-400 hover:text-indigo-600" href="/contacts">
                    Contacts
                </Link>
                <span className="font-medium text-indigo-400">/</span> Create
            </h1>
            <div className="max-w-3xl overflow-hidden rounded-md bg-white shadow">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.post('/contacts')
                    }}
                >
                    <div className="-mb-8 -mr-6 flex flex-wrap p-8">
                        <TextInput
                            className="w-full pb-8 pr-6 lg:w-1/2"
                            label="First name"
                            value={form.data.first_name}
                            onChange={(e) => form.setData('first_name', e.target.value)}
                            error={form.errors.first_name}
                        />
                        <TextInput
                            className="w-full pb-8 pr-6 lg:w-1/2"
                            label="Last name"
                            value={form.data.last_name}
                            onChange={(e) => form.setData('last_name', e.target.value)}
                            error={form.errors.last_name}
                        />
                        <SelectInput
                            className="w-full pb-8 pr-6 lg:w-1/2"
                            label="Organization"
                            value={form.data.organization_id}
                            onChange={(e) => form.setData('organization_id', e.target.value)}
                            error={form.errors.organization_id}
                        >
                            <option value="" />
                            {organizations.map((organization) => (
                                <option key={organization.id} value={organization.id}>
                                    {organization.name}
                                </option>
                            ))}
                        </SelectInput>
                        <TextInput
                            className="w-full pb-8 pr-6 lg:w-1/2"
                            label="Email"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                            error={form.errors.email}
                        />
                        <TextInput
                            className="w-full pb-8 pr-6 lg:w-1/2"
                            label="Phone"
                            value={form.data.phone}
                            onChange={(e) => form.setData('phone', e.target.value)}
                            error={form.errors.phone}
                        />
                        <TextInput
                            className="w-full pb-8 pr-6 lg:w-1/2"
                            label="Address"
                            value={form.data.address}
                            onChange={(e) => form.setData('address', e.target.value)}
                            error={form.errors.address}
                        />
                        <TextInput
                            className="w-full pb-8 pr-6 lg:w-1/2"
                            label="City"
                            value={form.data.city}
                            onChange={(e) => form.setData('city', e.target.value)}
                            error={form.errors.city}
                        />
                        <TextInput
                            className="w-full pb-8 pr-6 lg:w-1/2"
                            label="Province/State"
                            value={form.data.region}
                            onChange={(e) => form.setData('region', e.target.value)}
                            error={form.errors.region}
                        />
                        <SelectInput
                            className="w-full pb-8 pr-6 lg:w-1/2"
                            label="Country"
                            value={form.data.country}
                            onChange={(e) => form.setData('country', e.target.value)}
                            error={form.errors.country}
                        >
                            <option value="" />
                            <option value="CA">Canada</option>
                            <option value="US">United States</option>
                        </SelectInput>
                        <TextInput
                            className="w-full pb-8 pr-6 lg:w-1/2"
                            label="Postal code"
                            value={form.data.postal_code}
                            onChange={(e) => form.setData('postal_code', e.target.value)}
                            error={form.errors.postal_code}
                        />
                    </div>
                    <div className="flex items-center justify-end border-t border-gray-100 bg-gray-50 px-8 py-4">
                        <LoadingButton loading={form.processing} className="btn-indigo" type="submit">
                            Create Contact
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

ContactsCreate.layout = authenticatedLayout

export default ContactsCreate
