import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/utils';
import { 
  Plus, 
  UserPlus, 
  AlertCircle, 
  Truck, 
  BarChart3, 
  MapPin, 
  FileText, 
  Settings, 
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';
import type { QuickAction } from '@/types/dashboard';

interface QuickActionCardProps {
  action: QuickAction;
}

const iconComponents = {
  Plus,
  UserPlus,
  AlertCircle,
  Truck,
  BarChart3,
  MapPin,
  FileText,
  Settings,
  DollarSign,
  Clock,
  CheckCircle,
} as const;

export function QuickActionCard({ action }: QuickActionCardProps) {
  const IconComponent = iconComponents[action.icon as keyof typeof iconComponents];
  
  return (
    <Card className="transition-all hover:shadow-md hover:scale-105 group cursor-pointer">
      <CardContent className="p-4">
        <Link href={action.href} className="block">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'p-3 rounded-lg text-white transition-all group-hover:scale-110',
              action.color || 'bg-blue-500'
            )}>
              {IconComponent ? (
                <IconComponent className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                {action.badge && (
                  <Badge variant={action.badge.variant || 'secondary'} className="text-xs">
                    {action.badge.text}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
              {action.shortcut && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <kbd className="px-1 py-0.5 text-xs bg-muted rounded border">
                    {action.shortcut}
                  </kbd>
                </div>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick?: (action: QuickAction) => void;
}

export function QuickActions({ actions, onActionClick }: QuickActionsProps) {
  if (actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No actions available for your role.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleActionClick = (action: QuickAction) => {
    if (onActionClick) {
      onActionClick(action);
    }
  };

  // Group actions by priority
  const priorityActions = actions.filter(action => action.priority === 'high');
  const regularActions = actions.filter(action => action.priority !== 'high');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Quick Actions
          <Badge variant="outline" className="text-xs">
            {actions.length} available
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Priority Actions */}
        {priorityActions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Priority Actions
            </h4>
            {priorityActions.map((action, index) => (
              <div key={index} onClick={() => handleActionClick(action)}>
                <QuickActionCard action={action} />
              </div>
            ))}
          </div>
        )}
        
        {/* Regular Actions */}
        {regularActions.length > 0 && (
          <div className="space-y-2">
            {priorityActions.length > 0 && (
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                General Actions
              </h4>
            )}
            {regularActions.map((action, index) => (
              <div key={index} onClick={() => handleActionClick(action)}>
                <QuickActionCard action={action} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}