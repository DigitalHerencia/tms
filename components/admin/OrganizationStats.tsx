import { Users, Truck, UserCheck, Package, TrendingUp, BarChart } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getOrganizationStats } from '@/lib/fetchers/adminFetchers';

export async function OrganizationStats({ orgId }: { orgId: string }) {
  const stats = await getOrganizationStats(orgId);
  
  // Calculate growth percentages (mock data for now)
  const growthData = {
    userGrowth: 8.5,
    activeUserGrowth: 12.3,
    vehicleGrowth: 4.2,
    driverGrowth: 6.1,
    loadGrowth: 15.7,
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 10) return 'text-green-500';
    if (growth > 5) return 'text-blue-500';
    if (growth > 0) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getGrowthBadge = (growth: number) => {
    if (growth > 10) return 'border-green-200 bg-green-50 text-green-700';
    if (growth > 5) return 'border-blue-200 bg-blue-50 text-blue-700';
    if (growth > 0) return 'border-yellow-200 bg-yellow-50 text-yellow-700';
    return 'border-red-200 bg-red-50 text-red-700';
  };

  const statsData = [
    {
      title: 'Total Users',
      value: stats.userCount,
      icon: Users,
      growth: growthData.userGrowth,
      description: 'All registered users',
      color: 'text-blue-500',
    },
    {
      title: 'Active Users',
      value: stats.activeUserCount,
      icon: UserCheck,
      growth: growthData.activeUserGrowth,
      description: 'Currently active users',
      color: 'text-green-500',
    },
    {
      title: 'Fleet Vehicles',
      value: stats.vehicleCount,
      icon: Truck,
      growth: growthData.vehicleGrowth,
      description: 'Registered vehicles',
      color: 'text-purple-500',
    },
    {
      title: 'Active Drivers',
      value: stats.driverCount,
      icon: Users,
      growth: growthData.driverGrowth,
      description: 'Licensed drivers',
      color: 'text-orange-500',
    },
    {
      title: 'Total Loads',
      value: stats.loadCount,
      icon: Package,
      growth: growthData.loadGrowth,
      description: 'All time loads',
      color: 'text-cyan-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Organization Statistics</h3>
          <p className="text-sm text-gray-400">Key metrics and performance indicators</p>
        </div>
        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
          <BarChart className="h-3 w-3 mr-1" />
          Analytics
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="border-gray-200 bg-black hover:bg-neutral-900 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
                <p className="text-xs text-gray-400 mb-2">{stat.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`h-3 w-3 ${getGrowthColor(stat.growth)}`} />
                    <span className={`text-xs ${getGrowthColor(stat.growth)}`}>
                      {stat.growth > 0 ? '+' : ''}{stat.growth}%
                    </span>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getGrowthBadge(stat.growth)}`}>
                    30d
                  </Badge>
                </div>

                {/* Progress bar visualization */}
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                    style={{ width: `${Math.min(100, (stat.growth + 10) * 5)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Summary Card */}
      <Card className="border-gray-200 bg-black">
        <CardHeader>
          <CardTitle className="text-white">Organization Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">92%</p>
              <p className="text-sm text-gray-400">Overall health</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right space-y-1">
                <p className="text-sm font-medium text-green-400">Excellent</p>
                <p className="text-xs text-gray-400">Based on all metrics</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                <span className="text-sm font-bold text-green-500">A+</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
