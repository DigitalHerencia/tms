'use server';

import type { Notification, NotificationActionResult } from '@/types/notifications';
import { listUnreadNotifications, markNotificationRead } from '@/lib/fetchers/notificationFetchers';
import { handleError } from '@/lib/errors/handleError';
import { auth } from '@clerk/nextjs/server';
import db from '../database/db';

export async function fetchNotifications(
  orgId: string
): Promise<NotificationActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Unauthorized');
    }
    // Check if user belongs to the organization and has required permissions
    const user = await db.user.findUnique({
      where: {
        organizationId: orgId,
        id: userId,
      },
    });
    if (!user) {
      throw new Error('User not found or not member of organization');
    }
    const notifications: Notification[] = await listUnreadNotifications(orgId);
    return { success: true, data: notifications };
  } catch (error) {
    return handleError(error, 'Fetch Notifications');
  }
}

export async function readNotification(
  orgId: string,
  id: string
): Promise<NotificationActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Unauthorized');
    }
    // Check if user belongs to the organization and has required permissions
    const user = await db.user.findUnique({
      where: {
        id: userId,
        organizationId: orgId,
      },
    });
    if (!user) {
      throw new Error('User not found or not member of organization');
    }
    await markNotificationRead(id);
    return { success: true };
  } catch (error) {
    return handleError(error, 'Read Notification');
  }
}

