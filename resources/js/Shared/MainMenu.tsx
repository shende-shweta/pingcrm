import { Link, usePage } from '@inertiajs/react'
import Icon from '@/Shared/Icon'
import { SharedPageProps } from '@/types'

export default function MainMenu({ className }: { className?: string }) {
    const { url } = usePage<SharedPageProps>()

    const path = (url.startsWith('/') ? url.slice(1) : url).split('?')[0]

    const isIvrHub = path === 'ivr'
    const isIvrModules = path === 'ivr/modules' || path.startsWith('ivr/modules/')

    const isUrl = (...prefixes: string[]) => prefixes.some((p) => (p === '' ? path === '' : path.startsWith(p)))

    return (
        <div className={className}>
            <div className="mb-4">
                <Link className="group flex items-center py-3" href="/ivr">
                    <Icon
                        name="office"
                        className={`mr-2 h-4 w-4 ${isIvrHub ? 'fill-white' : 'fill-indigo-400 group-hover:fill-white'}`}
                    />
                    <div className={isIvrHub ? 'text-white' : 'text-indigo-300 group-hover:text-white'}>IVR Platform</div>
                </Link>
            </div>
            <div className="mb-4">
                <Link className="group flex items-center py-3" href="/ivr/modules">
                    <Icon
                        name="dashboard"
                        className={`mr-2 h-4 w-4 ${isIvrModules ? 'fill-white' : 'fill-indigo-400 group-hover:fill-white'}`}
                    />
                    <div className={isIvrModules ? 'text-white' : 'text-indigo-300 group-hover:text-white'}>Modules</div>
                </Link>
            </div>
            <div className="mb-4">
                <Link className="group flex items-center py-3" href="/organizations">
                    <Icon
                        name="office"
                        className={`mr-2 h-4 w-4 ${isUrl('organizations') ? 'fill-white' : 'fill-indigo-400 group-hover:fill-white'}`}
                    />
                    <div className={isUrl('organizations') ? 'text-white' : 'text-indigo-300 group-hover:text-white'}>Organizations</div>
                </Link>
            </div>
            <div className="mb-4">
                <Link className="group flex items-center py-3" href="/contacts">
                    <Icon
                        name="users"
                        className={`mr-2 h-4 w-4 ${isUrl('contacts') ? 'fill-white' : 'fill-indigo-400 group-hover:fill-white'}`}
                    />
                    <div className={isUrl('contacts') ? 'text-white' : 'text-indigo-300 group-hover:text-white'}>Contacts</div>
                </Link>
            </div>
            <div className="mb-4">
                <Link className="group flex items-center py-3" href="/reports">
                    <Icon
                        name="printer"
                        className={`mr-2 h-4 w-4 ${isUrl('reports') ? 'fill-white' : 'fill-indigo-400 group-hover:fill-white'}`}
                    />
                    <div className={isUrl('reports') ? 'text-white' : 'text-indigo-300 group-hover:text-white'}>Reports</div>
                </Link>
            </div>
        </div>
    )
}
