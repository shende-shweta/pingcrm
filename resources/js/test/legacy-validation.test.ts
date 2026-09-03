// Redmine #17 — IVR Legacy Security Hardening (T-10, T-22)
// Tests for the validateClientSide guard present in all IVR legacy page components.
// This is the client-side mirror of PHP LegacyModuleService validation — PHP is authoritative.

import { describe, expect, it } from 'vitest'

/**
 * Extracted from AgentDeskIndex, AgentDeskStore, and all other IVR legacy pages.
 * Every generated page contains this identical inline function.
 */
function validateClientSide(payload: Record<string, unknown>): string | null {
    if (!payload.name) return 'Name required'
    return null
}

describe('IVR legacy page: validateClientSide', () => {
    it('returns "Name required" when name key is absent', () => {
        // AC: all IVR store payloads require name
        expect(validateClientSide({})).toBe('Name required')
    })

    it('returns "Name required" when name is empty string', () => {
        expect(validateClientSide({ name: '' })).toBe('Name required')
    })

    it('returns "Name required" when name is null', () => {
        expect(validateClientSide({ name: null })).toBe('Name required')
    })

    it('returns "Name required" when name is undefined', () => {
        expect(validateClientSide({ name: undefined })).toBe('Name required')
    })

    it('returns "Name required" when name is 0 (falsy number)', () => {
        expect(validateClientSide({ name: 0 })).toBe('Name required')
    })

    it('returns null when name is a non-empty string', () => {
        // Happy path — PHP then further validates allowed fields
        expect(validateClientSide({ name: 'Support Desk' })).toBeNull()
    })

    it('returns null when payload has name plus extra fields (injection attempt)', () => {
        // Extra fields are stripped server-side; client guard should not reject them
        expect(validateClientSide({ name: 'Desk', injectedField: 'x', accountId: 999 })).toBeNull()
    })

    it('returns null for a whitespace-only name (server validates further)', () => {
        // Client guard passes whitespace — PHP min:1 / not-empty should catch it
        expect(validateClientSide({ name: '   ' })).toBeNull()
    })
})
