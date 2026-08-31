import { useCallback, useEffect, useRef, useState } from 'react'
import {
    DTMF_KEYS,
    appendDigit,
    canAcceptDigit,
    clearDigitBuffer,
    createIdleSession,
    startTestSession,
    stopTestSession,
    type DtmfTestSession,
} from '@/utils/dtmfTestSession'

const PRESS_HIGHLIGHT_MS = 200

interface DtmfKeypadProps {
    onDigitPress?: (digit: string, buffer: string) => void
}

export function DtmfKeypad({ onDigitPress }: DtmfKeypadProps) {
    const [session, setSession] = useState<DtmfTestSession>(createIdleSession)
    const [pressedKey, setPressedKey] = useState<string | null>(null)
    const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (highlightTimer.current) {
                clearTimeout(highlightTimer.current)
            }
        }
    }, [])

    const flashKey = useCallback((digit: string) => {
        setPressedKey(digit)
        if (highlightTimer.current) {
            clearTimeout(highlightTimer.current)
        }
        highlightTimer.current = setTimeout(() => setPressedKey(null), PRESS_HIGHLIGHT_MS)
    }, [])

    const handleStartTest = () => {
        setSession((prev) => startTestSession(prev))
    }

    const handleStopTest = () => {
        setSession((prev) => stopTestSession(prev))
        setPressedKey(null)
    }

    const handleDigitClick = (digit: string) => {
        if (!canAcceptDigit(session)) {
            return
        }
        flashKey(digit)
        setSession((prev) => {
            const next = appendDigit(prev, digit)
            onDigitPress?.(digit, next.digitBuffer)
            return next
        })
    }

    const handleClear = () => {
        setSession((prev) => clearDigitBuffer(prev))
    }

    const keypadEnabled = canAcceptDigit(session)

    return (
        <div className="rounded border border-gray-200 bg-white p-4 shadow" data-testid="dtmf-test-panel">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold">Call Flow Test Harness</h3>
                    <p className="text-sm text-gray-500">
                        Simulate DTMF input against the active call-flow design.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                            session.phase === 'testing'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        {session.phase === 'testing' ? 'Testing' : 'Idle'}
                    </span>
                    {session.phase === 'idle' ? (
                        <button type="button" className="btn-indigo text-sm" onClick={handleStartTest}>
                            Start Test
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                            onClick={handleStopTest}
                        >
                            End Test
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-4 rounded bg-gray-50 px-3 py-2">
                <div className="text-xs font-medium uppercase text-gray-500">Digit buffer</div>
                <div
                    className="mt-1 min-h-[1.75rem] font-mono text-lg tracking-widest text-gray-900"
                    aria-live="polite"
                    data-testid="dtmf-digit-buffer"
                >
                    {session.digitBuffer || (session.phase === 'testing' ? '—' : 'Press Start Test to begin')}
                </div>
            </div>

            {session.phase === 'idle' && (
                <p className="mb-3 text-sm text-amber-700" role="status">
                    Keypad is disabled until you start a test session.
                </p>
            )}

            <div className="grid max-w-xs grid-cols-3 gap-2" role="group" aria-label="DTMF keypad">
                {DTMF_KEYS.map((digit) => {
                    const isPressed = pressedKey === digit
                    return (
                        <button
                            key={digit}
                            type="button"
                            disabled={!keypadEnabled}
                            aria-label={`DTMF ${digit}`}
                            data-testid={`dtmf-key-${digit}`}
                            onClick={() => handleDigitClick(digit)}
                            className={`rounded border px-4 py-3 text-lg font-semibold transition ${
                                isPressed
                                    ? 'border-indigo-600 bg-indigo-600 text-white ring-2 ring-indigo-300'
                                    : keypadEnabled
                                      ? 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50'
                                      : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                            }`}
                        >
                            {digit}
                        </button>
                    )
                })}
            </div>

            {session.phase === 'testing' && (
                <button
                    type="button"
                    className="mt-3 text-sm text-gray-600 underline hover:text-gray-900"
                    onClick={handleClear}
                >
                    Clear buffer
                </button>
            )}
        </div>
    )
}
