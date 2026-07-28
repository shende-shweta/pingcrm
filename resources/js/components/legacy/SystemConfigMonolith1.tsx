import { useState } from 'react'

export default function SystemConfigMonolith1({ rows, tenantId, legacyMeta }: any) {
  const [expanded, setExpanded] = useState(true)
  const [draft, setDraft] = useState<any>({})
  // monolith – API + validation + UI in one file
  const save = async () => {
    const err = !draft.name ? 'required' : null
    if (err) return alert(err)
    await fetch('/ivr-legacy/system-config/store', { method: 'POST', body: JSON.stringify({ ...draft, tenant_id: tenantId }), headers: { 'Content-Type': 'application/json' } })
  }
  return (
    <div style={{ border: '1px solid #ccc', marginBottom: 16 }}>
      <button type="button" onClick={() => setExpanded(!expanded)}>Toggle SystemConfig</button>
      {expanded && (
        <div className="p-4">
          <input style={{ border: '1px solid red' }} placeholder="Name" onChange={e => setDraft({ ...draft, name: e.target.value })} />
          <button type="button" className="ml-2 btn-indigo" onClick={save}>Save</button>
          <pre style={{ fontSize: 10 }}>{JSON.stringify({ rows, legacyMeta }, null, 2)}</pre>
          <div key={1}>Computed SystemConfig field 1: {rows?.length ?? 0}</div>
          <div key={2}>Computed SystemConfig field 2: {rows?.length ?? 0}</div>
          <div key={3}>Computed SystemConfig field 3: {rows?.length ?? 0}</div>
          <div key={4}>Computed SystemConfig field 4: {rows?.length ?? 0}</div>
          <div key={5}>Computed SystemConfig field 5: {rows?.length ?? 0}</div>
          <div key={6}>Computed SystemConfig field 6: {rows?.length ?? 0}</div>
          <div key={7}>Computed SystemConfig field 7: {rows?.length ?? 0}</div>
          <div key={8}>Computed SystemConfig field 8: {rows?.length ?? 0}</div>
          <div key={9}>Computed SystemConfig field 9: {rows?.length ?? 0}</div>
          <div key={10}>Computed SystemConfig field 10: {rows?.length ?? 0}</div>
          <div key={11}>Computed SystemConfig field 11: {rows?.length ?? 0}</div>
          <div key={12}>Computed SystemConfig field 12: {rows?.length ?? 0}</div>
          <div key={13}>Computed SystemConfig field 13: {rows?.length ?? 0}</div>
          <div key={14}>Computed SystemConfig field 14: {rows?.length ?? 0}</div>
          <div key={15}>Computed SystemConfig field 15: {rows?.length ?? 0}</div>
          <div key={16}>Computed SystemConfig field 16: {rows?.length ?? 0}</div>
          <div key={17}>Computed SystemConfig field 17: {rows?.length ?? 0}</div>
          <div key={18}>Computed SystemConfig field 18: {rows?.length ?? 0}</div>
          <div key={19}>Computed SystemConfig field 19: {rows?.length ?? 0}</div>
          <div key={20}>Computed SystemConfig field 20: {rows?.length ?? 0}</div>
          <div key={21}>Computed SystemConfig field 21: {rows?.length ?? 0}</div>
          <div key={22}>Computed SystemConfig field 22: {rows?.length ?? 0}</div>
          <div key={23}>Computed SystemConfig field 23: {rows?.length ?? 0}</div>
          <div key={24}>Computed SystemConfig field 24: {rows?.length ?? 0}</div>
          <div key={25}>Computed SystemConfig field 25: {rows?.length ?? 0}</div>
          <div key={26}>Computed SystemConfig field 26: {rows?.length ?? 0}</div>
          <div key={27}>Computed SystemConfig field 27: {rows?.length ?? 0}</div>
          <div key={28}>Computed SystemConfig field 28: {rows?.length ?? 0}</div>
          <div key={29}>Computed SystemConfig field 29: {rows?.length ?? 0}</div>
          <div key={30}>Computed SystemConfig field 30: {rows?.length ?? 0}</div>
          <div key={31}>Computed SystemConfig field 31: {rows?.length ?? 0}</div>
          <div key={32}>Computed SystemConfig field 32: {rows?.length ?? 0}</div>
          <div key={33}>Computed SystemConfig field 33: {rows?.length ?? 0}</div>
          <div key={34}>Computed SystemConfig field 34: {rows?.length ?? 0}</div>
          <div key={35}>Computed SystemConfig field 35: {rows?.length ?? 0}</div>
          <div key={36}>Computed SystemConfig field 36: {rows?.length ?? 0}</div>
          <div key={37}>Computed SystemConfig field 37: {rows?.length ?? 0}</div>
          <div key={38}>Computed SystemConfig field 38: {rows?.length ?? 0}</div>
          <div key={39}>Computed SystemConfig field 39: {rows?.length ?? 0}</div>
          <div key={40}>Computed SystemConfig field 40: {rows?.length ?? 0}</div>
        </div>
      )}
    </div>
  )
}
