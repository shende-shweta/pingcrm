import { describe, expect, it } from 'vitest'
import { STATUS_TONES, statusTone } from './statusTone'

describe('statusTone', () => {
    const known: Array<[string, string]> = [
        ['Normal', 'bg-green-100 text-green-800'],
        ['Warning', 'bg-yellow-100 text-yellow-800'],
        ['Critical', 'bg-red-100 text-red-800'],
        ['Available', 'bg-green-100 text-green-800'],
        ['On Call', 'bg-indigo-100 text-indigo-800'],
        ['Wrap-up', 'bg-gray-100 text-gray-800'],
        ['Resolved', 'bg-green-100 text-green-800'],
        ['Sale', 'bg-indigo-100 text-indigo-800'],
        ['Escalated', 'bg-orange-100 text-orange-800'],
        ['Abandoned', 'bg-red-100 text-red-800'],
        ['Callback', 'bg-blue-100 text-blue-800'],
    ]

    it.each(known)('returns the correct class for "%s"', (value, expected) => {
        expect(statusTone(value)).toBe(expected)
    })

    it('returns null for an unknown value', () => {
        expect(statusTone('SomeUnknownStatus')).toBeNull()
    })

    it('returns null for an empty string', () => {
        expect(statusTone('')).toBeNull()
    })

    it('STATUS_TONES has exactly 11 entries', () => {
        expect(Object.keys(STATUS_TONES)).toHaveLength(11)
    })
})
