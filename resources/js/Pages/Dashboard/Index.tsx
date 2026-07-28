import { Head } from '@inertiajs/react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'

function Dashboard() {
    return (
        <div>
            <Head title="Dashboard" />
            <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
            <p className="mb-8 leading-normal">
                Hey there! Welcome to Ping CRM, a demo app designed to help illustrate how{' '}
                <a className="text-indigo-500 underline hover:text-orange-600" href="https://inertiajs.com">
                    Inertia.js
                </a>{' '}
                works.
            </p>
        </div>
    )
}

Dashboard.layout = authenticatedLayout

export default Dashboard
