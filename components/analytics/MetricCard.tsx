import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function MetricCard({ title, value, change, icon: Icon }: MetricCardProps) {
  return (
    <Card className="rounded-md border border-gray-200 bg-black p-6 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
          <Icon className="h-4 w-4 text-blue-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-2xl font-bold text-white">{value}</div>
        {change ? <p className="text-xs text-gray-400">{change}</p> : null}
      </CardContent>
    </Card>
  );
}
