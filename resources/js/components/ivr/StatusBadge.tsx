import { statusTone } from '@/utils/ivr/statusTone'

interface StatusBadgeProps {
    value: string
}

function StatusBadge({ value }: StatusBadgeProps) {
    return (
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusTone(value)}`}>{value}</span>
    )
}

export default StatusBadge
