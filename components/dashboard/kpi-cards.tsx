import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardKPI } from '@/types/dashboard';

interface KPICardProps {
  kpi: DashboardKPI;
}

const iconMap = {
  Truck: '🚛',
  Users: '👥',
  Activity: '📊',
  AlertTriangle: '⚠️',
  Shield: '🛡️',
  BarChart3: '📈',
} as const;

const colorMap = {
  blue: 'text-blue-600 bg-blue-50 border-blue-200',
  green: 'text-green-600 bg-green-50 border-green-200',
  yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  red: 'text-red-600 bg-red-50 border-red-200',
  purple: 'text-purple-600 bg-purple-50 border-purple-200',
} as const;

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
} as const;

export function KPICard({ kpi }: KPICardProps) {
  const TrendIcon = kpi.trend ? trendIcons[kpi.trend] : null;
  const colorClass = colorMap[kpi.color];

  return (
    <Card className={cn('transition-all hover:shadow-md', colorClass)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {kpi.title}
        </CardTitle>
        <div className="text-lg">
          {iconMap[kpi.icon as keyof typeof iconMap] || '📊'}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {kpi.value}
        </div>
        {kpi.change !== undefined && TrendIcon && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
            <TrendIcon className="h-3 w-3" />
            <span>
              {kpi.change > 0 ? '+' : ''}{kpi.change}% from last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface KPIGridProps {
  kpis: DashboardKPI[];
}

export function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <KPICard key={index} kpi={kpi} />
      ))}
    </div>
  );
}