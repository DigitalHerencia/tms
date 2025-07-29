import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@clerk/nextjs/server', () => ({ auth: () => Promise.resolve({ userId: 'u1', orgId: 'org1' }) }))
vi.mock('@/lib/auth/permissions', () => ({ hasPermission: () => true }))

const findMany = vi.fn()
const count = vi.fn()

vi.mock('../../../lib/database/db', () => ({
  __esModule: true,
  default: { complianceDocument: { findMany, count } }
}))

describe('getHOSLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calculates HOS totals and detects violations', async () => {
    findMany.mockResolvedValueOnce([
      {
        id: 'log1',
        createdAt: new Date('2024-05-01T00:00:00Z'),
        updatedAt: new Date('2024-05-01T12:00:00Z'),
        status: 'compliant',
        notes: '',
        verifiedBy: null,
        verifiedAt: null,
        metadata: {
          logs: [
            { startTime: '2024-05-01T08:00:00Z', endTime: '2024-05-01T20:30:00Z', status: 'driving' }
          ]
        }
      }
    ])
    count.mockResolvedValueOnce(1)

    const { getHOSLogs } = await import('../../../lib/fetchers/complianceFetchers')
    const result = await getHOSLogs({}) as any
    const log = result.data.logs[0]
    expect(log.totalDriveTime).toBeCloseTo(750)
    expect(log.violations.length).toBe(1)
    expect(log.violations[0].type).toBe('11_hour')
  })

  it('uses timeRecords if present', async () => {
    findMany.mockResolvedValueOnce([
      {
        id: 'log2',
        createdAt: new Date('2024-05-02T00:00:00Z'),
        updatedAt: new Date('2024-05-02T12:00:00Z'),
        status: 'compliant',
        notes: '',
        verifiedBy: null,
        verifiedAt: null,
        metadata: {
          timeRecords: [
            { startTime: '2024-05-02T08:00:00Z', endTime: '2024-05-02T12:00:00Z', status: 'driving' },
            { startTime: '2024-05-02T12:00:00Z', endTime: '2024-05-02T14:00:00Z', status: 'on_duty' },
            { startTime: '2024-05-02T14:00:00Z', endTime: '2024-05-02T22:00:00Z', status: 'off_duty' }
          ]
        }
      }
    ])
    count.mockResolvedValueOnce(1)

    const { getHOSLogs } = await import('../../../lib/fetchers/complianceFetchers')
    const result = await getHOSLogs({}) as any
    const log = result.data.logs[0]
    expect(log.totalDriveTime).toBe(240)
    expect(log.totalOnDutyTime).toBe(360)
    expect(log.totalOffDutyTime).toBe(480)
  })
})
