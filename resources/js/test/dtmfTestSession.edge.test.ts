import { describe, expect, it } from 'vitest'
import {
  DTMF_KEYS,
  appendDigit,
  canAcceptDigit,
  clearDigitBuffer,
  createIdleSession,
  startTestSession,
  stopTestSession,
} from '@/utils/dtmfTestSession'

describe('dtmfTestSession edge cases', () => {
  it('exposes the standard 12-key DTMF layout', () => {
    expect(DTMF_KEYS).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'])
    expect(DTMF_KEYS).toHaveLength(12)
  })

  it('startTestSession clears any prior buffer', () => {
    const idle = createIdleSession()
    const withBuffer = { ...idle, digitBuffer: '99' }
    const started = startTestSession(withBuffer)
    expect(started.phase).toBe('testing')
    expect(started.digitBuffer).toBe('')
  })

  it('clearDigitBuffer is a no-op while idle', () => {
    const idle = createIdleSession()
    const cleared = clearDigitBuffer(idle)
    expect(cleared).toEqual(idle)
    expect(cleared.phase).toBe('idle')
  })

  it('stopTestSession from idle returns a fresh idle session', () => {
    const stopped = stopTestSession(createIdleSession())
    expect(stopped).toEqual(createIdleSession())
    expect(canAcceptDigit(stopped)).toBe(false)
  })

  it('appendDigit appends special keys * and #', () => {
    let session = startTestSession(createIdleSession())
    session = appendDigit(session, '*')
    session = appendDigit(session, '#')
    expect(session.digitBuffer).toBe('*#')
  })

  it('appendDigit preserves session when digit input is empty', () => {
    let session = startTestSession(createIdleSession())
    session = appendDigit(session, '1')
    const next = appendDigit(session, '')
    expect(next.digitBuffer).toBe('1')
  })

  it('clearDigitBuffer only clears digits during testing', () => {
    let session = startTestSession(createIdleSession())
    session = appendDigit(session, '4')
    session = appendDigit(session, '2')
    session = clearDigitBuffer(session)
    expect(session.phase).toBe('testing')
    expect(session.digitBuffer).toBe('')
    expect(canAcceptDigit(session)).toBe(true)
  })
})
