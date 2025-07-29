import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@clerk/nextjs/server', () => ({ auth: () => Promise.resolve({ userId: 'u1' }) }))
vi.mock('../../../lib/cache/auth-cache', () => ({
  getCachedData: () => null,
  setCachedData: vi.fn(),
  CACHE_TTL: { SHORT: 60 }
}))

const findUnique = vi.fn()
const tripFindMany = vi.fn()
const tripAggregate = vi.fn()
const tripGroupBy = vi.fn()
const fuelFindMany = vi.fn()
const fuelAggregate = vi.fn()
const fuelGroupBy = vi.fn()
const reportFindFirst = vi.fn()

vi.mock('../../../lib/database/db', () => ({
  __esModule: true,
  default: {
    user: { findUnique },
    iftaTrip: { findMany: tripFindMany, aggregate: tripAggregate, groupBy: tripGroupBy },
    iftaFuelPurchase: { findMany: fuelFindMany, aggregate: fuelAggregate, groupBy: fuelGroupBy },
    iftaReport: { findFirst: reportFindFirst }
  }
}))

beforeEach(() => {
  vi.clearAllMocks()
  findUnique.mockResolvedValue({ organizationId: 'org1', role: 'admin' })
  tripFindMany.mockResolvedValue([])
  tripAggregate.mockResolvedValue({ _sum: { distance: 0 } })
  tripGroupBy.mockResolvedValue([])
  fuelFindMany.mockResolvedValue([])
  fuelAggregate.mockResolvedValue({ _sum: { gallons: 0, amount: 0 } })
  fuelGroupBy.mockResolvedValue([])
})

describe('getIftaDataForPeriod', () => {
  it('filters reports by quarter date range', async () => {
    const mockReport = { id: 'r1', status: 'submitted', submittedAt: new Date('2024-04-15'), dueDate: new Date('2024-04-30') }
    reportFindFirst.mockResolvedValue(mockReport)

    const { getIftaDataForPeriod } = await import('../../../lib/fetchers/iftaFetchers')
    const result = await getIftaDataForPeriod('org1', 'Q1', '2024')
    const args = reportFindFirst.mock.calls[0]![0]

    expect(args.where.organizationId).toBe('org1')
    expect(args.where.quarter).toBe(1)
    expect(args.where.year).toBe(2024)
    expect(result.report).toEqual({
      id: 'r1',
      status: 'submitted',
      submittedAt: mockReport.submittedAt,
      dueDate: mockReport.dueDate
    })
  })

  it('returns null when no report exists in range', async () => {
    reportFindFirst.mockResolvedValue(null)

    const { getIftaDataForPeriod } = await import('../../../lib/fetchers/iftaFetchers')
    const result = await getIftaDataForPeriod('org1', 'Q2', '2024')

    expect(result.report).toBeNull()
  })
})
