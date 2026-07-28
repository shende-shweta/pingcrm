import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import ReactDOMServer from 'react-dom/server'
import { ComponentType, ReactNode } from 'react'

type PageModule = ComponentType & { layout?: (page: ReactNode) => ReactNode }

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
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
        setup: ({ App, props }) => <App {...props} />,
    }),
)
