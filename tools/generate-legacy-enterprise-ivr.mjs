#!/usr/bin/env node
/**
 * Generates large legacy React/TS IVR frontend for modernization discovery.
 * Run: node tools/generate-legacy-enterprise-ivr.mjs [targetLines]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const target = parseInt(process.argv[2] || '102000', 10)

const modules = [
  'CallFlow', 'CallRouting', 'QueueManagement', 'AgentDesk', 'PromptLibrary', 'BusinessHours',
  'DidInventory', 'CallAnalytics', 'HistoricalReports', 'LiveMonitoring', 'CallRecording',
  'CustomerProfile', 'CrmBridge', 'ApiIntegration', 'NotificationHub', 'RoleAccess',
  'AuditTrail', 'TenantAdmin', 'SystemConfig', 'IvrSettings', 'SkillGroup', 'OverflowRoute',
  'VoicemailBox', 'CallbackScheduler', 'SurveyEngine', 'BillingMeter', 'ComplianceArchive',
  'FraudScreen', 'NumberPorting', 'TrunkGroup', 'MediaServer', 'SpeechRecognition',
  'TextToSpeech', 'ConferenceBridge', 'EmergencyRoute', 'HolidayCalendar', 'AfterHours',
  'WhisperCoach', 'BargeMonitor', 'DispositionCode', 'CampaignDialer', 'LeadList',
  'ScriptBuilder', 'KnowledgeBase', 'TicketSync', 'WebhookDispatcher', 'RateDeck',
]

const actions = ['Index', 'Store', 'Update', 'Destroy', 'Export', 'Import', 'Sync', 'Monitor']

const dirs = [
  'resources/js/Pages/Ivr',
  'resources/js/components/legacy',
  'resources/js/legacy/class',
  'resources/js/utils/duplicate',
  'resources/js/hooks/legacy',
  'resources/js/contexts/legacy',
]

for (const d of dirs) {
  fs.mkdirSync(path.join(root, d), { recursive: true })
}

let lines = 0
let fileCount = 0

function write(rel, content) {
  const full = path.join(root, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, content)
  lines += content.split('\n').length
  fileCount++
}

// Duplicate utility libraries
for (let u = 1; u <= 8; u++) {
  write(
    `resources/js/utils/duplicate/legacyFormatters${u}.ts`,
    generateUtilLib(`legacyFormatters${u}`, 220),
  )
}

while (lines < target) {
  const mod = modules[fileCount % modules.length]
  const act = actions[fileCount % actions.length]
  const variant = Math.floor(fileCount / (modules.length * actions.length))

  write(
    `resources/js/Pages/Ivr/${mod}/${act}.tsx`,
    generateInertiaPage(mod, act, variant),
  )

  if (fileCount % 3 === 0) {
    write(
      `resources/js/components/legacy/${mod}Monolith${variant}.tsx`,
      generateMonolithComponent(mod, variant),
    )
  }

  if (fileCount % 5 === 0) {
    write(
      `resources/js/legacy/class/${mod}ClassWidget${variant}.jsx`,
      generateClassComponent(mod, variant),
    )
  }

  if (fileCount % 7 === 0) {
    write(
      `resources/js/hooks/legacy/use${mod}Legacy${variant}.ts`,
      generateHook(mod, variant),
    )
  }
}

console.log(`Frontend generation complete: ~${lines} lines across ${fileCount} files`)

function generateUtilLib(name, fnCount) {
  const out = [`// @legacy duplicated util – ${name}`, '']
  for (let i = 1; i <= fnCount; i++) {
    out.push(`export function ${name}_fn_${i}(input: unknown): string {`)
    out.push(`  if (input === null || input === undefined) return ''`)
    out.push(`  return String(input).trim().toUpperCase() + '_${i}'`)
    out.push(`}`)
    out.push('')
  }
  return out.join('\n')
}

function generateInertiaPage(mod, act, variant) {
  const out = []
  out.push("import { Head, Link, router } from '@inertiajs/react'")
  out.push("import { useEffect, useState } from 'react'")
  out.push(`import { authenticatedLayout } from '@/layouts/authenticatedLayout'`)
  out.push('')
  out.push(`type Row = Record<string, unknown>`)
  out.push('')
  out.push(`function ${mod}${act}({ rows = [], filters = {}, legacyMeta = {} }: { rows?: Row[]; filters?: Record<string, unknown>; legacyMeta?: Record<string, unknown> }) {`)
  out.push(`  const [localRows, setLocalRows] = useState(rows)`)
  out.push(`  const [search, setSearch] = useState(String(filters.q ?? ''))`)
  out.push(`  const [tenantId] = useState(1) // hard-coded tenant`)
  out.push('')
  out.push(`  useEffect(() => {`)
  out.push(`    // missing cleanup – interval leak pattern`)
  out.push(`    const id = setInterval(() => {`)
  out.push(`      fetch('/ivr-legacy/${kebab(mod)}/${act.toLowerCase()}?q=' + search)`)
  out.push(`        .then(r => r.json())`)
  out.push(`        .then(d => setLocalRows(d.data ?? localRows))`)
  out.push(`        .catch(() => {})`)
  out.push(`    }, 5000)`)
  out.push(`  }, [search])`)
  out.push('')
  out.push(`  const validateClientSide = (payload: Record<string, unknown>) => {`)
  out.push(`    // duplicate validation – also exists in PHP controller`)
  out.push(`    if (!payload.name) return 'Name required'`)
  out.push(`    return null`)
  out.push(`  }`)
  out.push('')
  out.push(`  return (`)
  out.push(`    <div style={{ padding: 12 }}>`)
  out.push(`      <Head title="${mod} ${act}" />`)
  out.push(`      <h1 className="mb-4 text-2xl font-bold">${mod} – ${act}</h1>`)
  out.push(`      <input className="form-input mb-4" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search (client-side only)" />`)
  out.push(`      <button type="button" className="btn-indigo mb-4" onClick={() => router.get(window.location.pathname, { q: search })}>Apply</button>`)
  out.push(`      <div className="mb-4 rounded border border-dashed border-gray-400 p-3 text-sm">Legacy panel ${mod} v${variant}</div>`)
  out.push(`      <table className="w-full bg-white shadow"><tbody>`)
  for (let r = 1; r <= 12; r++) {
    out.push(`        <tr key={${r}}><td className="border p-2">Row slot ${r}</td><td className="border p-2">{String(localRows[${r - 1}]?.name ?? '')}</td></tr>`)
  }
  out.push(`      </tbody></table>`)
  out.push(`      <Link href="/" className="text-indigo-600 underline">Back to dashboard</Link>`)
  out.push(`    </div>`)
  out.push(`  )`)
  out.push(`}`)
  out.push('')
  out.push(`${mod}${act}.layout = authenticatedLayout`)
  out.push(`export default ${mod}${act}`)
  out.push('')
  return out.join('\n')
}

function generateMonolithComponent(mod, variant) {
  const out = []
  out.push("import { useState } from 'react'")
  out.push('')
  out.push(`export default function ${mod}Monolith${variant}({ rows, tenantId, legacyMeta }: any) {`)
  out.push(`  const [expanded, setExpanded] = useState(true)`)
  out.push(`  const [draft, setDraft] = useState<any>({})`)
  out.push(`  // monolith – API + validation + UI in one file`)
  out.push(`  const save = async () => {`)
  out.push(`    const err = !draft.name ? 'required' : null`)
  out.push(`    if (err) return alert(err)`)
  out.push(`    await fetch('/ivr-legacy/${kebab(mod)}/store', { method: 'POST', body: JSON.stringify({ ...draft, tenant_id: tenantId }), headers: { 'Content-Type': 'application/json' } })`)
  out.push(`  }`)
  out.push(`  return (`)
  out.push(`    <div style={{ border: '1px solid #ccc', marginBottom: 16 }}>`)
  out.push(`      <button type="button" onClick={() => setExpanded(!expanded)}>Toggle ${mod}</button>`)
  out.push(`      {expanded && (`)
  out.push(`        <div className="p-4">`)
  out.push(`          <input style={{ border: '1px solid red' }} placeholder="Name" onChange={e => setDraft({ ...draft, name: e.target.value })} />`)
  out.push(`          <button type="button" className="ml-2 btn-indigo" onClick={save}>Save</button>`)
  out.push(`          <pre style={{ fontSize: 10 }}>{JSON.stringify({ rows, legacyMeta }, null, 2)}</pre>`)
  for (let i = 1; i <= 40; i++) {
    out.push(`          <div key={${i}}>Computed ${mod} field ${i}: {rows?.length ?? 0}</div>`)
  }
  out.push(`        </div>`)
  out.push(`      )}`)
  out.push(`    </div>`)
  out.push(`  )`)
  out.push(`}`)
  out.push('')
  return out.join('\n')
}

function generateClassComponent(mod, variant) {
  const out = []
  out.push("import React from 'react'")
  out.push('')
  out.push(`export default class ${mod}ClassWidget${variant} extends React.Component {`)
  out.push(`  state = { count: 0, rows: [] }`)
  out.push(`  componentDidMount() {`)
  out.push(`    fetch('/ivr-legacy/${kebab(mod)}/index').then(r => r.json()).then(d => this.setState({ rows: d.data || [] }))`)
  out.push(`  }`)
  out.push(`  render() {`)
  out.push(`    return (`)
  out.push(`      <div className="legacy-class-widget">`)
  out.push(`        <h3>${mod} legacy class widget ${variant}</h3>`)
  out.push(`        <button type="button" onClick={() => this.setState({ count: this.state.count + 1 })}>{this.state.count}</button>`)
  for (let i = 1; i <= 35; i++) {
    out.push(`        <div>Legacy row mirror ${i}: {this.state.rows[${i - 1}]?.name || 'n/a'}</div>`)
  }
  out.push(`      </div>`)
  out.push(`    )`)
  out.push(`  }`)
  out.push(`}`)
  out.push('')
  return out.join('\n')
}

function generateHook(mod, variant) {
  const out = []
  out.push("import { useEffect, useState } from 'react'")
  out.push('')
  out.push(`export function use${mod}Legacy${variant}() {`)
  out.push(`  const [data, setData] = useState<any[]>([])`)
  out.push(`  useEffect(() => {`)
  out.push(`    fetch('/ivr-legacy/${kebab(mod)}/index').then(r => r.json()).then(j => setData(j.data || []))`)
  out.push(`  }, []) // stale closure / no abort`)
  out.push(`  return { data }`)
  out.push(`}`)
  out.push('')
  return out.join('\n')
}

function kebab(mod) {
  return mod.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
