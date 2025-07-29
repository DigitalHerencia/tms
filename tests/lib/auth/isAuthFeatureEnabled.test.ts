import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { isAuthFeatureEnabled } from '../../../features/auth'

const originalEnv = { ...process.env }

beforeEach(() => {
  vi.resetAllMocks()
  process.env = { ...originalEnv }
})

afterEach(() => {
  process.env = { ...originalEnv }
})

describe('isAuthFeatureEnabled', () => {
  it('returns true when NEXT_PUBLIC_ENABLE_AUTH=true', async () => {
    process.env.NEXT_PUBLIC_ENABLE_AUTH = 'true'
    const result = await isAuthFeatureEnabled()
    expect(result).toBe(true)
  })

  it('returns false when NEXT_PUBLIC_ENABLE_AUTH=false', async () => {
    process.env.NEXT_PUBLIC_ENABLE_AUTH = 'false'
    const result = await isAuthFeatureEnabled()
    expect(result).toBe(false)
  })

  it('fetches from FEATURE_SERVICE_URL when env var is undefined', async () => {
    process.env.NEXT_PUBLIC_ENABLE_AUTH = undefined as any
    process.env.FEATURE_SERVICE_URL = 'https://flags.example.com'
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => ({ enabled: true }) }) as any
    const result = await isAuthFeatureEnabled()
    expect(fetch).toHaveBeenCalledWith('https://flags.example.com/auth')
    expect(result).toBe(true)
  })

  it('returns false when fetch fails', async () => {
    process.env.NEXT_PUBLIC_ENABLE_AUTH = undefined as any
    process.env.FEATURE_SERVICE_URL = 'https://flags.example.com'
    global.fetch = vi.fn().mockRejectedValue(new Error('fail')) as any
    const result = await isAuthFeatureEnabled()
    expect(result).toBe(false)
  })
})
