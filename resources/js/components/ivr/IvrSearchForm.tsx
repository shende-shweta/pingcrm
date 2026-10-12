import { FormEvent, ReactNode } from 'react'

interface Props {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    onClear: () => void
    placeholder?: string
    children?: ReactNode
}

export default function IvrSearchForm({
    value,
    onChange,
    onSubmit,
    onClear,
    placeholder = 'Name, caller, extension…',
    children,
}: Props) {
    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-wrap items-end gap-3 rounded bg-white p-4 shadow">
            <div className="min-w-[16rem] flex-1">
                <label className="text-xs font-medium uppercase text-gray-500">Search</label>
                <input
                    type="search"
                    className="form-input mt-1 w-full"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
            <button type="submit" className="btn-indigo">
                Search
            </button>
            <button
                type="button"
                className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
                onClick={onClear}
            >
                Clear
            </button>
            {children}
        </form>
    )
}
