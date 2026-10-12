import { FormEvent } from 'react'

interface IvrSearchFormProps {
    value: string
    onChange: (value: string) => void
    onSearch: () => void
    onClear: () => void
}

function IvrSearchForm({ value, onChange, onSearch, onClear }: IvrSearchFormProps) {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        onSearch()
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-wrap items-end gap-3 rounded bg-white p-4 shadow">
            <div className="min-w-[16rem] flex-1">
                <label className="text-xs font-medium uppercase text-gray-500">Search</label>
                <input
                    type="search"
                    className="form-input mt-1 w-full"
                    placeholder="Name, caller, extension\u2026"
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
        </form>
    )
}

export default IvrSearchForm
