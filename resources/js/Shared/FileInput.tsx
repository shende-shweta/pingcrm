import { useRef } from 'react'

function filesize(size: number) {
    const i = Math.floor(Math.log(size) / Math.log(1024))
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`
}

export default function FileInput({
    value,
    onChange,
    label,
    accept,
    errors = [],
    className,
}: {
    value: File | null
    onChange: (file: File | null) => void
    label?: string
    accept?: string
    errors?: string[]
    className?: string
}) {
    const fileRef = useRef<HTMLInputElement>(null)

    return (
        <div className={className}>
            {label && <label className="form-label">{label}:</label>}
            <div className={`form-input p-0${errors.length ? ' error' : ''}`}>
                <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
                {!value ? (
                    <div className="p-2">
                        <button
                            type="button"
                            className="rounded-sm bg-gray-500 px-4 py-1 text-xs font-medium text-white hover:bg-gray-700"
                            onClick={() => fileRef.current?.click()}
                        >
                            Browse
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-2">
                        <div className="flex-1 pr-1">
                            {value.name} <span className="text-xs text-gray-500">({filesize(value.size)})</span>
                        </div>
                        <button
                            type="button"
                            className="rounded-sm bg-gray-500 px-4 py-1 text-xs font-medium text-white hover:bg-gray-700"
                            onClick={() => {
                                onChange(null)
                                if (fileRef.current) {
                                    fileRef.current.value = ''
                                }
                            }}
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>
            {errors.length > 0 && <div className="form-error">{errors[0]}</div>}
        </div>
    )
}
