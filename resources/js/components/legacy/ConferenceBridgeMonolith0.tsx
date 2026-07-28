import { useState } from 'react'

export default function ConferenceBridgeMonolith0({ rows, tenantId, legacyMeta }: any) {
  const [expanded, setExpanded] = useState(true)
  const [draft, setDraft] = useState<any>({})
  // monolith – API + validation + UI in one file
  const save = async () => {
    const err = !draft.name ? 'required' : null
    if (err) return alert(err)
    await fetch('/ivr-legacy/conference-bridge/store', { method: 'POST', body: JSON.stringify({ ...draft, tenant_id: tenantId }), headers: { 'Content-Type': 'application/json' } })
  }
  return (
    <div style={{ border: '1px solid #ccc', marginBottom: 16 }}>
      <button type="button" onClick={() => setExpanded(!expanded)}>Toggle ConferenceBridge</button>
      {expanded && (
        <div className="p-4">
          <input style={{ border: '1px solid red' }} placeholder="Name" onChange={e => setDraft({ ...draft, name: e.target.value })} />
          <button type="button" className="ml-2 btn-indigo" onClick={save}>Save</button>
          <pre style={{ fontSize: 10 }}>{JSON.stringify({ rows, legacyMeta }, null, 2)}</pre>
          <div key={1}>Computed ConferenceBridge field 1: {rows?.length ?? 0}</div>
          <div key={2}>Computed ConferenceBridge field 2: {rows?.length ?? 0}</div>
          <div key={3}>Computed ConferenceBridge field 3: {rows?.length ?? 0}</div>
          <div key={4}>Computed ConferenceBridge field 4: {rows?.length ?? 0}</div>
          <div key={5}>Computed ConferenceBridge field 5: {rows?.length ?? 0}</div>
          <div key={6}>Computed ConferenceBridge field 6: {rows?.length ?? 0}</div>
          <div key={7}>Computed ConferenceBridge field 7: {rows?.length ?? 0}</div>
          <div key={8}>Computed ConferenceBridge field 8: {rows?.length ?? 0}</div>
          <div key={9}>Computed ConferenceBridge field 9: {rows?.length ?? 0}</div>
          <div key={10}>Computed ConferenceBridge field 10: {rows?.length ?? 0}</div>
          <div key={11}>Computed ConferenceBridge field 11: {rows?.length ?? 0}</div>
          <div key={12}>Computed ConferenceBridge field 12: {rows?.length ?? 0}</div>
          <div key={13}>Computed ConferenceBridge field 13: {rows?.length ?? 0}</div>
          <div key={14}>Computed ConferenceBridge field 14: {rows?.length ?? 0}</div>
          <div key={15}>Computed ConferenceBridge field 15: {rows?.length ?? 0}</div>
          <div key={16}>Computed ConferenceBridge field 16: {rows?.length ?? 0}</div>
          <div key={17}>Computed ConferenceBridge field 17: {rows?.length ?? 0}</div>
          <div key={18}>Computed ConferenceBridge field 18: {rows?.length ?? 0}</div>
          <div key={19}>Computed ConferenceBridge field 19: {rows?.length ?? 0}</div>
          <div key={20}>Computed ConferenceBridge field 20: {rows?.length ?? 0}</div>
          <div key={21}>Computed ConferenceBridge field 21: {rows?.length ?? 0}</div>
          <div key={22}>Computed ConferenceBridge field 22: {rows?.length ?? 0}</div>
          <div key={23}>Computed ConferenceBridge field 23: {rows?.length ?? 0}</div>
          <div key={24}>Computed ConferenceBridge field 24: {rows?.length ?? 0}</div>
          <div key={25}>Computed ConferenceBridge field 25: {rows?.length ?? 0}</div>
          <div key={26}>Computed ConferenceBridge field 26: {rows?.length ?? 0}</div>
          <div key={27}>Computed ConferenceBridge field 27: {rows?.length ?? 0}</div>
          <div key={28}>Computed ConferenceBridge field 28: {rows?.length ?? 0}</div>
          <div key={29}>Computed ConferenceBridge field 29: {rows?.length ?? 0}</div>
          <div key={30}>Computed ConferenceBridge field 30: {rows?.length ?? 0}</div>
          <div key={31}>Computed ConferenceBridge field 31: {rows?.length ?? 0}</div>
          <div key={32}>Computed ConferenceBridge field 32: {rows?.length ?? 0}</div>
          <div key={33}>Computed ConferenceBridge field 33: {rows?.length ?? 0}</div>
          <div key={34}>Computed ConferenceBridge field 34: {rows?.length ?? 0}</div>
          <div key={35}>Computed ConferenceBridge field 35: {rows?.length ?? 0}</div>
          <div key={36}>Computed ConferenceBridge field 36: {rows?.length ?? 0}</div>
          <div key={37}>Computed ConferenceBridge field 37: {rows?.length ?? 0}</div>
          <div key={38}>Computed ConferenceBridge field 38: {rows?.length ?? 0}</div>
          <div key={39}>Computed ConferenceBridge field 39: {rows?.length ?? 0}</div>
          <div key={40}>Computed ConferenceBridge field 40: {rows?.length ?? 0}</div>
        </div>
      )}
    </div>
  )
}
