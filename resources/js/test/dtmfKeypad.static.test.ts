import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const keypadSource = readFileSync(
  resolve(process.cwd(), 'resources/js/components/ivr/DtmfKeypad.tsx'),
  'utf8',
)

describe('DtmfKeypad static contract', () => {
  it('declares accessibility and test harness markers', () => {
    expect(keypadSource).toContain('data-testid="dtmf-test-panel"')
    expect(keypadSource).toContain('data-testid="dtmf-digit-buffer"')
    expect(keypadSource).toContain('aria-live="polite"')
    expect(keypadSource).toContain('aria-label="DTMF keypad"')
  })

  it('gates keypad via canAcceptDigit and shows idle guidance', () => {
    expect(keypadSource).toContain('canAcceptDigit(session)')
    expect(keypadSource).toContain('Keypad is disabled until you start a test session')
    expect(keypadSource).toContain('disabled={!keypadEnabled}')
  })

  it('implements press highlight flash timing', () => {
    expect(keypadSource).toContain('PRESS_HIGHLIGHT_MS = 200')
    expect(keypadSource).toContain('border-indigo-600 bg-indigo-600')
    expect(keypadSource).toContain('setTimeout(() => setPressedKey(null), PRESS_HIGHLIGHT_MS)')
  })

  it('wires session lifecycle handlers', () => {
    expect(keypadSource).toContain('startTestSession')
    expect(keypadSource).toContain('stopTestSession')
    expect(keypadSource).toContain('appendDigit')
    expect(keypadSource).toContain('clearDigitBuffer')
    expect(keypadSource).toContain('Start Test')
    expect(keypadSource).toContain('End Test')
    expect(keypadSource).toContain('Clear buffer')
  })
})
