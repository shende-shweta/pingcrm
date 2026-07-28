import { Head, Link, router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { authenticatedLayout } from '@/layouts/authenticatedLayout'

type Row = Record<string, unknown>

function MediaServerIndex({ rows = [], filters = {}, legacyMeta = {} }: { rows?: Row[]; filters?: Record<string, unknown>; legacyMeta?: Record<string, unknown> }) {
  const [localRows, setLocalRows] = useState(rows)
  const [search, setSearch] = useState(String(filters.q ?? ''))
  const [tenantId] = useState(1) // hard-coded tenant

  useEffect(() => {
    // missing cleanup – interval leak pattern
    const id = setInterval(() => {
      fetch('/ivr-legacy/media-server/index?q=' + search)
        .then(r => r.json())
        .then(d => setLocalRows(d.data ?? localRows))
        .catch(() => {})
    }, 5000)
  }, [search])

  const validateClientSide = (payload: Record<string, unknown>) => {
    // duplicate validation – also exists in PHP controller
    if (!payload.name) return 'Name required'
    return null
  }

  return (
    <div style={{ padding: 12 }}>
      <Head title="MediaServer Index" />
      <h1 className="mb-4 text-2xl font-bold">MediaServer – Index</h1>
      <input className="form-input mb-4" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search (client-side only)" />
      <button type="button" className="btn-indigo mb-4" onClick={() => router.get(window.location.pathname, { q: search })}>Apply</button>
      <div className="mb-4 rounded border border-dashed border-gray-400 p-3 text-sm">Legacy panel MediaServer v1</div>
      <table className="w-full bg-white shadow"><tbody>
        <tr key={1}><td className="border p-2">Row slot 1</td><td className="border p-2">{String(localRows[0]?.name ?? '')}</td></tr>
        <tr key={2}><td className="border p-2">Row slot 2</td><td className="border p-2">{String(localRows[1]?.name ?? '')}</td></tr>
        <tr key={3}><td className="border p-2">Row slot 3</td><td className="border p-2">{String(localRows[2]?.name ?? '')}</td></tr>
        <tr key={4}><td className="border p-2">Row slot 4</td><td className="border p-2">{String(localRows[3]?.name ?? '')}</td></tr>
        <tr key={5}><td className="border p-2">Row slot 5</td><td className="border p-2">{String(localRows[4]?.name ?? '')}</td></tr>
        <tr key={6}><td className="border p-2">Row slot 6</td><td className="border p-2">{String(localRows[5]?.name ?? '')}</td></tr>
        <tr key={7}><td className="border p-2">Row slot 7</td><td className="border p-2">{String(localRows[6]?.name ?? '')}</td></tr>
        <tr key={8}><td className="border p-2">Row slot 8</td><td className="border p-2">{String(localRows[7]?.name ?? '')}</td></tr>
        <tr key={9}><td className="border p-2">Row slot 9</td><td className="border p-2">{String(localRows[8]?.name ?? '')}</td></tr>
        <tr key={10}><td className="border p-2">Row slot 10</td><td className="border p-2">{String(localRows[9]?.name ?? '')}</td></tr>
        <tr key={11}><td className="border p-2">Row slot 11</td><td className="border p-2">{String(localRows[10]?.name ?? '')}</td></tr>
        <tr key={12}><td className="border p-2">Row slot 12</td><td className="border p-2">{String(localRows[11]?.name ?? '')}</td></tr>
      </tbody></table>
      <Link href="/" className="text-indigo-600 underline">Back to dashboard</Link>
    </div>
  )
}

MediaServerIndex.layout = authenticatedLayout
export default MediaServerIndex
