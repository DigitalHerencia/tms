'use client';

import { useState, useEffect, useTransition } from 'react';
import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fetchNotifications, readNotification } from '@/lib/actions/notificationActions';
import type { Notification } from '@/types/notifications';
import { useOrganizationContext } from '@/components/auth/context';

export function NotificationCenter() {
  const org = useOrganizationContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!org) return;
    startTransition(async () => {
      const result = await fetchNotifications(org.id);
      if (result.success && result.data) {
        setNotifications(result.data);
      }
    });
  }, [org]);

  const handleRead = (id: string) => {
    startTransition(async () => {
      if (!org) return;
      const result = await readNotification(id, org.id);
      if (result.success) {
        setNotifications((n) => n.filter((notif) => notif.id !== id));
      }
    });
  };

  const count = notifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="sm" className="relative h-7 w-7 p-0">
          <Bell className="h-4 w-4 text-zinc-300" />
          {count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {count}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 space-y-1 bg-black p-2" align="end">
        {notifications.length === 0 && (
          <div className="px-2 py-1 text-sm text-zinc-400">No new notifications</div>
        )}
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => handleRead(n.id)}
            className="block w-full rounded-md px-2 py-1 text-left text-sm hover:bg-gray-800"
          >
            {n.message}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
