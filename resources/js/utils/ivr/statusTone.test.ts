import { describe, expect, it } from 'vitest'
import { statusTone } from './statusTone'

describe('statusTone', () => {
    it.each([
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
    ])('returns correct classes for "%s"', (value, expected) => {
        expect(statusTone(value)).toBe(expected)
    })

    it('returns gray fallback for unknown values', () => {
        expect(statusTone('SomethingElse')).toBe('bg-gray-100 text-gray-700')
    })

    it('returns gray fallback for empty string', () => {
        expect(statusTone('')).toBe('bg-gray-100 text-gray-700')
    })

    it('is case-sensitive', () => {
        expect(statusTone('normal')).toBe('bg-gray-100 text-gray-700')
        expect(statusTone('NORMAL')).toBe('bg-gray-100 text-gray-700')
    })
})
