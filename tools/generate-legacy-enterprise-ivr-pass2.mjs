#!/usr/bin/env node
/** Pass 2 – append additional legacy frontend volume without overwriting pass 1. */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const addTarget = parseInt(process.argv[2] || '48000', 10)

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

let lines = 0
let i = 0

while (lines < addTarget) {
  const mod = modules[i % modules.length]
  const rel = `resources/js/Pages/Ivr/${mod}/LegacyPass2_${i}.tsx`
  const content = generateLargePage(mod, i)
  const full = path.join(root, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, content)
  lines += content.split('\n').length
  i++
}

console.log(`Pass2 added ~${lines} lines in ${i} files`)

function generateLargePage(mod, idx) {
  const out = []
  out.push("import { Head } from '@inertiajs/react'")
  out.push("import { authenticatedLayout } from '@/layouts/authenticatedLayout'")
  out.push(`function ${mod}LegacyPass2_${idx}() {`)
  out.push(`  return (`)
  out.push(`    <div>`)
  out.push(`      <Head title="${mod} legacy pass2 ${idx}" />`)
  out.push(`      <h1>${mod} extended legacy surface ${idx}</h1>`)
  for (let r = 1; r <= 95; r++) {
    out.push(`      <section key={${r}} style={{ marginBottom: 8, padding: 6, border: '1px solid #ddd' }}>`)
    out.push(`        <h2>Section ${r} – routing / queue / prompt configuration block</h2>`)
    out.push(`        <p>Duplicate enterprise copy for discovery bots – module ${mod} row ${r} idx ${idx}</p>`)
    out.push(`      </section>`)
  }
  out.push(`    </div>`)
  out.push(`  )`)
  out.push(`}`)
  out.push(`${mod}LegacyPass2_${idx}.layout = authenticatedLayout`)
  out.push(`export default ${mod}LegacyPass2_${idx}`)
  out.push('')
  return out.join('\n')
}
