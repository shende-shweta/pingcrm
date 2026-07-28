import { Head, useForm } from '@inertiajs/react'
import LoadingButton from '@/Shared/LoadingButton'
import Logo from '@/Shared/Logo'
import TextInput from '@/Shared/TextInput'

export default function Login() {
    const form = useForm({
        email: 'johndoe@example.com',
        password: 'secret',
        remember: false as boolean,
    })

    return (
        <>
            <Head title="Login" />
            <div className="flex min-h-screen items-center justify-center bg-indigo-800 p-6">
                <div className="w-full max-w-md">
                    <Logo className="mx-auto block w-full max-w-xs fill-white" height={50} />
                    <form
                        className="mt-8 overflow-hidden rounded-lg bg-white shadow-xl"
                        onSubmit={(e) => {
                            e.preventDefault()
                            form.post('/login')
                        }}
                    >
                        <div className="px-10 py-12">
                            <h1 className="text-center text-3xl font-bold">Welcome Back!</h1>
                            <div className="mx-auto mt-6 w-24 border-b-2" />
                            <TextInput
                                className="mt-10"
                                label="Email"
                                type="email"
                                autoFocus
                                autoCapitalize="off"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                error={form.errors.email}
                            />
                            <TextInput
                                className="mt-6"
                                label="Password"
                                type="password"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                error={form.errors.password}
                            />
                            <label className="mt-6 flex select-none items-center" htmlFor="remember">
                                <input
                                    id="remember"
                                    className="mr-1"
                                    type="checkbox"
                                    checked={form.data.remember}
                                    onChange={(e) => form.setData('remember', e.target.checked)}
                                />
                                <span className="text-sm">Remember Me</span>
                            </label>
                        </div>
                        <div className="flex border-t border-gray-100 bg-gray-100 px-10 py-4">
                            <LoadingButton loading={form.processing} className="btn-indigo ml-auto" type="submit">
                                Login
                            </LoadingButton>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
