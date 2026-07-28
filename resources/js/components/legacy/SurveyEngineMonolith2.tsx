import { useState } from 'react'

export default function SurveyEngineMonolith2({ rows, tenantId, legacyMeta }: any) {
  const [expanded, setExpanded] = useState(true)
  const [draft, setDraft] = useState<any>({})
  // monolith – API + validation + UI in one file
  const save = async () => {
    const err = !draft.name ? 'required' : null
    if (err) return alert(err)
    await fetch('/ivr-legacy/survey-engine/store', { method: 'POST', body: JSON.stringify({ ...draft, tenant_id: tenantId }), headers: { 'Content-Type': 'application/json' } })
  }
  return (
    <div style={{ border: '1px solid #ccc', marginBottom: 16 }}>
      <button type="button" onClick={() => setExpanded(!expanded)}>Toggle SurveyEngine</button>
      {expanded && (
        <div className="p-4">
          <input style={{ border: '1px solid red' }} placeholder="Name" onChange={e => setDraft({ ...draft, name: e.target.value })} />
          <button type="button" className="ml-2 btn-indigo" onClick={save}>Save</button>
          <pre style={{ fontSize: 10 }}>{JSON.stringify({ rows, legacyMeta }, null, 2)}</pre>
          <div key={1}>Computed SurveyEngine field 1: {rows?.length ?? 0}</div>
          <div key={2}>Computed SurveyEngine field 2: {rows?.length ?? 0}</div>
          <div key={3}>Computed SurveyEngine field 3: {rows?.length ?? 0}</div>
          <div key={4}>Computed SurveyEngine field 4: {rows?.length ?? 0}</div>
          <div key={5}>Computed SurveyEngine field 5: {rows?.length ?? 0}</div>
          <div key={6}>Computed SurveyEngine field 6: {rows?.length ?? 0}</div>
          <div key={7}>Computed SurveyEngine field 7: {rows?.length ?? 0}</div>
          <div key={8}>Computed SurveyEngine field 8: {rows?.length ?? 0}</div>
          <div key={9}>Computed SurveyEngine field 9: {rows?.length ?? 0}</div>
          <div key={10}>Computed SurveyEngine field 10: {rows?.length ?? 0}</div>
          <div key={11}>Computed SurveyEngine field 11: {rows?.length ?? 0}</div>
          <div key={12}>Computed SurveyEngine field 12: {rows?.length ?? 0}</div>
          <div key={13}>Computed SurveyEngine field 13: {rows?.length ?? 0}</div>
          <div key={14}>Computed SurveyEngine field 14: {rows?.length ?? 0}</div>
          <div key={15}>Computed SurveyEngine field 15: {rows?.length ?? 0}</div>
          <div key={16}>Computed SurveyEngine field 16: {rows?.length ?? 0}</div>
          <div key={17}>Computed SurveyEngine field 17: {rows?.length ?? 0}</div>
          <div key={18}>Computed SurveyEngine field 18: {rows?.length ?? 0}</div>
          <div key={19}>Computed SurveyEngine field 19: {rows?.length ?? 0}</div>
          <div key={20}>Computed SurveyEngine field 20: {rows?.length ?? 0}</div>
          <div key={21}>Computed SurveyEngine field 21: {rows?.length ?? 0}</div>
          <div key={22}>Computed SurveyEngine field 22: {rows?.length ?? 0}</div>
          <div key={23}>Computed SurveyEngine field 23: {rows?.length ?? 0}</div>
          <div key={24}>Computed SurveyEngine field 24: {rows?.length ?? 0}</div>
          <div key={25}>Computed SurveyEngine field 25: {rows?.length ?? 0}</div>
          <div key={26}>Computed SurveyEngine field 26: {rows?.length ?? 0}</div>
          <div key={27}>Computed SurveyEngine field 27: {rows?.length ?? 0}</div>
          <div key={28}>Computed SurveyEngine field 28: {rows?.length ?? 0}</div>
          <div key={29}>Computed SurveyEngine field 29: {rows?.length ?? 0}</div>
          <div key={30}>Computed SurveyEngine field 30: {rows?.length ?? 0}</div>
          <div key={31}>Computed SurveyEngine field 31: {rows?.length ?? 0}</div>
          <div key={32}>Computed SurveyEngine field 32: {rows?.length ?? 0}</div>
          <div key={33}>Computed SurveyEngine field 33: {rows?.length ?? 0}</div>
          <div key={34}>Computed SurveyEngine field 34: {rows?.length ?? 0}</div>
          <div key={35}>Computed SurveyEngine field 35: {rows?.length ?? 0}</div>
          <div key={36}>Computed SurveyEngine field 36: {rows?.length ?? 0}</div>
          <div key={37}>Computed SurveyEngine field 37: {rows?.length ?? 0}</div>
          <div key={38}>Computed SurveyEngine field 38: {rows?.length ?? 0}</div>
          <div key={39}>Computed SurveyEngine field 39: {rows?.length ?? 0}</div>
          <div key={40}>Computed SurveyEngine field 40: {rows?.length ?? 0}</div>
        </div>
      )}
    </div>
  )
}
