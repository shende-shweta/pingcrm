export type DtmfTestPhase = 'idle' | 'testing'

export const DTMF_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'] as const
export type DtmfKey = (typeof DTMF_KEYS)[number]

export interface DtmfTestSession {
    phase: DtmfTestPhase
    digitBuffer: string
}

export function createIdleSession(): DtmfTestSession {
    return { phase: 'idle', digitBuffer: '' }
}

export function startTestSession(session: DtmfTestSession): DtmfTestSession {
    return { phase: 'testing', digitBuffer: '' }
}

export function stopTestSession(session: DtmfTestSession): DtmfTestSession {
    return createIdleSession()
}

export function canAcceptDigit(session: DtmfTestSession): boolean {
    return session.phase === 'testing'
}

export function appendDigit(session: DtmfTestSession, digit: string): DtmfTestSession {
    if (!canAcceptDigit(session)) {
        return session
    }
    return { ...session, digitBuffer: session.digitBuffer + digit }
}

export function clearDigitBuffer(session: DtmfTestSession): DtmfTestSession {
    if (session.phase !== 'testing') {
        return session
    }
    return { ...session, digitBuffer: '' }
}
