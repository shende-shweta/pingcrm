type BarSeries = { label: string; value: number; color: string }

export function SimpleBarChart({
    title,
    series,
    maxValue,
}: {
    title: string
    series: BarSeries[]
    maxValue?: number
}) {
    const max = maxValue ?? Math.max(...series.map((s) => s.value), 1)

    return (
        <div className="rounded bg-white p-4 shadow">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
            <div className="flex h-48 items-end gap-2 border-b border-l border-gray-200 pl-2">
                {series.map((item) => (
                    <div key={item.label} className="flex flex-1 flex-col items-center justify-end gap-1">
                        <span className="text-xs font-medium text-gray-700">{item.value}</span>
                        <div
                            className="w-full max-w-[2.5rem] rounded-t transition-all"
                            style={{ height: `${(item.value / max) * 100}%`, backgroundColor: item.color, minHeight: item.value > 0 ? 4 : 0 }}
                            title={`${item.label}: ${item.value}`}
                        />
                        <span className="truncate text-[10px] text-gray-500">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function StackedAreaChart({
    title,
    points,
}: {
    title: string
    points: { label: string; answered: number; abandoned: number }[]
}) {
    const max = Math.max(...points.map((p) => p.answered + p.abandoned), 1)
    const width = 400
    const height = 120
    const step = width / Math.max(points.length - 1, 1)

    const answeredPath = points
        .map((p, i) => {
            const x = i * step
            const y = height - (p.answered / max) * height
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
        })
        .join(' ')

    const abandonedPath = points
        .map((p, i) => {
            const x = i * step
            const total = p.answered + p.abandoned
            const y = height - (total / max) * height
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
        })
        .join(' ')

    return (
        <div className="rounded bg-white p-4 shadow">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
            <div className="mb-2 flex gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" /> Answered
                </span>
                <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-400" /> Abandoned
                </span>
            </div>
            <svg viewBox={`0 0 ${width} ${height + 24}`} className="w-full" role="img" aria-label={title}>
                <path d={`${answeredPath} L ${width} ${height} L 0 ${height} Z`} fill="rgba(99,102,241,0.25)" />
                <path d={answeredPath} fill="none" stroke="#6366f1" strokeWidth="2" />
                <path d={abandonedPath} fill="none" stroke="#f87171" strokeWidth="2" strokeDasharray="4 2" />
                {points.map((p, i) => (
                    <text key={p.label} x={i * step} y={height + 16} fontSize="9" fill="#6b7280" textAnchor="middle">
                        {p.label}
                    </text>
                ))}
            </svg>
        </div>
    )
}

export function DonutChart({
    title,
    segments,
}: {
    title: string
    segments: { label: string; value: number; color: string }[]
}) {
    const total = segments.reduce((s, x) => s + x.value, 0) || 1
    let cumulative = 0
    const r = 40
    const cx = 50
    const cy = 50

    const arcs = segments.map((seg) => {
        const start = cumulative
        cumulative += seg.value / total
        const end = cumulative
        const startAngle = start * 2 * Math.PI - Math.PI / 2
        const endAngle = end * 2 * Math.PI - Math.PI / 2
        const x1 = cx + r * Math.cos(startAngle)
        const y1 = cy + r * Math.sin(startAngle)
        const x2 = cx + r * Math.cos(endAngle)
        const y2 = cy + r * Math.sin(endAngle)
        const large = end - start > 0.5 ? 1 : 0
        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
        return { ...seg, d, pct: Math.round((seg.value / total) * 100) }
    })

    return (
        <div className="rounded bg-white p-4 shadow">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
            <div className="flex flex-wrap items-center gap-6">
                <svg viewBox="0 0 100 100" className="h-36 w-36 shrink-0">
                    {arcs.map((a) => (
                        <path key={a.label} d={a.d} fill={a.color} />
                    ))}
                    <circle cx={cx} cy={cy} r={22} fill="white" />
                    <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#374151">
                        {total}
                    </text>
                </svg>
                <ul className="space-y-1 text-sm">
                    {arcs.map((a) => (
                        <li key={a.label} className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: a.color }} />
                            <span className="text-gray-700">{a.label}</span>
                            <span className="text-gray-400">({a.pct}%)</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
