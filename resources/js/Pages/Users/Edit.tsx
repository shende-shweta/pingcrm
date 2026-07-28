import { Head, Link, router, useForm } from '@inertiajs/react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'
import FileInput from '@/Shared/FileInput'
import LoadingButton from '@/Shared/LoadingButton'
import SelectInput from '@/Shared/SelectInput'
import TextInput from '@/Shared/TextInput'
import TrashedMessage from '@/Shared/TrashedMessage'

interface User {
    id: number
    first_name: string
    last_name: string
    email: string
    owner: boolean
    photo: string | null
    deleted_at: string | null
}

function UsersEdit({ user }: { user: User }) {
    const form = useForm({
        _method: 'put',
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: '',
        owner: user.owner ? 'true' : 'false',
        photo: null as File | null,
    })

    return (
        <div>
            <Head title={`${form.data.first_name} ${form.data.last_name}`} />
            <div className="mb-8 flex max-w-3xl justify-start">
                <h1 className="text-3xl font-bold">
                    <Link className="text-indigo-400 hover:text-indigo-600" href="/users">
                        Users
                    </Link>
                    <span className="font-medium text-indigo-400">/</span> {form.data.first_name} {form.data.last_name}
                </h1>
                {user.photo && <img className="ml-4 block h-8 w-8 rounded-full" src={user.photo} alt="" />}
            </div>
            {user.deleted_at && (
                <div className="mb-6">
                    <TrashedMessage
                        onRestore={() => {
                            if (confirm('Are you sure you want to restore this user?')) {
                                router.put(`/users/${user.id}/restore`)
                            }
                        }}
                    >
                        This user has been deleted.
                    </TrashedMessage>
                </div>
            )}
            <div className="max-w-3xl overflow-hidden rounded-md bg-white shadow">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.post(`/users/${user.id}`, {
                            onSuccess: () => form.reset('password', 'photo'),
                        })
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
                    <div className="flex items-center border-t border-gray-100 bg-gray-50 px-8 py-4">
                        {!user.deleted_at && (
                            <button
                                className="text-red-600 hover:underline"
                                tabIndex={-1}
                                type="button"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this user?')) {
                                        router.delete(`/users/${user.id}`)
                                    }
                                }}
                            >
                                Delete User
                            </button>
                        )}
                        <LoadingButton loading={form.processing} className="btn-indigo ml-auto" type="submit">
                            Update User
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

UsersEdit.layout = authenticatedLayout

export default UsersEdit
