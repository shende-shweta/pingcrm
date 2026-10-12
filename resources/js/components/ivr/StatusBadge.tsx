import { statusTone } from '@/utils/ivr/statusTone'

export default function StatusBadge({ value }: { value: string }) {
    return (
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusTone(value) ?? 'bg-gray-100 text-gray-700'}`}>
            {value}
        </span>
    )
}
