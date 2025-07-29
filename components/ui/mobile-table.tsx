'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Activity, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizedTableProps {
  data: Array<{
    id: string;
    title: string;
    subtitle?: string;
    status: 'active' | 'inactive' | 'warning' | 'error';
    primaryValue: string;
    secondaryValue?: string;
    timestamp?: string;
    actions?: Array<{
      label: string;
      variant?: 'default' | 'outline' | 'destructive';
      onClick: () => void;
    }>;
  }>;
  title: string;
  emptyMessage?: string;
}

export function MobileOptimizedTable({ data, title, emptyMessage }: MobileOptimizedTableProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (!isMobile) {
    // Return desktop table layout
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Value</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{item.title}</div>
                        {item.subtitle && (
                          <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status}</span>
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="font-medium">{item.primaryValue}</div>
                      {item.secondaryValue && (
                        <div className="text-sm text-muted-foreground">{item.secondaryValue}</div>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        {item.actions?.map((action, idx) => (
                          <Button
                            key={idx}
                            variant={action.variant || 'outline'}
                            size="sm"
                            onClick={action.onClick}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mobile-optimized card layout
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Badge variant="outline">{data.length} items</Badge>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground text-center">{emptyMessage || 'No items found'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium truncate">{item.title}</h3>
                      <Badge className={`${getStatusColor(item.status)} text-xs`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status}</span>
                      </Badge>
                    </div>

                    {item.subtitle && (
                      <p className="text-sm text-muted-foreground mb-2 truncate">{item.subtitle}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">{item.primaryValue}</div>
                        {item.secondaryValue && (
                          <div className="text-sm text-muted-foreground">{item.secondaryValue}</div>
                        )}
                      </div>

                      {item.timestamp && (
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.actions && item.actions.length > 0 && (
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" className="ml-2">
                          <Menu className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="h-auto">
                        <div className="space-y-4 pt-4">
                          <h4 className="font-semibold">{item.title}</h4>
                          <div className="space-y-2">
                            {item.actions.map((action, idx) => (
                              <Button
                                key={idx}
                                variant={action.variant || 'outline'}
                                className="w-full"
                                onClick={() => {
                                  action.onClick();
                                  setSelectedItem(null);
                                }}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
