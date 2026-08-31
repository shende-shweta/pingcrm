import { describe, expect, it } from 'vitest'
import {
    appendDigit,
    canAcceptDigit,
    clearDigitBuffer,
    createIdleSession,
    startTestSession,
    stopTestSession,
} from '@/utils/dtmfTestSession'

describe('dtmfTestSession', () => {
    it('starts in idle phase with empty buffer', () => {
        const session = createIdleSession()
        expect(session.phase).toBe('idle')
        expect(session.digitBuffer).toBe('')
        expect(canAcceptDigit(session)).toBe(false)
    })

    it('rejects digit input before Start Test', () => {
        const session = createIdleSession()
        const next = appendDigit(session, '5')
        expect(next.digitBuffer).toBe('')
        expect(next.phase).toBe('idle')
    })

    it('accepts digits after Start Test', () => {
        let session = startTestSession(createIdleSession())
        expect(canAcceptDigit(session)).toBe(true)
        session = appendDigit(session, '1')
        session = appendDigit(session, '2')
        expect(session.digitBuffer).toBe('12')
    })

    it('clears buffer and resets on End Test', () => {
        let session = startTestSession(createIdleSession())
        session = appendDigit(session, '9')
        session = stopTestSession(session)
        expect(session.phase).toBe('idle')
        expect(session.digitBuffer).toBe('')
    })

    it('clears buffer without ending session', () => {
        let session = startTestSession(createIdleSession())
        session = appendDigit(session, '3')
        session = clearDigitBuffer(session)
        expect(session.phase).toBe('testing')
        expect(session.digitBuffer).toBe('')
    })
})
