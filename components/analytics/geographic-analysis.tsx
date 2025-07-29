'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Navigation,
  Route,
  Users,
  Truck,
  DollarSign,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import type { AnalyticsData, RouteAnalytics, HeatmapDataPoint } from '@/types/analytics';

interface GeographicAnalysisProps {
  data: AnalyticsData;
  orgId: string;
  routes: RouteAnalytics[];
  heatmap: HeatmapDataPoint[];
}

export function GeographicAnalysis({ data, orgId, routes, heatmap }: GeographicAnalysisProps) {
  const [selectedView, setSelectedView] = useState<'routes' | 'heatmap' | 'optimization'>('routes');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'loads' | 'utilization'>(
    'revenue',
  );
  const [selectedRoute, setSelectedRoute] = useState<RouteAnalytics | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // Center of US

  // Calculate route efficiency metrics
  const routeMetrics = useMemo(() => {
    return routes.map((route) => ({
      ...route,
      efficiency: (route.revenue / route.fuelCost).toFixed(2),
      revenuePerMile: (route.revenue / route.distance).toFixed(2),
      profitability: route.onTimeRate > 90 ? 'high' : route.onTimeRate > 80 ? 'medium' : 'low',
    }));
  }, [routes]);

  // Calculate geographic insights
  const geoInsights = useMemo(() => {
    const totalRevenue = heatmap.reduce((sum, city) => sum + city.revenue, 0);
    const avgUtilization =
      heatmap.reduce((sum, city) => sum + city.utilization, 0) / heatmap.length;

    const topPerformingCity = heatmap.reduce((max, city) =>
      city.revenue > max.revenue ? city : max,
    );

    const underutilizedCities = heatmap.filter((city) => city.utilization < 70);

    return {
      totalRevenue,
      avgUtilization,
      topPerformingCity,
      underutilizedCities,
      totalCities: heatmap.length,
      totalRoutes: routes.length,
    };
  }, [heatmap, routes]);

  // Simple SVG map visualization (in real implementation, use Google Maps or Mapbox)
  const MapVisualization = () => (
    <div className="relative bg-blue-50 dark:bg-blue-900 rounded-lg p-4 h-96 overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 800 400" className="border rounded">
        {/* Background */}
        <rect width="800" height="400" fill="#f0f9ff" className="dark:fill-gray-800" />

        {/* Route lines */}
        {selectedView === 'routes' &&
          routeMetrics.map((route, index) => {
            const x1 = ((route.origin.lng + 130) / 60) * 800;
            const y1 = ((50 - route.origin.lat) / 25) * 400;
            const x2 = ((route.destination.lng + 130) / 60) * 800;
            const y2 = ((50 - route.destination.lat) / 25) * 400;

            return (
              <g key={route.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={
                    route.profitability === 'high'
                      ? '#10b981'
                      : route.profitability === 'medium'
                        ? '#f59e0b'
                        : '#ef4444'
                  }
                  strokeWidth={Math.max(2, route.frequency / 10)}
                  strokeDasharray={route.onTimeRate < 85 ? '5,5' : 'none'}
                  className="cursor-pointer hover:stroke-width-4 transition-all"
                  onClick={() => setSelectedRoute(route)}
                />
                {/* Origin marker */}
                <circle
                  cx={x1}
                  cy={y1}
                  r="6"
                  fill="#3b82f6"
                  className="cursor-pointer hover:r-8 transition-all"
                />
                {/* Destination marker */}
                <circle
                  cx={x2}
                  cy={y2}
                  r="6"
                  fill="#ef4444"
                  className="cursor-pointer hover:r-8 transition-all"
                />
              </g>
            );
          })}

        {/* Heatmap circles */}
        {selectedView === 'heatmap' &&
          heatmap.map((city, index) => {
            const x = ((city.lng + 130) / 60) * 800;
            const y = ((50 - city.lat) / 25) * 400;
            const value =
              selectedMetric === 'revenue'
                ? city.revenue
                : selectedMetric === 'loads'
                  ? city.loads * 1000
                  : city.utilization * 1000;
            const maxValue = Math.max(
              ...heatmap.map((c) =>
                selectedMetric === 'revenue'
                  ? c.revenue
                  : selectedMetric === 'loads'
                    ? c.loads * 1000
                    : c.utilization * 1000,
              ),
            );
            const radius = 8 + (value / maxValue) * 20;
            const opacity = 0.3 + (value / maxValue) * 0.7;

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={
                    selectedMetric === 'revenue'
                      ? '#10b981'
                      : selectedMetric === 'loads'
                        ? '#3b82f6'
                        : '#f59e0b'
                  }
                  opacity={opacity}
                  className="cursor-pointer hover:opacity-100 transition-opacity"
                />
                <text
                  x={x}
                  y={y + radius + 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill="currentColor"
                  className="font-medium"
                >
                  {city.city}
                </text>
              </g>
            );
          })}

        {/* Legend */}
        <g transform="translate(20, 20)">
          <rect width="150" height="80" fill="white" fillOpacity="0.9" rx="4" />
          {selectedView === 'routes' && (
            <>
              <text x="10" y="20" fontSize="12" fontWeight="bold" fill="currentColor">
                Route Performance
              </text>
              <line x1="10" y1="30" x2="30" y2="30" stroke="#10b981" strokeWidth="3" />
              <text x="35" y="35" fontSize="10" fill="currentColor">
                High Profit
              </text>
              <line x1="10" y1="45" x2="30" y2="45" stroke="#f59e0b" strokeWidth="3" />
              <text x="35" y="50" fontSize="10" fill="currentColor">
                Medium Profit
              </text>
              <line
                x1="10"
                y1="60"
                x2="30"
                y2="60"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="5,5"
              />
              <text x="35" y="65" fontSize="10" fill="currentColor">
                Low Profit/Delayed
              </text>
            </>
          )}
          {selectedView === 'heatmap' && (
            <>
              <text x="10" y="20" fontSize="12" fontWeight="bold" fill="currentColor">
                Activity Level
              </text>
              <circle
                cx="20"
                cy="35"
                r="8"
                fill={
                  selectedMetric === 'revenue'
                    ? '#10b981'
                    : selectedMetric === 'loads'
                      ? '#3b82f6'
                      : '#f59e0b'
                }
                opacity="0.5"
              />
              <text x="35" y="40" fontSize="10" fill="currentColor">
                Low
              </text>
              <circle
                cx="20"
                cy="50"
                r="12"
                fill={
                  selectedMetric === 'revenue'
                    ? '#10b981'
                    : selectedMetric === 'loads'
                      ? '#3b82f6'
                      : '#f59e0b'
                }
                opacity="0.8"
              />
              <text x="35" y="55" fontSize="10" fill="currentColor">
                High
              </text>
            </>
          )}
        </g>
      </svg>

      {/* Route details popup */}
      {selectedRoute && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-lg min-w-64"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">Route Details</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRoute(null)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">From:</span> {selectedRoute.origin.city},{' '}
              {selectedRoute.origin.state}
            </div>
            <div>
              <span className="font-medium">To:</span> {selectedRoute.destination.city},{' '}
              {selectedRoute.destination.state}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Frequency</span>
                <p className="font-medium">{selectedRoute.frequency} loads</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                <p className="font-medium">${selectedRoute.revenue.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">On-Time Rate</span>
                <p className="font-medium">{selectedRoute.onTimeRate}%</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Avg Time</span>
                <p className="font-medium">{selectedRoute.avgDeliveryTime}h</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Geographic Insights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-lg font-bold">${geoInsights.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Routes</p>
                <p className="text-lg font-bold">{geoInsights.totalRoutes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Coverage Cities</p>
                <p className="text-lg font-bold">{geoInsights.totalCities}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Utilization</p>
                <p className="text-lg font-bold">{geoInsights.avgUtilization.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Geographic Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Geographic Analysis
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedView} onValueChange={(value: any) => setSelectedView(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routes">Routes</SelectItem>
                  <SelectItem value="heatmap">Heatmap</SelectItem>
                  <SelectItem value="optimization">Optimization</SelectItem>
                </SelectContent>
              </Select>

              {selectedView === 'heatmap' && (
                <Select
                  value={selectedMetric}
                  onValueChange={(value: any) => setSelectedMetric(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="loads">Load Count</SelectItem>
                    <SelectItem value="utilization">Utilization</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedView}
            onValueChange={(value) =>
              setSelectedView(value as 'routes' | 'heatmap' | 'optimization')
            }
          >
            <TabsContent value="routes">
              <div className="space-y-4">
                <MapVisualization />

                {/* Route Performance Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Route</th>
                        <th className="text-left p-2">Frequency</th>
                        <th className="text-left p-2">Revenue</th>
                        <th className="text-left p-2">On-Time Rate</th>
                        <th className="text-left p-2">Efficiency</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routeMetrics.map((route) => (
                        <tr
                          key={route.id}
                          className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="p-2">
                            <div>
                              <p className="font-medium text-sm">
                                {route.origin.city} → {route.destination.city}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {route.distance} miles
                              </p>
                            </div>
                          </td>
                          <td className="p-2">{route.frequency} loads</td>
                          <td className="p-2">${route.revenue.toLocaleString()}</td>
                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              {route.onTimeRate}%
                              {route.onTimeRate >= 90 ? (
                                <TrendingUp className="h-3 w-3 text-green-500" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-500" />
                              )}
                            </div>
                          </td>
                          <td className="p-2">${route.efficiency}</td>
                          <td className="p-2">
                            <Badge
                              variant={
                                route.profitability === 'high'
                                  ? 'default'
                                  : route.profitability === 'medium'
                                    ? 'secondary'
                                    : 'destructive'
                              }
                            >
                              {route.profitability}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="heatmap">
              <div className="space-y-4">
                <MapVisualization />

                {/* City Performance Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {heatmap
                    .sort((a, b) => b[selectedMetric] - a[selectedMetric])
                    .map((city, index) => (
                      <Card key={index} className="relative">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">
                              {city.city}, {city.state}
                            </h4>
                            {index < 3 && (
                              <Badge variant="secondary" className="text-xs">
                                Top {index + 1}
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Loads
                              </span>
                              <span className="font-medium">{city.loads}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Revenue
                              </span>
                              <span className="font-medium">${city.revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Utilization
                              </span>
                              <span
                                className={`font-medium ${
                                  city.utilization >= 80
                                    ? 'text-green-500'
                                    : city.utilization >= 70
                                      ? 'text-yellow-500'
                                      : 'text-red-500'
                                }`}
                              >
                                {city.utilization}%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="optimization">
              <div className="space-y-6">
                {/* Optimization Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Optimization Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-l-4 border-yellow-500 pl-4">
                        <h4 className="font-medium">Underutilized Cities</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {geoInsights.underutilizedCities.length} cities below 70% utilization
                        </p>
                        <div className="space-y-1">
                          {geoInsights.underutilizedCities.map((city, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {city.city}, {city.state}
                              </span>
                              <span className="text-red-500">{city.utilization}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium">Route Optimization</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Consider consolidating low-frequency routes or adjusting schedules
                        </p>
                      </div>

                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-medium">Expansion Opportunities</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          High-performing routes suggest potential for similar regional expansion
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Performance Leaders
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-medium">Top Revenue City</h4>
                        <p className="text-lg font-bold">
                          {geoInsights.topPerformingCity.city},{' '}
                          {geoInsights.topPerformingCity.state}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ${geoInsights.topPerformingCity.revenue.toLocaleString()} revenue
                        </p>
                      </div>

                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium">Most Efficient Route</h4>
                        <p className="text-sm">
                          {routeMetrics.find((r) => r.profitability === 'high')?.origin.city} →{' '}
                          {routeMetrics.find((r) => r.profitability === 'high')?.destination.city}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {routeMetrics.find((r) => r.profitability === 'high')?.onTimeRate}%
                          on-time rate
                        </p>
                      </div>

                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium">Growth Potential</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Based on current trends, consider expanding successful route patterns
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Optimization Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Optimization Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">
                          {((geoInsights.totalRevenue / 1000000) * 1.15).toFixed(1)}M
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Potential Revenue (+15%)
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">
                          {Math.round(geoInsights.avgUtilization * 1.12)}%
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Target Utilization (+12%)
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-500">
                          {geoInsights.underutilizedCities.length * 8}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Additional Weekly Loads
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
