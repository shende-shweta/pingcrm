import { ReactNode } from 'react'
import Dropdown from '@/Shared/Dropdown'

export default function SearchFilter({
    value,
    onChange,
    onReset,
    maxWidth = 300,
    children,
    className,
}: {
    value: string
    onChange: (value: string) => void
    onReset: () => void
    maxWidth?: number
    children?: ReactNode
    className?: string
}) {
    return (
        <div className={`flex items-center ${className ?? ''}`}>
            <div className="flex w-full rounded bg-white shadow">
                <Dropdown
                    autoClose={false}
                    className="rounded-l border-r px-4 hover:bg-gray-100 focus:z-10 focus:border-white focus:ring md:px-6"
                    placement="bottom-start"
                    dropdown={
                        <div className="mt-2 w-screen rounded bg-white px-4 py-6 shadow-xl" style={{ maxWidth: `${maxWidth}px` }}>
                            {children}
                        </div>
                    }
                >
                    <div className="flex items-baseline">
                        <span className="hidden text-gray-700 md:inline">Filter</span>
                        <svg className="h-2 w-2 fill-gray-700 md:ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 961.243 599.998">
                            <path d="M239.998 239.999L0 0h961.243L721.246 240c-131.999 132-240.28 240-240.624 239.999-.345-.001-108.625-108.001-240.624-240z" />
                        </svg>
                    </div>
                </Dropdown>
                <input
                    className="relative w-full rounded-r px-6 py-3 focus:shadow-outline"
                    autoComplete="off"
                    type="text"
                    name="search"
                    placeholder="Search…"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
            <button className="ml-3 text-sm text-gray-500 hover:text-gray-700 focus:text-indigo-500" type="button" onClick={onReset}>
                Reset
            </button>
        </div>
    )
}
