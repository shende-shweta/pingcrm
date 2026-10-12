import { ReactNode } from 'react'
import StatusBadge from '@/components/ivr/StatusBadge'
import { statusTone } from '@/utils/ivr/statusTone'
import type { IvrColumn, IvrRow } from '@/types/ivr'

const DEFAULT_BADGE_KEYS: readonly string[] = ['status', 'disposition']

interface Props {
    columns: IvrColumn[]
    rows: IvrRow[]
    viewType: string
    emptyMessage: ReactNode
    badgeKeys?: readonly string[]
}

export default function IvrDataTable({ columns, rows, viewType, emptyMessage, badgeKeys = DEFAULT_BADGE_KEYS }: Props) {
    return (
        <div className="mt-6 overflow-x-auto rounded bg-white shadow">
            <div className="border-b px-4 py-3 text-sm text-gray-500">
                {rows.length} record{rows.length === 1 ? '' : 's'} · view:{' '}
                <span className="font-medium text-gray-700">{viewType}</span>
            </div>
            <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="px-4 py-3">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={row.id ?? idx} className="border-t hover:bg-gray-50">
                            {columns.map((col) => {
                                const val = row[col.key]
                                const text = val === undefined || val === null ? '—' : String(val)
                                const showBadge = badgeKeys.includes(col.key) && statusTone(text) !== null

                                return (
                                    <td key={col.key} className="px-4 py-3">
                                        {showBadge ? <StatusBadge value={text} /> : text}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
