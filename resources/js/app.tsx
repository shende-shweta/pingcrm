import '../css/app.css'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { ComponentType, ReactNode } from 'react'

type PageModule = ComponentType & { layout?: (page: ReactNode) => ReactNode }

createInertiaApp({
    resolve: async (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx')
        const importPage = pages[`./Pages/${name}.tsx`]
        if (!importPage) {
            throw new Error(`Inertia page not found: ${name}`)
        }
        const module = (await importPage()) as { default: PageModule }
        return module.default
    },
    title: (title) => (title ? `${title} - Ping CRM` : 'Ping CRM'),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
})
