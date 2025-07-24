

"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsData, TimeSeriesData } from "@/types/analytics"
import { AnimatePresence, motion } from "framer-motion"
import {
    Activity,
    BarChart3,
    Eye,
    TrendingDown,
    TrendingUp,
    Zap,
} from "lucide-react"
import { useState } from "react"
import { useInView } from "react-intersection-observer"
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    Brush,
    CartesianGrid,
    Cell,
    ComposedChart,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

interface InteractiveChartsProps {
    data: AnalyticsData
    timeRange: string
    orgId: string
}

interface DrilldownData {
    type: "route" | "driver" | "vehicle" | "customer"
    id: string
    name: string
    data: any[]
}

const CHART_COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7c7c",
    "#8dd1e1",
    "#d084d0",
    "#ffb347",
    "#87ceeb",
    "#dda0dd",
    "#98fb98",
]

const TREND_COLORS = {
    positive: "#10b981",
    negative: "#ef4444",
    neutral: "#6b7280",
}

export function InteractiveCharts({
    data,
    timeRange,
    orgId,
}: InteractiveChartsProps) {
    const [selectedChart, setSelectedChart] = useState<string>("overview")
    const [drilldownData, setDrilldownData] = useState<DrilldownData | null>(
        null
    )
    const [chartType, setChartType] = useState<
        "line" | "area" | "bar" | "composed"
    >("line")
    const [showPredictions, setShowPredictions] = useState(false)
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
    // Generate predictive analytics data
    const generatePredictions = (historicalData: TimeSeriesData[]) => {
        if (historicalData.length < 3) return []

        const lastThreePoints = historicalData.slice(-3)
        const firstPoint = lastThreePoints[0]
        const lastPoint = lastThreePoints[2]

        if (!firstPoint || !lastPoint) return []

        const trend = (lastPoint.value - firstPoint.value) / 2
        const predictions: { date: string; value: number; isPrediction: boolean }[] = []

        for (let i = 1; i <= 7; i++) {
            const lastDate = new Date(lastPoint.date)
            lastDate.setDate(lastDate.getDate() + i)

            predictions.push({
                date:
                    lastDate.toISOString().split("T")[0] ??
                    lastDate.toISOString(),
                value: lastPoint.value + trend * i,
                isPrediction: true,
            })
        }

        return predictions
    }

    // Handle chart drill-down
    const handleDrillDown = (chartType: string, dataPoint: any) => {
        if (!dataPoint) return

        // Mock drill-down data generation
        const drilldownInfo: DrilldownData = {
            type: "route",
            id: dataPoint.id || "route-1",
            name: dataPoint.name || "Route Details",
            data: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                value: Math.floor(Math.random() * 1000) + 500,
                loads: Math.floor(Math.random() * 20) + 5,
                revenue: Math.floor(Math.random() * 50000) + 10000,
            })),
        }

        setDrilldownData(drilldownInfo)
    }

    // Calculate trend indicators
    const calculateTrend = (current: number, previous: number) => {
        const change = ((current - previous) / previous) * 100
        return {
            percentage: Math.abs(change),
            direction:
                change > 0 ? "positive" : change < 0 ? "negative" : "neutral",
            arrow:
                change > 0 ? TrendingUp : change < 0 ? TrendingDown : Activity,
        }
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg'
                >
                    <p className='font-semibold text-gray-900 dark:text-gray-100'>
                        {label}
                    </p>
                    {payload.map((entry: any, index: number) => (
                        <div
                            key={index}
                            className='flex items-center gap-2 mt-1'
                        >
                            <div
                                className='w-3 h-3 rounded-full'
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className='text-sm text-gray-600 dark:text-gray-300'>
                                {entry.name}: {entry.value.toLocaleString()}
                                {entry.payload.isPrediction && (
                                    <Badge
                                        variant='outline'
                                        className='ml-2 text-xs'
                                    >
                                        Predicted
                                    </Badge>
                                )}
                            </span>
                        </div>
                    ))}
                </motion.div>
            )
        }
        return null
    }

    const renderChart = () => {
        const chartData = data.timeSeriesData || []
        const predictions = showPredictions
            ? generatePredictions(chartData)
            : []
        const combinedData = [...chartData, ...predictions]

        switch (chartType) {
            case "area":
                return (
                    <AreaChart data={combinedData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                            type='monotone'
                            dataKey='value'
                            stroke={CHART_COLORS[0]}
                            fill={CHART_COLORS[0]}
                            fillOpacity={0.3}
                            strokeWidth={2}
                        />
                        {showPredictions && (
                            <Area
                                type='monotone'
                                dataKey='value'
                                stroke={CHART_COLORS[1]}
                                fill={CHART_COLORS[1]}
                                fillOpacity={0.1}
                                strokeDasharray='5 5'
                                data={predictions}
                            />
                        )}
                        <Brush
                            dataKey='date'
                            height={30}
                        />
                    </AreaChart>
                )

            case "bar":
                return (
                    <BarChart
                        data={combinedData}
                    
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey='value'
                            fill={CHART_COLORS[0]}
                            radius={[4, 4, 0, 0]}
                        />
                        <Brush
                            dataKey='date'
                            height={30}
                        />
                    </BarChart>
                )

            case "composed":
                return (
                    <ComposedChart data={combinedData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' />
                        <YAxis yAxisId='left' />
                        <YAxis
                            yAxisId='right'
                            orientation='right'
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                            yAxisId='left'
                            type='monotone'
                            dataKey='revenue'
                            fill={CHART_COLORS[2]}
                            fillOpacity={0.3}
                            stroke={CHART_COLORS[2]}
                        />
                        <Bar
                            yAxisId='right'
                            dataKey='loads'
                            fill={CHART_COLORS[0]}
                        />
                        <Line
                            yAxisId='left'
                            type='monotone'
                            dataKey='value'
                            stroke={CHART_COLORS[1]}
                            strokeWidth={3}
                        />
                        <Brush
                            dataKey='date'
                            height={30}
                        />
                    </ComposedChart>
                )

            default:
                return (
                    <LineChart
                        data={combinedData}
                        
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type='monotone'
                            dataKey='value'
                            stroke={CHART_COLORS[0]}
                            strokeWidth={3}
                            dot={{
                                fill: CHART_COLORS[0],
                                strokeWidth: 2,
                                r: 4,
                            }}
                            activeDot={{ r: 6 }}
                        />
                        {showPredictions && (
                            <Line
                                type='monotone'
                                dataKey='value'
                                stroke={CHART_COLORS[1]}
                                strokeWidth={2}
                                strokeDasharray='5 5'
                                dot={false}
                                data={predictions}
                            />
                        )}
                        <Brush
                            dataKey='date'
                            height={30}
                        />
                    </LineChart>
                )
        }
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className='space-y-6'
        >
            {/* Chart Controls */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <CardTitle className='flex items-center gap-2'>
                            <BarChart3 className='h-5 w-5' />
                            Interactive Analytics Dashboard
                        </CardTitle>
                        <div className='flex items-center gap-2'>
                            <Select
                                value={chartType}
                                onValueChange={(value: any) =>
                                    setChartType(value)
                                }
                            >
                                <SelectTrigger className='w-32'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='line'>
                                        Line Chart
                                    </SelectItem>
                                    <SelectItem value='area'>
                                        Area Chart
                                    </SelectItem>
                                    <SelectItem value='bar'>
                                        Bar Chart
                                    </SelectItem>
                                    <SelectItem value='composed'>
                                        Combined
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant={
                                    showPredictions ? "default" : "outline"
                                }
                                size='sm'
                                onClick={() =>
                                    setShowPredictions(!showPredictions)
                                }
                                className='flex items-center gap-1'
                            >
                                <Zap className='h-4 w-4' />
                                Predictions
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs
                        value={selectedChart}
                        onValueChange={setSelectedChart}
                    >
                        <TabsList className='grid w-full grid-cols-4'>
                            <TabsTrigger value='overview'>Overview</TabsTrigger>
                            <TabsTrigger value='performance'>
                                Performance
                            </TabsTrigger>
                            <TabsTrigger value='financial'>
                                Financial
                            </TabsTrigger>
                            <TabsTrigger value='operational'>
                                Operational
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value='overview'
                            className='mt-6'
                        >
                            <ResponsiveContainer
                                width='100%'
                                height={400}
                            >
                                {renderChart()}
                            </ResponsiveContainer>
                        </TabsContent>

                        <TabsContent
                            value='performance'
                            className='mt-6'
                        >
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                <ResponsiveContainer
                                    width='100%'
                                    height={300}
                                >
                                    <PieChart>
                                        <Pie
                                            data={[
                                                {
                                                    name: "On Time",
                                                    value: 85,
                                                    color: TREND_COLORS.positive,
                                                },
                                                {
                                                    name: "Delayed",
                                                    value: 12,
                                                    color: TREND_COLORS.negative,
                                                },
                                                {
                                                    name: "Cancelled",
                                                    value: 3,
                                                    color: TREND_COLORS.neutral,
                                                },
                                            ]}
                                            cx='50%'
                                            cy='50%'
                                            outerRadius={80}
                                            dataKey='value'
                                        >
                                            {[
                                                {
                                                    name: "On Time",
                                                    value: 85,
                                                    color: TREND_COLORS.positive,
                                                },
                                                {
                                                    name: "Delayed",
                                                    value: 12,
                                                    color: TREND_COLORS.negative,
                                                },
                                                {
                                                    name: "Cancelled",
                                                    value: 3,
                                                    color: TREND_COLORS.neutral,
                                                },
                                            ].map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className='space-y-4'>
                                    <h3 className='text-lg font-semibold'>
                                        Performance Metrics
                                    </h3>
                                    {[
                                        {
                                            label: "Vehicle Utilization",
                                            value: 78,
                                            target: 85,
                                            trend: "positive",
                                        },
                                        {
                                            label: "Driver Efficiency",
                                            value: 92,
                                            target: 90,
                                            trend: "positive",
                                        },
                                        {
                                            label: "Fuel Efficiency",
                                            value: 6.2,
                                            target: 6.0,
                                            trend: "negative",
                                            unit: "mpg",
                                        },
                                    ].map((metric, index) => {
                                        const trend = calculateTrend(
                                            metric.value,
                                            metric.target
                                        )
                                        const Icon = trend.arrow

                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: index * 0.1,
                                                }}
                                                className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
                                            >
                                                <div>
                                                    <p className='font-medium'>
                                                        {metric.label}
                                                    </p>
                                                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                        Target: {metric.target}
                                                        {metric.unit || "%"}
                                                    </p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <span className='text-lg font-bold'>
                                                        {metric.value}
                                                        {metric.unit || "%"}
                                                    </span>
                                                    <Icon
                                                        className={`h-4 w-4 ${
                                                            trend.direction ===
                                                            "positive"
                                                                ? "text-green-500"
                                                                : trend.direction ===
                                                                  "negative"
                                                                ? "text-red-500"
                                                                : "text-gray-500"
                                                        }`}
                                                    />
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent
                            value='financial'
                            className='mt-6'
                        >
                            <ResponsiveContainer
                                width='100%'
                                height={400}
                            >
                                <ComposedChart data={data.timeSeriesData || []}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='date' />
                                    <YAxis yAxisId='left' />
                                    <YAxis
                                        yAxisId='right'
                                        orientation='right'
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Area
                                        yAxisId='left'
                                        type='monotone'
                                        dataKey='revenue'
                                        fill={TREND_COLORS.positive}
                                        fillOpacity={0.3}
                                        stroke={TREND_COLORS.positive}
                                    />
                                    <Line
                                        yAxisId='right'
                                        type='monotone'
                                        dataKey='costs'
                                        stroke={TREND_COLORS.negative}
                                        strokeWidth={2}
                                    />
                                    <Line
                                        yAxisId='left'
                                        type='monotone'
                                        dataKey='profit'
                                        stroke={CHART_COLORS[2]}
                                        strokeWidth={3}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </TabsContent>

                        <TabsContent
                            value='operational'
                            className='mt-6'
                        >
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                                {/* Route Performance */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className='text-sm'>
                                            Top Routes
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer
                                            width='100%'
                                            height={200}
                                        >
                                            <BarChart
                                                data={[
                                                    {
                                                        name: "Route A",
                                                        value: 45,
                                                    },
                                                    {
                                                        name: "Route B",
                                                        value: 38,
                                                    },
                                                    {
                                                        name: "Route C",
                                                        value: 32,
                                                    },
                                                    {
                                                        name: "Route D",
                                                        value: 28,
                                                    },
                                                ]}
                                                layout='horizontal'
                                            >
                                                <XAxis type='number' />
                                                <YAxis
                                                    dataKey='name'
                                                    type='category'
                                                />
                                                <Tooltip />
                                                <Bar
                                                    dataKey='value'
                                                    fill={CHART_COLORS[0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                {/* Driver Performance */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className='text-sm'>
                                            Driver Scores
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer
                                            width='100%'
                                            height={200}
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        {
                                                            name: "Excellent",
                                                            value: 12,
                                                            color: TREND_COLORS.positive,
                                                        },
                                                        {
                                                            name: "Good",
                                                            value: 18,
                                                            color: CHART_COLORS[2],
                                                        },
                                                        {
                                                            name: "Average",
                                                            value: 8,
                                                            color: TREND_COLORS.neutral,
                                                        },
                                                        {
                                                            name: "Needs Improvement",
                                                            value: 2,
                                                            color: TREND_COLORS.negative,
                                                        },
                                                    ]}
                                                    cx='50%'
                                                    cy='50%'
                                                    outerRadius={60}
                                                    dataKey='value'
                                                >
                                                    {[
                                                        {
                                                            name: "Excellent",
                                                            value: 12,
                                                            color: TREND_COLORS.positive,
                                                        },
                                                        {
                                                            name: "Good",
                                                            value: 18,
                                                            color: CHART_COLORS[2],
                                                        },
                                                        {
                                                            name: "Average",
                                                            value: 8,
                                                            color: TREND_COLORS.neutral,
                                                        },
                                                        {
                                                            name: "Needs Improvement",
                                                            value: 2,
                                                            color: TREND_COLORS.negative,
                                                        },
                                                    ].map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                {/* Vehicle Status */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className='text-sm'>
                                            Fleet Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='space-y-3'>
                                            {[
                                                {
                                                    status: "Active",
                                                    count: 28,
                                                    color: TREND_COLORS.positive,
                                                },
                                                {
                                                    status: "In Transit",
                                                    count: 15,
                                                    color: CHART_COLORS[2],
                                                },
                                                {
                                                    status: "Maintenance",
                                                    count: 3,
                                                    color: TREND_COLORS.negative,
                                                },
                                                {
                                                    status: "Idle",
                                                    count: 7,
                                                    color: TREND_COLORS.neutral,
                                                },
                                            ].map((item, index) => (
                                                <div
                                                    key={index}
                                                    className='flex items-center justify-between'
                                                >
                                                    <div className='flex items-center gap-2'>
                                                        <div
                                                            className='w-3 h-3 rounded-full'
                                                            style={{
                                                                backgroundColor:
                                                                    item.color,
                                                            }}
                                                        />
                                                        <span className='text-sm'>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                    <Badge variant='outline'>
                                                        {item.count}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Drill-down Modal */}
            <AnimatePresence>
                {drilldownData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
                        onClick={() => setDrilldownData(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-auto'
                            onClick={e => e.stopPropagation()}
                        >
                            <div className='flex items-center justify-between mb-4'>
                                <h3 className='text-xl font-bold flex items-center gap-2'>
                                    <Eye className='h-5 w-5' />
                                    {drilldownData.name} - Detailed View
                                </h3>
                                <Button
                                    variant='outline'
                                    onClick={() => setDrilldownData(null)}
                                >
                                    Close
                                </Button>
                            </div>

                            <ResponsiveContainer
                                width='100%'
                                height={400}
                            >
                                <LineChart data={drilldownData.data}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='date' />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line
                                        type='monotone'
                                        dataKey='value'
                                        stroke={CHART_COLORS[0]}
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type='monotone'
                                        dataKey='loads'
                                        stroke={CHART_COLORS[1]}
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
