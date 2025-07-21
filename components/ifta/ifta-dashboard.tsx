"use client"

import {
    BarChart,
    FileText,
    TrendingUp,
} from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { IftaPeriodData } from "@/types/ifta"

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

export function IftaDashboard() {
    const params = useParams()
    const orgId = params?.orgId as string
    const [quarter, setQuarter] = useState("2025-Q2")
    const [iftaData, setIftaData] = useState<IftaPeriodData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchIftaData = async () => {
            if (!orgId) return

            try {
                setLoading(true)
                const [quarterPart, yearPart] = quarter.split("-")

                if (!quarterPart || !yearPart) {
                    setError("Invalid quarter format")
                    setLoading(false)
                    return
                }
            } catch (err) {
                console.error("Error fetching IFTA data:", err)
                setError("Failed to load IFTA data")
                // Set default data for UI demonstration                // Parse quarter string (e.g., "2025-Q2") into { year: number, quarter: number }
                const [yearStr, qStr] = quarter.split("-")
                setIftaData({
                    period: {
                        year: Number(yearStr),
                        quarter: Number(qStr?.replace("Q", "") ?? "1"),
                    },
                    summary: {
                        totalMiles: 0,
                        totalGallons: 0,
                        averageMpg: 0,
                        totalFuelCost: 0,
                    },
                    trips: [],
                    fuelPurchases: [],
                    jurisdictionSummary: [],
                    report: null,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchIftaData()
    }, [orgId, quarter])

    const handleQuarterChange = (newQuarter: string) => {
        setQuarter(newQuarter)
    }

    return (
        <Container>
            <PageHeader title="IFTA ✱" description="Fuel tax reporting & distance logs" />
            <div className="flex flex-row flex-wrap items-center justify-between gap-6 mb-6">
                <div className="flex min-w-0 flex-col gap-1">
                    {/* ...existing code for header ... */}
                </div>
                <div className="flex w-full max-w-xs flex-col gap-2 sm:w-auto">
                    <Select value={quarter} onValueChange={handleQuarterChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Quarter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2025-Q1">2025 Q1</SelectItem>
                            <SelectItem value="2025-Q2">2025 Q2</SelectItem>
                            <SelectItem value="2025-Q3">2025 Q3</SelectItem>
                            <SelectItem value="2025-Q4">2025 Q4</SelectItem>
                            <SelectItem value="2024-Q1">2024 Q1</SelectItem>
                            <SelectItem value="2024-Q2">2024 Q2</SelectItem>
                            <SelectItem value="2024-Q3">2024 Q3</SelectItem>
                            <SelectItem value="2024-Q4">2024 Q4</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button size="sm" className="w-full">
                        <span className="flex w-full items-center justify-center">
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Report
                        </span>
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex h-32 items-center justify-center">
                    <div className="text-muted-foreground text-sm">Loading IFTA data...</div>
                </div>
            ) : error ? (
                <div className="flex h-32 items-center justify-center">
                    <div className="text-sm text-danger-500">{error}</div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* KPI Cards */}
                        <Card className="rounded-md shadow-card bg-card p-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Miles</CardTitle>
                                <BarChart className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{iftaData?.summary.totalMiles?.toLocaleString() || "0"}</div>
                                <p className="text-muted-foreground text-xs">For {quarter.replace("-", " ")}</p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-md shadow-card bg-card p-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Fuel Purchased</CardTitle>
                                <BarChart className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{iftaData?.summary.totalGallons?.toLocaleString() || "0"} gal</div>
                                <p className="text-muted-foreground text-xs">For {quarter.replace("-", " ")}</p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-md shadow-card bg-card p-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average MPG</CardTitle>
                                <TrendingUp className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{iftaData?.summary.averageMpg?.toFixed(2) || "0.00"}</div>
                                <p className="text-muted-foreground text-xs">For {quarter.replace("-", " ")}</p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-md shadow-card bg-card p-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Fuel Cost</CardTitle>
                                <FileText className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${iftaData?.summary.totalFuelCost?.toLocaleString() || "0.00"}</div>
                                <p className="text-muted-foreground text-xs">For {quarter.replace("-", " ")}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="rounded-md shadow-card bg-card p-4">
                            <CardHeader>
                                <CardTitle>Quarterly Filing Status</CardTitle>
                                <CardDescription>IFTA filing progress for {quarter.replace("-", " ")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* ...existing code... */}
                                <div className="space-y-8">
                                    {/* ...existing code... */}
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    {/* ...existing code... */}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-md shadow-card bg-card p-4">
                            <CardHeader>
                                <CardTitle>Jurisdiction Summary</CardTitle>
                                <CardDescription>Miles traveled and fuel purchased by jurisdiction</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* ...existing code... */}
                                <div className="rounded-md border overflow-x-auto whitespace-nowrap">
                                    {/* ...existing code... */}
                                </div>
                                <div className="mt-4 text-center">
                                    {/* ...existing code... */}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="trips" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="trips">Trip Data</TabsTrigger>
                            <TabsTrigger value="fuel">Fuel Purchases</TabsTrigger>
                            <TabsTrigger value="reports">Past Reports</TabsTrigger>
                        </TabsList>
                        <TabsContent value="trips">
                            <Card className="rounded-md shadow-card bg-card p-4">
                                <CardHeader>
                                    <CardTitle>Trip Data</CardTitle>
                                    <CardDescription>Record of trips for IFTA reporting</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* ...existing code... */}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="fuel">
                            <Card className="rounded-md shadow-card bg-card p-4">
                                <CardHeader>
                                    <CardTitle>Fuel Purchases</CardTitle>
                                    <CardDescription>Record of fuel purchases for IFTA reporting</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* ...existing code... */}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="reports">
                            <Card className="rounded-md shadow-card bg-card p-4">
                                <CardHeader>
                                    <CardTitle>Past IFTA Reports</CardTitle>
                                    <CardDescription>History of filed IFTA reports</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* ...existing code... */}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </Container>
    )
}

// validation function moved to lib/utils/ifta.ts
