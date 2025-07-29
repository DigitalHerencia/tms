'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AnalyticsData } from '@/types/analytics';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import type { PanInfo } from 'framer-motion';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  BookmarkPlus,
  Download,
  Filter,
  Maximize2,
  Menu,
  MoreVertical,
  Share,
  Smartphone,
  TrendingDown,
  TrendingUp,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
);

interface MobileAnalyticsProps {
  data: AnalyticsData;
  orgId: string;
  timeRange: string;
}

interface OfflineData {
  timestamp: number;
  data: AnalyticsData;
}

export function MobileAnalytics({ data, orgId, timeRange }: MobileAnalyticsProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

  // PWA Installation handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache data for offline use
  useEffect(() => {
    if (isOnline && data) {
      const cachedData: OfflineData = {
        timestamp: Date.now(),
        data,
      };

      // Store in localStorage for offline access
      const existingCache = localStorage.getItem('analytics-cache');
      const cache = existingCache ? JSON.parse(existingCache) : [];
      cache.unshift(cachedData);

      // Keep only last 10 cache entries
      const trimmedCache = cache.slice(0, 10);
      localStorage.setItem('analytics-cache', JSON.stringify(trimmedCache));
      setOfflineData(trimmedCache);
    }
  }, [data, isOnline]);

  // Load cached data when offline
  useEffect(() => {
    if (!isOnline) {
      const cachedData = localStorage.getItem('analytics-cache');
      if (cachedData) {
        setOfflineData(JSON.parse(cachedData));
      }
    }
  }, [isOnline]);

  // Install PWA
  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setInstallPrompt(null);
    }
  };

  // Handle swipe gestures
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.x > 0 || velocity > 500) {
        setSwipeDirection('right');
        // Navigate to previous tab
        const tabs = ['overview', 'performance', 'financial', 'operational'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
          const prevTab = tabs[currentIndex - 1];
          if (prevTab) {
            setActiveTab(prevTab);
          }
        }
      } else {
        setSwipeDirection('left');
        // Navigate to next tab
        const tabs = ['overview', 'performance', 'financial', 'operational'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
          const nextTab = tabs[currentIndex + 1];
          if (nextTab) {
            setActiveTab(nextTab);
          }
        }
      }
    }

    // Reset position
    x.set(0);
    setTimeout(() => setSwipeDirection(null), 300);
  };

  // Touch-optimized chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 45,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 10,
          },
          callback: function (value: any) {
            return value.toLocaleString();
          },
        },
      },
    },
    elements: {
      point: {
        radius: 6,
        hoverRadius: 8,
        hitRadius: 15, // Larger hit area for mobile
      },
      line: {
        tension: 0.4,
      },
    },
  };

  // Generate chart data
  const chartData = useMemo(() => {
    const timeSeriesData = data?.timeSeriesData || [];
    const labels = timeSeriesData.map((item: any) =>
      new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    );

    return {
      line: {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: timeSeriesData.map((item: any) => item.value),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      bar: {
        labels,
        datasets: [
          {
            label: 'Loads',
            data: timeSeriesData.map((item: any) => Math.floor(item.value / 1000)),
            backgroundColor: '#10b981',
            borderRadius: 4,
          },
        ],
      },
      doughnut: {
        labels: ['Completed', 'In Transit', 'Pending', 'Cancelled'],
        datasets: [
          {
            data: [65, 25, 8, 2],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
            borderWidth: 0,
            cutout: '60%',
          },
        ],
      },
    };
  }, [data]);

  // Quick action cards
  const quickActions = [
    {
      icon: <Filter className="h-5 w-5" />,
      label: 'Filters',
      action: () => {},
    },
    {
      icon: <Share className="h-5 w-5" />,
      label: 'Share',
      action: () => {},
    },
    {
      icon: <Download className="h-5 w-5" />,
      label: 'Export',
      action: () => {},
    },
    {
      icon: <BookmarkPlus className="h-5 w-5" />,
      label: 'Save',
      action: () => {},
    },
  ];

  // Metric cards with touch-friendly design
  const MetricCard = ({ title, value, change, icon, index }: any) => (
    <motion.div
      style={{ x, opacity }}
      drag="x"
      dragConstraints={{ left: -100, right: 100 }}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={() => setSelectedCard(selectedCard === index ? null : index)}
    >
      <Card
        className={`${
          selectedCard === index ? 'ring-2 ring-blue-500' : ''
        } transition-all duration-200`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <h3 className="text-sm font-medium">{title}</h3>
            </div>
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold">{value}</p>
            <div
              className={`flex items-center gap-1 text-sm ${
                change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change.startsWith('+') ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {change}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 md:hidden">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            <h1 className="text-lg font-semibold">Analytics</h1>
            {!isOnline && (
              <Badge variant="destructive" className="text-xs">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isInstallable && (
              <Button variant="outline" size="sm" onClick={handleInstallPWA} className="text-xs">
                <Download className="h-3 w-3 mr-1" />
                Install
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Quick Actions</SheetTitle>
                  <SheetDescription>Access analytics tools and settings</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start"
                      onClick={action.action}
                    >
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Today: $45.2K</span>
            <span>•</span>
            <span>24 Active Loads</span>
            <span>•</span>
            <span>89% On-Time</span>
            <div className="flex items-center gap-1">
              {isOnline ? (
                <Wifi className="h-3 w-3 text-green-500" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4" ref={containerRef}>
        {/* Metric Cards */}
        <div className="space-y-3">
          <MetricCard
            title="Revenue"
            value={`$${data?.summary?.totalRevenue?.toLocaleString() || '0'}`}
            change="+12.5%"
            icon={<TrendingUp className="h-4 w-4 text-green-500" />}
            index={0}
          />
          <MetricCard
            title="Active Loads"
            value={data?.summary?.totalLoads?.toLocaleString() || '0'}
            change="+8.3%"
            icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
            index={1}
          />
          <MetricCard
            title="Utilization"
            value="78.5%"
            change="-2.1%"
            icon={<TrendingDown className="h-4 w-4 text-red-500" />}
            index={2}
          />
        </div>

        {/* Swipeable Tabs */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Analytics Overview</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowFullscreen(true)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 text-xs">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="operational">Ops</TabsTrigger>
              </TabsList>

              <motion.div
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -50, right: 50 }}
                onDragEnd={handleDragEnd}
                className="mt-4"
              >
                <TabsContent value="overview" className="space-y-4">
                  <div className="h-48">
                    <Line data={chartData.line} options={chartOptions} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">Total Miles</p>
                      <p className="text-lg font-bold">124.5K</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">Avg Speed</p>
                      <p className="text-lg font-bold">58.2 mph</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="h-48">
                    <Bar data={chartData.bar} options={chartOptions} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">On-Time</p>
                      <p className="text-lg font-bold text-green-600">89.2%</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">Efficiency</p>
                      <p className="text-lg font-bold text-blue-600">94.1%</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <div className="h-48">
                    <Doughnut
                      data={chartData.doughnut}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            position: 'bottom' as const,
                            labels: {
                              usePointStyle: true,
                              padding: 10,
                              font: { size: 10 },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">Profit Margin</p>
                      <p className="text-lg font-bold text-green-600">15.8%</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">Cost/Mile</p>
                      <p className="text-lg font-bold">$1.85</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="operational" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">Active Drivers</span>
                      <Badge variant="outline">42</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">Vehicles in Transit</span>
                      <Badge variant="outline">28</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">Maintenance Due</span>
                      <Badge variant="destructive">3</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">Fuel Stops</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Offline Notice */}
        {!isOnline && offlineData.length > 0 && (
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-600">
                <WifiOff className="h-4 w-4" />{' '}
                <span className="text-sm">
                  You're offline. Showing cached data from{' '}
                  {offlineData[0]
                    ? new Date(offlineData[0].timestamp).toLocaleString()
                    : 'unknown time'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fullscreen Chart Modal */}
      <Drawer open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DrawerContent className="h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Analytics Chart</DrawerTitle>
            <DrawerDescription>Detailed view with touch interactions</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 p-4">
            <Line data={chartData.line} options={chartOptions} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Swipe Indicator */}
      {swipeDirection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs"
        >
          Swipe {swipeDirection} to navigate
        </motion.div>
      )}
    </div>
  );
}
