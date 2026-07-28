/// <reference types="vite/client" />

import { ComponentType, ReactNode } from 'react'

declare module '@inertiajs/core' {
    interface PageProps extends Record<string, unknown> {}
}

declare module '@inertiajs/react' {
    interface InertiaLinkProps {
        method?: string
        as?: string
    }
}

type PageComponent = ComponentType & {
    layout?: (page: ReactNode) => ReactNode
}

declare module '*.tsx' {
    const component: PageComponent
    export default component
}
