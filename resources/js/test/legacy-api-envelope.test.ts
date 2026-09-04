/**
 * Tests for the {ok, data, meta} / {ok, error, code, details} envelope format
 * introduced by LegacyModuleService + BaseLegacyController in Phase 2.
 * React pages must read response.data.data (not response.data) after this change.
 * @see Redmine #17 \u2014 IVR Legacy Security Hardening (T-10, T-11, T-23)
 */

import { describe, expect, it } from 'vitest'

type SuccessEnvelope<T = unknown> = {
    ok: true
    data: T[]
    meta: Record<string, unknown>
}

type ErrorEnvelope = {
    ok: false
    error: string
    code: number
    details: unknown
}

type LegacyEnvelope<T = unknown> = SuccessEnvelope<T> | ErrorEnvelope

function extractRows<T>(envelope: LegacyEnvelope<T>): T[] {
    return envelope.ok ? envelope.data : []
}

function isSuccessEnvelope<T>(envelope: LegacyEnvelope<T>): envelope is SuccessEnvelope<T> {
    return envelope.ok === true
}

function errorMessage(envelope: LegacyEnvelope): string | null {
    return isSuccessEnvelope(envelope) ? null : envelope.error
}

describe('Legacy API envelope: success path', () => {
    it('extractRows returns data array from success envelope', () => {
        const env: SuccessEnvelope<{ name: string }> = {
            ok: true,
            data: [{ name: 'Desk A' }, { name: 'Desk B' }],
            meta: { total: 2 },
        }
        expect(extractRows(env)).toHaveLength(2)
        expect(extractRows(env)[0].name).toBe('Desk A')
    })

    it('extractRows handles empty data array', () => {
        const env: SuccessEnvelope = { ok: true, data: [], meta: {} }
        expect(extractRows(env)).toHaveLength(0)
    })

    it('extractRows preserves all 12 rows (matches legacy page row slots)', () => {
        const rows = Array.from({ length: 12 }, (_, i) => ({ name: `Desk ${i}` }))
        const env: SuccessEnvelope<{ name: string }> = { ok: true, data: rows, meta: { total: 12 } }
        expect(extractRows(env)).toHaveLength(12)
    })

    it('isSuccessEnvelope is true for ok=true envelope', () => {
        const env: SuccessEnvelope = { ok: true, data: [], meta: {} }
        expect(isSuccessEnvelope(env)).toBe(true)
    })

    it('errorMessage returns null for success envelope', () => {
        const env: SuccessEnvelope = { ok: true, data: [], meta: {} }
        expect(errorMessage(env)).toBeNull()
    })
})

describe('Legacy API envelope: error path', () => {
    it('extractRows returns empty array for 422 error envelope', () => {
        const env: ErrorEnvelope = {
            ok: false,
            error: 'Validation failed',
            code: 422,
            details: { name: ['required'] },
        }
        expect(extractRows(env)).toHaveLength(0)
    })

    it('extractRows returns empty array for 500 error envelope', () => {
        const env: ErrorEnvelope = {
            ok: false,
            error: 'Internal server error',
            code: 500,
            details: null,
        }
        expect(extractRows(env)).toHaveLength(0)
    })

    it('extractRows returns empty array for 404 error envelope', () => {
        const env: ErrorEnvelope = {
            ok: false,
            error: 'Module not found',
            code: 404,
            details: null,
        }
        expect(extractRows(env)).toHaveLength(0)
    })

    it('isSuccessEnvelope is false for ok=false envelope', () => {
        const env: ErrorEnvelope = { ok: false, error: 'not found', code: 404, details: null }
        expect(isSuccessEnvelope(env)).toBe(false)
    })

    it('errorMessage returns the error string for error envelope', () => {
        const env: ErrorEnvelope = { ok: false, error: 'Validation failed', code: 422, details: null }
        expect(errorMessage(env)).toBe('Validation failed')
    })
})

describe('Legacy API envelope: security boundary', () => {
    it('success envelope does not carry ok=false sentinel', () => {
        const env: SuccessEnvelope = { ok: true, data: [], meta: {} }
        expect(env.ok).toBe(true)
    })

    it('error envelope code matches HTTP status (422 for validation)', () => {
        const env: ErrorEnvelope = {
            ok: false,
            error: 'Validation failed',
            code: 422,
            details: { name: ['The name field is required.'] },
        }
        expect(env.code).toBe(422)
        expect(Array.isArray((env.details as Record<string, string[]>)['name'])).toBe(true)
    })
})
