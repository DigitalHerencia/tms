import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Clerk auth dependencies if needed (function does not call auth directly)
vi.mock('next/cache', () => ({ unstable_cache: (fn: any) => fn }))

const dbMock = {
  user: { findFirst: vi.fn().mockResolvedValue({ id: 'u1' }) },
  load: { count: vi.fn(), aggregate: vi.fn() },
  driver: { count: vi.fn() },
  vehicle: { count: vi.fn() },
  complianceAlert: { count: vi.fn() },
  iftaFuelPurchase: { aggregate: vi.fn() },
}

vi.mock('../../../lib/database/db', () => ({ __esModule: true, default: dbMock }))

describe('getDashboardMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calculates compliance, revenue and fuel costs', async () => {
    dbMock.load.count
      .mockResolvedValueOnce(5) // total loads
      .mockResolvedValueOnce(2) // active loads
    dbMock.driver.count
      .mockResolvedValueOnce(4) // total drivers
      .mockResolvedValueOnce(3) // active drivers
    dbMock.vehicle.count
      .mockResolvedValueOnce(10) // total vehicles
      .mockResolvedValueOnce(8) // available vehicles (status active)
      .mockResolvedValueOnce(1) // maintenance vehicles
      .mockResolvedValueOnce(6) // inspections count
      .mockResolvedValueOnce(1) // overdue inspections
    dbMock.complianceAlert.count.mockResolvedValue(2)
    dbMock.load.aggregate.mockResolvedValue({ _sum: { rate: 2000 } })
    dbMock.iftaFuelPurchase.aggregate.mockResolvedValue({ _sum: { amount: 500 } })

    const { getDashboardMetrics } = await import('../../../lib/fetchers/dashboardFetchers')
    const metrics = await getDashboardMetrics('org1', 'u1')

    expect(metrics.complianceScore).toBe(83)
    expect(metrics.revenue).toBe(2000)
    expect(metrics.fuelCosts).toBe(500)
  })
})
