#!/usr/bin/env ts-node
/**
 * FleetFusion Database Maintenance & Monitoring Script
 * 
 * This script helps maintain your Neon PostgreSQL database performance
 * and provides monitoring capabilities for production environments.
 * 
 * Usage:
 *   npm run db:maintenance
 *   npm run db:monitor
 *   npm run db:health-check
 */

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

interface DatabaseStats {
  tableName: string
  rowCount: number
  tableSize: string
  indexSize: string
  totalSize: string
}

interface SlowQuery {
  query: string
  calls: number
  totalTime: number
  meanTime: number
  rows: number
}

interface ConnectionStats {
  state: string
  count: number
  avgDuration: number
}

/**
 * Get comprehensive database statistics
 */
async function getDatabaseStats(): Promise<DatabaseStats[]> {
  const query = `
    SELECT 
      schemaname,
      tablename,
      n_tup_ins + n_tup_upd + n_tup_del as total_operations,
      n_live_tup as row_count,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
      pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
  `

  const result = await prisma.$queryRaw<any[]>`${query}`
  
  return result.map(row => ({
    tableName: row.tablename,
    rowCount: parseInt(row.row_count) || 0,
    tableSize: row.table_size,
    indexSize: row.index_size,
    totalSize: row.total_size,
  }))
}

/**
 * Get slow query statistics (requires pg_stat_statements extension)
 */
async function getSlowQueries(): Promise<SlowQuery[]> {
  try {
    const query = `
      SELECT 
        LEFT(query, 100) as query,
        calls,
        total_exec_time as total_time,
        mean_exec_time as mean_time,
        rows
      FROM pg_stat_statements 
      WHERE mean_exec_time > 100
      ORDER BY mean_exec_time DESC 
      LIMIT 10;
    `

    const result = await prisma.$queryRaw<any[]>`${query}`
    
    return result.map(row => ({
      query: row.query,
      calls: parseInt(row.calls),
      totalTime: parseFloat(row.total_time),
      meanTime: parseFloat(row.mean_time),
      rows: parseInt(row.rows) || 0,
    }))
  } catch (error) {
    console.warn('pg_stat_statements extension not available')
    return []
  }
}

/**
 * Get connection statistics
 */
async function getConnectionStats(): Promise<ConnectionStats[]> {
  const query = `
    SELECT 
      COALESCE(state, 'unknown') as state,
      COUNT(*) as count,
      COALESCE(AVG(EXTRACT(EPOCH FROM (NOW() - query_start))), 0) as avg_duration
    FROM pg_stat_activity 
    WHERE pid != pg_backend_pid()
    GROUP BY state
    ORDER BY count DESC;
  `

  const result = await prisma.$queryRaw<any[]>`${query}`
  
  return result.map(row => ({
    state: row.state,
    count: parseInt(row.count),
    avgDuration: parseFloat(row.avg_duration) || 0,
  }))
}

/**
 * Check index usage efficiency
 */
async function getIndexUsageStats() {
  const query = `
    SELECT 
      schemaname,
      tablename,
      indexname,
      idx_tup_read + idx_tup_fetch as total_reads,
      idx_tup_read,
      idx_tup_fetch,
      CASE 
        WHEN idx_tup_read + idx_tup_fetch = 0 THEN 0
        ELSE round((idx_tup_fetch::numeric / (idx_tup_read + idx_tup_fetch)) * 100, 2)
      END as hit_rate
    FROM pg_stat_user_indexes 
    WHERE schemaname = 'public'
    ORDER BY total_reads DESC
    LIMIT 20;
  `

  const result = await prisma.$queryRaw<any[]>`${query}`
  return result
}

/**
 * Perform database maintenance operations
 */
async function performMaintenance() {
  console.log('🔧 Starting database maintenance...')

  try {
    // Clean up old audit logs (older than 90 days)
    const auditLogCleanup = await prisma.auditLog.deleteMany({
      where: {
        timestamp: {
          lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        }
      }
    })
    console.log(`✅ Cleaned up ${auditLogCleanup.count} old audit log entries`)

    // Clean up processed webhook events (older than 30 days)
    const webhookCleanup = await prisma.webhookEvent.deleteMany({
      where: {
        status: 'processed',
        processedAt: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    })
    console.log(`✅ Cleaned up ${webhookCleanup.count} old webhook events`)

    // Update database statistics
    await prisma.$executeRaw`ANALYZE;`
    console.log('✅ Updated database statistics')

    // Check for table bloat and suggest maintenance if needed
    const bloatQuery = `
      SELECT 
        tablename,
        n_dead_tup,
        n_live_tup,
        CASE 
          WHEN n_live_tup > 0 
          THEN round((n_dead_tup::float / n_live_tup) * 100, 2)
          ELSE 0
        END as bloat_ratio
      FROM pg_stat_user_tables
      WHERE schemaname = 'public' AND n_live_tup > 0
      ORDER BY bloat_ratio DESC;
    `

    const bloatResult = await prisma.$queryRaw<any[]>`${bloatQuery}`
    const highBloatTables = bloatResult.filter((table: any) => table.bloat_ratio > 20)

    if (highBloatTables.length > 0) {
      console.log('⚠️  Tables with high bloat ratio (>20%):')
      highBloatTables.forEach((table: any) => {
        console.log(`   ${table.tablename}: ${table.bloat_ratio}%`)
      })
      console.log('   Consider running VACUUM ANALYZE on these tables')
    }

    console.log('✅ Database maintenance completed successfully!')

  } catch (error) {
    console.error('❌ Database maintenance failed:', error)
    throw error
  }
}

/**
 * Generate comprehensive health report
 */
async function generateHealthReport() {
  console.log('📊 Generating database health report...\n')

  try {
    // Database size and table statistics
    console.log('=== DATABASE STATISTICS ===')
    const stats = await getDatabaseStats()
    console.table(stats)

    // Connection statistics
    console.log('\n=== CONNECTION STATISTICS ===')
    const connections = await getConnectionStats()
    console.table(connections)

    // Index usage
    console.log('\n=== INDEX USAGE ===')
    const indexStats = await getIndexUsageStats()
    console.table(indexStats.slice(0, 10)) // Top 10 most used indexes

    // Slow queries
    console.log('\n=== SLOW QUERIES ===')
    const slowQueries = await getSlowQueries()
    if (slowQueries.length > 0) {
      console.table(slowQueries)
    } else {
      console.log('✅ No slow queries detected or pg_stat_statements not available')
    }

    // Current database configuration
    console.log('\n=== DATABASE CONFIGURATION ===')
    const configQuery = `
      SELECT 
        name,
        setting,
        unit,
        short_desc
      FROM pg_settings 
      WHERE name IN (
        'max_connections',
        'shared_buffers',
        'effective_cache_size',
        'maintenance_work_mem',
        'work_mem',
        'checkpoint_completion_target'
      )
      ORDER BY name;
    `
    const config = await prisma.$queryRaw<any[]>`${configQuery}`
    console.table(config)

    // Application-specific metrics
    console.log('\n=== APPLICATION METRICS ===')
    const appMetrics = await Promise.all([
      prisma.organization.count(),
      prisma.user.count(),
      prisma.vehicle.count(),
      prisma.driver.count(),
      prisma.load.count(),
      prisma.auditLog.count(),
    ])

    const metrics = {
      organizations: appMetrics[0],
      users: appMetrics[1],
      vehicles: appMetrics[2],
      drivers: appMetrics[3],
      loads: appMetrics[4],
      auditLogs: appMetrics[5],
    }
    console.table([metrics])

    console.log('\n✅ Health report completed successfully!')

  } catch (error) {
    console.error('❌ Health report generation failed:', error)
    throw error
  }
}

/**
 * Monitor critical thresholds and alert if needed
 */
async function monitorCriticalMetrics() {
  console.log('🔍 Monitoring critical database metrics...')

  try {
    // Check connection count
    const connectionQuery = `
      SELECT COUNT(*) as active_connections
      FROM pg_stat_activity 
      WHERE state = 'active';
    `
    const connectionResult = await prisma.$queryRaw<any[]>`${connectionQuery}`
    const activeConnections = connectionResult[0]?.active_connections || 0

    if (activeConnections > 800) { // 80% of max connections
      console.warn(`⚠️  High connection count: ${activeConnections}/901`)
    }

    // Check for long-running queries
    const longQueryQuery = `
      SELECT 
        pid,
        query_start,
        state,
        LEFT(query, 100) as query
      FROM pg_stat_activity 
      WHERE state = 'active' 
        AND query_start < NOW() - INTERVAL '5 minutes'
        AND pid != pg_backend_pid();
    `
    const longQueries = await prisma.$queryRaw<any[]>`${longQueryQuery}`
    
    if (longQueries.length > 0) {
      console.warn(`⚠️  Found ${longQueries.length} long-running queries`)
      console.table(longQueries)
    }

    // Check table sizes for rapid growth
    const sizeQuery = `
      SELECT 
        tablename,
        pg_size_pretty(pg_total_relation_size('public.'||tablename)) as size,
        pg_total_relation_size('public.'||tablename) as bytes
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size('public.'||tablename) DESC
      LIMIT 5;
    `
    const tableSizes = await prisma.$queryRaw<any[]>`${sizeQuery}`
    console.log('\n📏 Largest tables:')
    console.table(tableSizes)

    console.log('✅ Monitoring completed successfully!')

  } catch (error) {
    console.error('❌ Monitoring failed:', error)
    throw error
  }
}

/**
 * Main function to handle command line arguments
 */
async function main() {
  const command = process.argv[2] || 'health'

  try {
    switch (command) {
      case 'maintenance':
        await performMaintenance()
        break
      
      case 'monitor':
        await monitorCriticalMetrics()
        break
      
      case 'health':
      case 'health-check':
        await generateHealthReport()
        break
      
      case 'all':
        await generateHealthReport()
        console.log('\n' + '='.repeat(50) + '\n')
        await monitorCriticalMetrics()
        console.log('\n' + '='.repeat(50) + '\n')
        await performMaintenance()
        break
      
      default:
        console.log(`
Usage: npm run db:maintenance [command]

Commands:
  health      Generate comprehensive health report (default)
  monitor     Monitor critical metrics and thresholds
  maintenance Perform database cleanup and maintenance
  all         Run all commands in sequence

Examples:
  npm run db:maintenance
  npm run db:maintenance health
  npm run db:maintenance monitor
  npm run db:maintenance all
        `)
        process.exit(1)
    }

  } catch (error) {
    console.error('❌ Database operation failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down...')
  await prisma.$disconnect()
  process.exit(0)
})

// Run the main function
if (require.main === module) {
  main().catch(console.error)
}

export {
  getDatabaseStats,
  getSlowQueries,
  getConnectionStats,
  getIndexUsageStats,
  performMaintenance,
  generateHealthReport,
  monitorCriticalMetrics,
}