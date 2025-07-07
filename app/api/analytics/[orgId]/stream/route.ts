import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db from '@/lib/database/db';
import { 
  getDashboardSummary, 
  getPerformanceAnalytics,
  getFinancialAnalytics 
} from '@/lib/fetchers/analyticsFetchers';

// Type definitions for the analytics return types
interface PerformanceAnalytics {
  timeSeriesData: any[];
  utilizationRate: number;
  onTimeDeliveryRate: number;
  totalLoads: number;
  totalMiles: number;
  totalRevenue: number;
  averageRevenuePerMile: number;
}

interface FinancialAnalytics {
  revenue: any[];
  expenses: any[];
  profitMargin: any[];
  totalRevenue: number;
  totalExpenses: number;
  averageLoadValue: number;
}

// Use Node.js runtime for Prisma/database operations
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { userId } = await auth();
    const { orgId } = await params;

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Verify organization access
    const organization = await db.organization.findFirst({      where: {
        id: orgId,
        memberships: { 
          some: { 
            userId: userId 
          } 
        }
      }
    });

    if (!organization) {
      return new Response('Organization not found', { status: 404 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const data = JSON.stringify({ 
          type: 'connected', 
          timestamp: new Date().toISOString() 
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));

        // Function to send real-time updates
        const sendUpdate = async () => {
          try {            // Get current analytics data
            const [summary, performance, financial] = await Promise.all([
              getDashboardSummary(orgId),
              getPerformanceAnalytics(orgId, '24h'),
              getFinancialAnalytics(orgId, '24h')
            ]);

            // Type assertion to ensure proper typing
            const performanceData = performance as PerformanceAnalytics;
            const financialData = financial as FinancialAnalytics;            // Calculate live metrics
            const liveMetrics = {
              totalRevenue: summary.totalRevenue,
              totalLoads: summary.totalLoads,
              activeDrivers: summary.activeDrivers,
              utilizationRate: performanceData.utilizationRate || 0,
              onTimeDeliveryRate: performanceData.onTimeDeliveryRate || 0,
              averageLoadValue: financialData.averageLoadValue || 0,
              profitMargin: financialData.profitMargin || 0,
              timestamp: new Date().toISOString()
            };

            // Send live performance indicators
            const update = JSON.stringify({
              type: 'metrics_update',
              data: liveMetrics
            });
            controller.enqueue(encoder.encode(`data: ${update}\n\n`));            // Send alerts for significant changes
            if ((performanceData.utilizationRate || 0) < 70) {
              const alert = JSON.stringify({
                type: 'alert',
                level: 'warning',
                message: `Vehicle utilization is below 70% (${(performanceData.utilizationRate || 0).toFixed(1)}%)`,
                timestamp: new Date().toISOString()
              });
              controller.enqueue(encoder.encode(`data: ${alert}\n\n`));
            }

            if ((performanceData.onTimeDeliveryRate || 0) < 85) {
              const alert = JSON.stringify({
                type: 'alert',
                level: 'error',
                message: `On-time delivery rate is below 85% (${(performanceData.onTimeDeliveryRate || 0).toFixed(1)}%)`,
                timestamp: new Date().toISOString()
              });
              controller.enqueue(encoder.encode(`data: ${alert}\n\n`));
            }

          } catch (error) {
            console.error('Error sending update:', error);
            const errorMsg = JSON.stringify({
              type: 'error',
              message: 'Failed to fetch real-time data',
              timestamp: new Date().toISOString()
            });
            controller.enqueue(encoder.encode(`data: ${errorMsg}\n\n`));
          }
        };

        // Send updates every 30 seconds
        const interval = setInterval(sendUpdate, 30000);

        // Send initial update immediately
        sendUpdate();

        // Clean up on connection close
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Cache-Control'
      }
    });

  } catch (error) {
    console.error('Analytics stream error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
