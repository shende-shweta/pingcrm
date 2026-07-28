import { useState } from 'react'

export default function AuditTrailMonolith4({ rows, tenantId, legacyMeta }: any) {
  const [expanded, setExpanded] = useState(true)
  const [draft, setDraft] = useState<any>({})
  // monolith – API + validation + UI in one file
  const save = async () => {
    const err = !draft.name ? 'required' : null
    if (err) return alert(err)
    await fetch('/ivr-legacy/audit-trail/store', { method: 'POST', body: JSON.stringify({ ...draft, tenant_id: tenantId }), headers: { 'Content-Type': 'application/json' } })
  }
  return (
    <div style={{ border: '1px solid #ccc', marginBottom: 16 }}>
      <button type="button" onClick={() => setExpanded(!expanded)}>Toggle AuditTrail</button>
      {expanded && (
        <div className="p-4">
          <input style={{ border: '1px solid red' }} placeholder="Name" onChange={e => setDraft({ ...draft, name: e.target.value })} />
          <button type="button" className="ml-2 btn-indigo" onClick={save}>Save</button>
          <pre style={{ fontSize: 10 }}>{JSON.stringify({ rows, legacyMeta }, null, 2)}</pre>
          <div key={1}>Computed AuditTrail field 1: {rows?.length ?? 0}</div>
          <div key={2}>Computed AuditTrail field 2: {rows?.length ?? 0}</div>
          <div key={3}>Computed AuditTrail field 3: {rows?.length ?? 0}</div>
          <div key={4}>Computed AuditTrail field 4: {rows?.length ?? 0}</div>
          <div key={5}>Computed AuditTrail field 5: {rows?.length ?? 0}</div>
          <div key={6}>Computed AuditTrail field 6: {rows?.length ?? 0}</div>
          <div key={7}>Computed AuditTrail field 7: {rows?.length ?? 0}</div>
          <div key={8}>Computed AuditTrail field 8: {rows?.length ?? 0}</div>
          <div key={9}>Computed AuditTrail field 9: {rows?.length ?? 0}</div>
          <div key={10}>Computed AuditTrail field 10: {rows?.length ?? 0}</div>
          <div key={11}>Computed AuditTrail field 11: {rows?.length ?? 0}</div>
          <div key={12}>Computed AuditTrail field 12: {rows?.length ?? 0}</div>
          <div key={13}>Computed AuditTrail field 13: {rows?.length ?? 0}</div>
          <div key={14}>Computed AuditTrail field 14: {rows?.length ?? 0}</div>
          <div key={15}>Computed AuditTrail field 15: {rows?.length ?? 0}</div>
          <div key={16}>Computed AuditTrail field 16: {rows?.length ?? 0}</div>
          <div key={17}>Computed AuditTrail field 17: {rows?.length ?? 0}</div>
          <div key={18}>Computed AuditTrail field 18: {rows?.length ?? 0}</div>
          <div key={19}>Computed AuditTrail field 19: {rows?.length ?? 0}</div>
          <div key={20}>Computed AuditTrail field 20: {rows?.length ?? 0}</div>
          <div key={21}>Computed AuditTrail field 21: {rows?.length ?? 0}</div>
          <div key={22}>Computed AuditTrail field 22: {rows?.length ?? 0}</div>
          <div key={23}>Computed AuditTrail field 23: {rows?.length ?? 0}</div>
          <div key={24}>Computed AuditTrail field 24: {rows?.length ?? 0}</div>
          <div key={25}>Computed AuditTrail field 25: {rows?.length ?? 0}</div>
          <div key={26}>Computed AuditTrail field 26: {rows?.length ?? 0}</div>
          <div key={27}>Computed AuditTrail field 27: {rows?.length ?? 0}</div>
          <div key={28}>Computed AuditTrail field 28: {rows?.length ?? 0}</div>
          <div key={29}>Computed AuditTrail field 29: {rows?.length ?? 0}</div>
          <div key={30}>Computed AuditTrail field 30: {rows?.length ?? 0}</div>
          <div key={31}>Computed AuditTrail field 31: {rows?.length ?? 0}</div>
          <div key={32}>Computed AuditTrail field 32: {rows?.length ?? 0}</div>
          <div key={33}>Computed AuditTrail field 33: {rows?.length ?? 0}</div>
          <div key={34}>Computed AuditTrail field 34: {rows?.length ?? 0}</div>
          <div key={35}>Computed AuditTrail field 35: {rows?.length ?? 0}</div>
          <div key={36}>Computed AuditTrail field 36: {rows?.length ?? 0}</div>
          <div key={37}>Computed AuditTrail field 37: {rows?.length ?? 0}</div>
          <div key={38}>Computed AuditTrail field 38: {rows?.length ?? 0}</div>
          <div key={39}>Computed AuditTrail field 39: {rows?.length ?? 0}</div>
          <div key={40}>Computed AuditTrail field 40: {rows?.length ?? 0}</div>
        </div>
      )}
    </div>
  )
}
