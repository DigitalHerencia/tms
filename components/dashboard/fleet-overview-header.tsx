import { Card, CardContent } from "@/components/ui/card"
import { getDashboardSummary } from "@/lib/fetchers/analyticsFetchers"
import type { DashboardSummary } from "@/types/dashboard"
import { RefreshCw, Shield } from "lucide-react"

interface FleetOverviewHeaderProps {
    orgId: string
    userId: string // <-- Add userId to props
}

export default async function FleetOverviewHeader({
    orgId,
}: FleetOverviewHeaderProps) {
    if (!orgId) {
        return (
            <Card className='border-red-200 bg-red-50'>
                <CardContent className='p-4'>
                    <p className='text-red-600'>Organization not found.</p>
                </CardContent>
            </Card>
        )
    }

    let summary: DashboardSummary | null = null
    let lastUpdated: string | null = null

    try {
        const rawSummary = await getDashboardSummary(orgId)
        // Ensure totalVehicles is present for kpi DashboardSummary
        summary = {
            ...rawSummary,
            totalVehicles:
                // Use activeVehicles as a proxy for total vehicles, since totalVehicles does not exist
                rawSummary.activeVehicles ?? 0,
        }
            lastUpdated = summary?.lastUpdated
                ? new Date(summary.lastUpdated).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })
            : null
    } catch {
        summary = null
        lastUpdated = null
    }

    return (
    <div className="flex flex-row items-baseline justify-between mb-6">        
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <Shield className="h-8 w-8" />
                <h1 className="text-3xl font-extrabold text-white">
                    Admin Dashboard
                </h1>
                <div className="flex items-center gap-2 bg-green-500/20 rounded-full px-3 py-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Live</span>
                </div>
            </div>
            <div className="text-sm text-white/90 font-medium">
                Real-time insights into fleet operations and performance
            </div>
            <div className="flex items-center space-x-2 text-sm text-white/70">
                <RefreshCw className="h-3 w-3" />
                <span>Last updated: {lastUpdated || "2 minutes ago"}</span>
            </div>
            </div>
        </div>
    )
}
