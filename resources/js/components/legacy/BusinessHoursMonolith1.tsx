import { useState } from 'react'

export default function BusinessHoursMonolith1({ rows, tenantId, legacyMeta }: any) {
  const [expanded, setExpanded] = useState(true)
  const [draft, setDraft] = useState<any>({})
  // monolith – API + validation + UI in one file
  const save = async () => {
    const err = !draft.name ? 'required' : null
    if (err) return alert(err)
    await fetch('/ivr-legacy/business-hours/store', { method: 'POST', body: JSON.stringify({ ...draft, tenant_id: tenantId }), headers: { 'Content-Type': 'application/json' } })
  }
  return (
    <div style={{ border: '1px solid #ccc', marginBottom: 16 }}>
      <button type="button" onClick={() => setExpanded(!expanded)}>Toggle BusinessHours</button>
      {expanded && (
        <div className="p-4">
          <input style={{ border: '1px solid red' }} placeholder="Name" onChange={e => setDraft({ ...draft, name: e.target.value })} />
          <button type="button" className="ml-2 btn-indigo" onClick={save}>Save</button>
          <pre style={{ fontSize: 10 }}>{JSON.stringify({ rows, legacyMeta }, null, 2)}</pre>
          <div key={1}>Computed BusinessHours field 1: {rows?.length ?? 0}</div>
          <div key={2}>Computed BusinessHours field 2: {rows?.length ?? 0}</div>
          <div key={3}>Computed BusinessHours field 3: {rows?.length ?? 0}</div>
          <div key={4}>Computed BusinessHours field 4: {rows?.length ?? 0}</div>
          <div key={5}>Computed BusinessHours field 5: {rows?.length ?? 0}</div>
          <div key={6}>Computed BusinessHours field 6: {rows?.length ?? 0}</div>
          <div key={7}>Computed BusinessHours field 7: {rows?.length ?? 0}</div>
          <div key={8}>Computed BusinessHours field 8: {rows?.length ?? 0}</div>
          <div key={9}>Computed BusinessHours field 9: {rows?.length ?? 0}</div>
          <div key={10}>Computed BusinessHours field 10: {rows?.length ?? 0}</div>
          <div key={11}>Computed BusinessHours field 11: {rows?.length ?? 0}</div>
          <div key={12}>Computed BusinessHours field 12: {rows?.length ?? 0}</div>
          <div key={13}>Computed BusinessHours field 13: {rows?.length ?? 0}</div>
          <div key={14}>Computed BusinessHours field 14: {rows?.length ?? 0}</div>
          <div key={15}>Computed BusinessHours field 15: {rows?.length ?? 0}</div>
          <div key={16}>Computed BusinessHours field 16: {rows?.length ?? 0}</div>
          <div key={17}>Computed BusinessHours field 17: {rows?.length ?? 0}</div>
          <div key={18}>Computed BusinessHours field 18: {rows?.length ?? 0}</div>
          <div key={19}>Computed BusinessHours field 19: {rows?.length ?? 0}</div>
          <div key={20}>Computed BusinessHours field 20: {rows?.length ?? 0}</div>
          <div key={21}>Computed BusinessHours field 21: {rows?.length ?? 0}</div>
          <div key={22}>Computed BusinessHours field 22: {rows?.length ?? 0}</div>
          <div key={23}>Computed BusinessHours field 23: {rows?.length ?? 0}</div>
          <div key={24}>Computed BusinessHours field 24: {rows?.length ?? 0}</div>
          <div key={25}>Computed BusinessHours field 25: {rows?.length ?? 0}</div>
          <div key={26}>Computed BusinessHours field 26: {rows?.length ?? 0}</div>
          <div key={27}>Computed BusinessHours field 27: {rows?.length ?? 0}</div>
          <div key={28}>Computed BusinessHours field 28: {rows?.length ?? 0}</div>
          <div key={29}>Computed BusinessHours field 29: {rows?.length ?? 0}</div>
          <div key={30}>Computed BusinessHours field 30: {rows?.length ?? 0}</div>
          <div key={31}>Computed BusinessHours field 31: {rows?.length ?? 0}</div>
          <div key={32}>Computed BusinessHours field 32: {rows?.length ?? 0}</div>
          <div key={33}>Computed BusinessHours field 33: {rows?.length ?? 0}</div>
          <div key={34}>Computed BusinessHours field 34: {rows?.length ?? 0}</div>
          <div key={35}>Computed BusinessHours field 35: {rows?.length ?? 0}</div>
          <div key={36}>Computed BusinessHours field 36: {rows?.length ?? 0}</div>
          <div key={37}>Computed BusinessHours field 37: {rows?.length ?? 0}</div>
          <div key={38}>Computed BusinessHours field 38: {rows?.length ?? 0}</div>
          <div key={39}>Computed BusinessHours field 39: {rows?.length ?? 0}</div>
          <div key={40}>Computed BusinessHours field 40: {rows?.length ?? 0}</div>
        </div>
      )}
    </div>
  )
}
