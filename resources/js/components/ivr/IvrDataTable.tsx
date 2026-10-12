import StatusBadge from '@/components/ivr/StatusBadge'
import type { Column, Row } from '@/types/ivr'

interface IvrDataTableProps {
    columns: Column[]
    rows: Row[]
    viewType: string
}

function IvrDataTable({ columns, rows, viewType }: IvrDataTableProps) {
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
                                const text = val === undefined || val === null ? '\u2014' : String(val)
                                const isBadgeCol = col.key === 'status' || col.key === 'disposition'

                                return (
                                    <td key={col.key} className="px-4 py-3">
                                        {isBadgeCol ? <StatusBadge value={text} /> : text}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
                                No records found. Run{' '}
                                <code className="text-xs">php artisan db:seed --class=Database\\Seeders\\IvrModuleSampleSeeder</code>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default IvrDataTable
