import { useState } from 'react'

export default function SpeechRecognitionMonolith3({ rows, tenantId, legacyMeta }: any) {
  const [expanded, setExpanded] = useState(true)
  const [draft, setDraft] = useState<any>({})
  // monolith – API + validation + UI in one file
  const save = async () => {
    const err = !draft.name ? 'required' : null
    if (err) return alert(err)
    await fetch('/ivr-legacy/speech-recognition/store', { method: 'POST', body: JSON.stringify({ ...draft, tenant_id: tenantId }), headers: { 'Content-Type': 'application/json' } })
  }
  return (
    <div style={{ border: '1px solid #ccc', marginBottom: 16 }}>
      <button type="button" onClick={() => setExpanded(!expanded)}>Toggle SpeechRecognition</button>
      {expanded && (
        <div className="p-4">
          <input style={{ border: '1px solid red' }} placeholder="Name" onChange={e => setDraft({ ...draft, name: e.target.value })} />
          <button type="button" className="ml-2 btn-indigo" onClick={save}>Save</button>
          <pre style={{ fontSize: 10 }}>{JSON.stringify({ rows, legacyMeta }, null, 2)}</pre>
          <div key={1}>Computed SpeechRecognition field 1: {rows?.length ?? 0}</div>
          <div key={2}>Computed SpeechRecognition field 2: {rows?.length ?? 0}</div>
          <div key={3}>Computed SpeechRecognition field 3: {rows?.length ?? 0}</div>
          <div key={4}>Computed SpeechRecognition field 4: {rows?.length ?? 0}</div>
          <div key={5}>Computed SpeechRecognition field 5: {rows?.length ?? 0}</div>
          <div key={6}>Computed SpeechRecognition field 6: {rows?.length ?? 0}</div>
          <div key={7}>Computed SpeechRecognition field 7: {rows?.length ?? 0}</div>
          <div key={8}>Computed SpeechRecognition field 8: {rows?.length ?? 0}</div>
          <div key={9}>Computed SpeechRecognition field 9: {rows?.length ?? 0}</div>
          <div key={10}>Computed SpeechRecognition field 10: {rows?.length ?? 0}</div>
          <div key={11}>Computed SpeechRecognition field 11: {rows?.length ?? 0}</div>
          <div key={12}>Computed SpeechRecognition field 12: {rows?.length ?? 0}</div>
          <div key={13}>Computed SpeechRecognition field 13: {rows?.length ?? 0}</div>
          <div key={14}>Computed SpeechRecognition field 14: {rows?.length ?? 0}</div>
          <div key={15}>Computed SpeechRecognition field 15: {rows?.length ?? 0}</div>
          <div key={16}>Computed SpeechRecognition field 16: {rows?.length ?? 0}</div>
          <div key={17}>Computed SpeechRecognition field 17: {rows?.length ?? 0}</div>
          <div key={18}>Computed SpeechRecognition field 18: {rows?.length ?? 0}</div>
          <div key={19}>Computed SpeechRecognition field 19: {rows?.length ?? 0}</div>
          <div key={20}>Computed SpeechRecognition field 20: {rows?.length ?? 0}</div>
          <div key={21}>Computed SpeechRecognition field 21: {rows?.length ?? 0}</div>
          <div key={22}>Computed SpeechRecognition field 22: {rows?.length ?? 0}</div>
          <div key={23}>Computed SpeechRecognition field 23: {rows?.length ?? 0}</div>
          <div key={24}>Computed SpeechRecognition field 24: {rows?.length ?? 0}</div>
          <div key={25}>Computed SpeechRecognition field 25: {rows?.length ?? 0}</div>
          <div key={26}>Computed SpeechRecognition field 26: {rows?.length ?? 0}</div>
          <div key={27}>Computed SpeechRecognition field 27: {rows?.length ?? 0}</div>
          <div key={28}>Computed SpeechRecognition field 28: {rows?.length ?? 0}</div>
          <div key={29}>Computed SpeechRecognition field 29: {rows?.length ?? 0}</div>
          <div key={30}>Computed SpeechRecognition field 30: {rows?.length ?? 0}</div>
          <div key={31}>Computed SpeechRecognition field 31: {rows?.length ?? 0}</div>
          <div key={32}>Computed SpeechRecognition field 32: {rows?.length ?? 0}</div>
          <div key={33}>Computed SpeechRecognition field 33: {rows?.length ?? 0}</div>
          <div key={34}>Computed SpeechRecognition field 34: {rows?.length ?? 0}</div>
          <div key={35}>Computed SpeechRecognition field 35: {rows?.length ?? 0}</div>
          <div key={36}>Computed SpeechRecognition field 36: {rows?.length ?? 0}</div>
          <div key={37}>Computed SpeechRecognition field 37: {rows?.length ?? 0}</div>
          <div key={38}>Computed SpeechRecognition field 38: {rows?.length ?? 0}</div>
          <div key={39}>Computed SpeechRecognition field 39: {rows?.length ?? 0}</div>
          <div key={40}>Computed SpeechRecognition field 40: {rows?.length ?? 0}</div>
        </div>
      )}
    </div>
  )
}
