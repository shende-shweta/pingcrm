import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const indexSource = readFileSync(
  resolve(process.cwd(), 'resources/js/Pages/Ivr/Module/Index.tsx'),
  'utf8',
)

describe('IVR Module call-flow integration', () => {
  it('mounts DtmfKeypad only for the call-flow module slug', () => {
    expect(indexSource).toContain("const isCallFlowModule = moduleSlug === 'call-flow'")
    expect(indexSource).toContain('{isCallFlowModule && (')
    expect(indexSource).toContain('<DtmfKeypad />')
  })

  it('imports DtmfKeypad from the ivr components package', () => {
    expect(indexSource).toContain("import { DtmfKeypad } from '@/components/ivr/DtmfKeypad'")
  })
})
