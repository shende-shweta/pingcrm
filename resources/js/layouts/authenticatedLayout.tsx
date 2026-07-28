import Layout from '@/Shared/Layout'
import { ReactNode } from 'react'

export function authenticatedLayout(page: ReactNode) {
    return <Layout>{page}</Layout>
}
