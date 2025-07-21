import { Suspense } from "react"
import { BarChart3, CalendarIcon, FileText, MapPin } from "lucide-react"
import type { IFTAReport } from "@/components/ifta/ifta-columns"
import { IftaReportTableClient, IftaTripTableClient } from "@/components/ifta/ifta-tables"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getIftaDataForPeriod, getIftaReports } from "@/lib/fetchers/iftaFetchers"
import type { IftaPeriodData } from "@/types/ifta"

// Custom FuelIcon for summary card
function FuelIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M3 22h12" />
            <path d="M8 4v18" />
            <path d="M10 4v18" />
            <path d="M3 14h12" />
            <path d="M3 4h12" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 0 2 2" />
            <path d="M22 18h-5" />
        </svg>
    )
}

// Server-side period selection state (default to current quarter)
function getCurrentQuarterAndYear() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const quarter = Math.floor(month / 3) + 1
    return { quarter, year }
}


export default async function Page({
    params,
}: {
    params: Promise<{ orgId: string }>
}) {
    const { orgId } = await params
    const { quarter, year } = getCurrentQuarterAndYear()
    const period = `Q${quarter}`
    let iftaData: IftaPeriodData | null = null
    let reports: IFTAReport[] = []
    let error: string | null = null
    try {
        iftaData = await getIftaDataForPeriod(orgId, period, year.toString())
        const reportsRes = await getIftaReports(orgId, year)
        reports = (reportsRes?.data || []).map((r: any) => ({
            id: r.id,
            quarter: r.quarter ? `Q${r.quarter}` : "",
            year: r.year?.toString() ?? "",
            totalMiles: r.totalMiles ?? 0,
            totalGallons: r.totalGallons ?? 0,
            avgMpg:
                r.totalGallons && r.totalGallons > 0
                    ? Number(r.totalMiles) / Number(r.totalGallons)
                    : 0,
            status: r.status ?? "",
            dueDate: r.dueDate ? new Date(r.dueDate).toLocaleDateString() : "",
        }))
    } catch (e: any) {
        error = e?.message || "Failed to load IFTA data"
    }

    const summary = iftaData?.summary || {
        totalMiles: 0,
        totalGallons: 0,
        averageMpg: 0,
        jurisdictions: 0,
    }
    const jurisdictionCount = Array.isArray(iftaData?.jurisdictionSummary)
        ? iftaData.jurisdictionSummary.length
        : 0

    return (
        <div className="min-h-screen space-y-6 bg-neutral-900 p-6 pt-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-white">IFTA Management</h1>
                        <span className="border border-blue-200 bg-blue-50 text-blue-700 rounded px-2 py-1 text-xs font-semibold">Compliance</span>
                    </div>
                    <p className="text-gray-400">
                        Track and manage International Fuel Tax Agreement reporting
                    </p>
                </div>
                <div className="flex flex-row gap-4 mt-4 md:mt-0">
                    <Button size="sm" className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800 flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {`Period: ${period} ${year}`}
                    </Button>
                    <Button size="sm" className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Generate Report
                    </Button>
                </div>
            </div>

            {/* Error State */}
            {error ? (
                <div className="text-sm font-medium text-red-500">{error}</div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-black border border-gray-200">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-medium text-white">Total Miles ({period} {year})</CardTitle>
                                <MapPin className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{summary.totalMiles?.toLocaleString() ?? 0}</div>
                                <p className="text-xs text-blue-400">&nbsp;</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-black border border-gray-200">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-medium text-white">Total Gallons ({period} {year})</CardTitle>
                                <FuelIcon className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{summary.totalGallons?.toLocaleString() ?? 0}</div>
                                <p className="text-xs text-blue-400">&nbsp;</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-black border border-gray-200">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-medium text-white">Average MPG</CardTitle>
                                <BarChart3 className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{summary.averageMpg?.toFixed(2) ?? 0}</div>
                                <p className="text-xs text-blue-400">&nbsp;</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-black border border-gray-200">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-medium text-white">Jurisdictions</CardTitle>
                                <MapPin className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{jurisdictionCount}</div>
                                <p className="text-xs text-blue-400">States/provinces this period</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs Section */}
                    <Tabs defaultValue="trips" className="w-full mt-8">
                        <TabsList className="grid w-auto grid-cols-2 bg-black border border-gray-200">
                            <TabsTrigger value="trips" className="flex items-center gap-2 text-white data-[state=active]:bg-blue-600">
                                <MapPin className="h-4 w-4" />
                                Trip Records
                            </TabsTrigger>
                            <TabsTrigger value="reports" className="flex items-center gap-2 text-white data-[state=active]:bg-blue-600">
                                <FileText className="h-4 w-4" />
                                Quarterly Reports
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="trips" className="mt-6 space-y-6">
                            <Card className="bg-black border border-gray-200">
                                <CardHeader>
                                    <CardTitle>
                                        <h1 className="text-2xl font-medium flex items-center gap-2 text-white">
                                            <MapPin className="h-6 w-6" />
                                            IFTA Trip Records
                                        </h1>
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Track interstate travel for IFTA reporting and tax calculations.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="overflow-x-auto">
                                    <Suspense fallback={<div>Loading IFTA trip data...</div>}>
                                        <IftaTripTableClient
                                            data={
                                                iftaData?.trips.map(trip => ({
                                                    id: trip.id,
                                                    date: trip.date.toISOString().split("T")[0] ?? trip.date.toISOString(),
                                                    driver: trip.driver || "N/A",
                                                    vehicle: trip.vehicle.unitNumber,
                                                    startLocation: trip.startLocation || "N/A",
                                                    endLocation: trip.endLocation || "N/A",
                                                    miles: trip.miles || trip.distance,
                                                    gallons: trip.gallons || 0,
                                                    state: trip.state || trip.jurisdiction,
                                                })) || []
                                            }
                                        />
                                    </Suspense>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="reports" className="mt-6 space-y-6">
                            <Card className="bg-black border border-gray-200">
                                <CardHeader>
                                    <CardTitle>
                                        <h1 className="text-2xl font-medium flex items-center gap-2 text-white">
                                            <FileText className="h-6 w-6" />
                                            IFTA Quarterly Reports
                                        </h1>
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Manage and submit your quarterly IFTA tax reports.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="overflow-x-auto">
                                    <Suspense fallback={<div>Loading IFTA reports...</div>}>
                                        <IftaReportTableClient data={reports} />
                                    </Suspense>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    )
}
