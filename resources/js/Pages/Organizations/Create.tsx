import { Head, Link, useForm } from '@inertiajs/react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'
import LoadingButton from '@/Shared/LoadingButton'
import SelectInput from '@/Shared/SelectInput'
import TextInput from '@/Shared/TextInput'

function OrganizationsCreate() {
    const form = useForm({
        name: '',
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
            <Head title="Create Organization" />
            <h1 className="mb-8 text-3xl font-bold">
                <Link className="text-indigo-400 hover:text-indigo-600" href="/organizations">
                    Organizations
                </Link>
                <span className="font-medium text-indigo-400">/</span> Create
            </h1>
            <div className="max-w-3xl overflow-hidden rounded-md bg-white shadow">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.post('/organizations')
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
                    <div className="flex items-center justify-end border-t border-gray-100 bg-gray-50 px-8 py-4">
                        <LoadingButton loading={form.processing} className="btn-indigo" type="submit">
                            Create Organization
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

OrganizationsCreate.layout = authenticatedLayout

export default OrganizationsCreate
