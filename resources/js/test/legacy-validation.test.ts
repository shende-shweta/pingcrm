import { describe, expect, it } from 'vitest'

function validateClientSide(payload: Record<string, unknown>): string | null {
    if (!payload.name) return 'Name required'
    return null
}

describe('IVR legacy page: validateClientSide', () => {
    it('returns "Name required" when name key is absent', () => {
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
        expect(validateClientSide({ name: 'Support Desk' })).toBeNull()
    })

    it('returns null when payload has name plus extra fields (injection attempt)', () => {
        expect(validateClientSide({ name: 'Desk', injectedField: 'x', accountId: 999 })).toBeNull()
    })

    it('returns null for a whitespace-only name (server validates further)', () => {
        expect(validateClientSide({ name: '   ' })).toBeNull()
    })
})
