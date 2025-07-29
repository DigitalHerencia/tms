import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@clerk/nextjs/server', () => ({ auth: () => Promise.resolve({ userId: 'u1' }) }))
vi.mock('../../../lib/cache/auth-cache', () => ({
  getCachedData: () => null,
  setCachedData: vi.fn(),
  CACHE_TTL: { SHORT: 60 }
}))

const findUnique = vi.fn()
const tripFindMany = vi.fn()
const fuelFindMany = vi.fn()
const reportFindFirst = vi.fn()

vi.mock('../../../lib/database/db', () => ({
  __esModule: true,
  default: {
    user: { findUnique },
    iftaTrip: { findMany: tripFindMany },
    iftaFuelPurchase: { findMany: fuelFindMany },
    iftaReport: { findFirst: reportFindFirst }
  }
}))

beforeEach(() => {
  vi.clearAllMocks()
  findUnique.mockResolvedValue({ organizationId: 'org1', role: 'admin' })
  tripFindMany.mockResolvedValue([])
  fuelFindMany.mockResolvedValue([])
})

describe('getIftaDataForPeriod', () => {
  it('filters reports by quarter date range', async () => {
    const mockReport = { id: 'r1', status: 'submitted', submittedAt: new Date('2024-04-15'), dueDate: new Date('2024-04-30') }
    reportFindFirst.mockResolvedValue(mockReport)

    const { getIftaDataForPeriod } = await import('../../../lib/fetchers/iftaFetchers')
    const result = await getIftaDataForPeriod('org1', 'Q1', '2024')
    const args = reportFindFirst.mock.calls[0]![0]

    expect(args.where.organizationId).toBe('org1')
    expect(args.where.createdAt.gte).toEqual(new Date(2024, 0, 1))
    expect(args.where.createdAt.lte).toEqual(new Date(2024, 3, 0, 23, 59, 59))
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
