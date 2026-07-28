import { Link } from '@inertiajs/react'
import { PaginationLink } from '@/types'

export default function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) {
        return null
    }

    return (
        <div className="-mb-1 flex flex-wrap">
            {links.map((link, key) =>
                link.url === null ? (
                    <div
                        key={key}
                        className="mb-1 mr-1 rounded border px-4 py-3 text-sm leading-4 text-gray-400"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={`link-${key}`}
                        className={`mb-1 mr-1 rounded border px-4 py-3 text-sm leading-4 hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${link.active ? 'bg-white' : ''}`}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </div>
    )
}
