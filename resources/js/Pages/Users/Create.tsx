import { Head, Link, useForm } from '@inertiajs/react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'
import FileInput from '@/Shared/FileInput'
import LoadingButton from '@/Shared/LoadingButton'
import SelectInput from '@/Shared/SelectInput'
import TextInput from '@/Shared/TextInput'

function UsersCreate() {
    const form = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        owner: 'false',
        photo: null as File | null,
    })

    return (
        <div>
            <Head title="Create User" />
            <h1 className="mb-8 text-3xl font-bold">
                <Link className="text-indigo-400 hover:text-indigo-600" href="/users">
                    Users
                </Link>
                <span className="font-medium text-indigo-400">/</span> Create
            </h1>
            <div className="max-w-3xl overflow-hidden rounded-md bg-white shadow">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.post('/users')
                    }}
                >
                    <div className="-mb-8 -mr-6 flex flex-wrap p-8">
                        <TextInput className="w-full pb-8 pr-6 lg:w-1/2" label="First name" value={form.data.first_name} onChange={(e) => form.setData('first_name', e.target.value)} error={form.errors.first_name} />
                        <TextInput className="w-full pb-8 pr-6 lg:w-1/2" label="Last name" value={form.data.last_name} onChange={(e) => form.setData('last_name', e.target.value)} error={form.errors.last_name} />
                        <TextInput className="w-full pb-8 pr-6 lg:w-1/2" label="Email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} error={form.errors.email} />
                        <TextInput className="w-full pb-8 pr-6 lg:w-1/2" label="Password" type="password" autoComplete="new-password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} error={form.errors.password} />
                        <SelectInput className="w-full pb-8 pr-6 lg:w-1/2" label="Owner" value={form.data.owner} onChange={(e) => form.setData('owner', e.target.value)} error={form.errors.owner}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </SelectInput>
                        <FileInput
                            className="w-full pb-8 pr-6 lg:w-1/2"
                            label="Photo"
                            accept="image/*"
                            value={form.data.photo}
                            onChange={(photo) => form.setData('photo', photo)}
                            errors={form.errors.photo ? [form.errors.photo] : []}
                        />
                    </div>
                    <div className="flex items-center justify-end border-t border-gray-100 bg-gray-50 px-8 py-4">
                        <LoadingButton loading={form.processing} className="btn-indigo" type="submit">
                            Create User
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

UsersCreate.layout = authenticatedLayout

export default UsersCreate
