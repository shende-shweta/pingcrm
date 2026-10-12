const STATUS_TONE_MAP: Record<string, string> = {
    Normal: 'bg-green-100 text-green-800',
    Warning: 'bg-yellow-100 text-yellow-800',
    Critical: 'bg-red-100 text-red-800',
    Available: 'bg-green-100 text-green-800',
    'On Call': 'bg-indigo-100 text-indigo-800',
    'Wrap-up': 'bg-gray-100 text-gray-800',
    Resolved: 'bg-green-100 text-green-800',
    Sale: 'bg-indigo-100 text-indigo-800',
    Escalated: 'bg-orange-100 text-orange-800',
    Abandoned: 'bg-red-100 text-red-800',
    Callback: 'bg-blue-100 text-blue-800',
}

export function statusTone(value: string): string {
    return STATUS_TONE_MAP[value] ?? 'bg-gray-100 text-gray-700'
}
