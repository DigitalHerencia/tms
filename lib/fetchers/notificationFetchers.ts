

"use server"

import type { Notification } from "@/types/notifications"
import { auth } from "@clerk/nextjs/server"
import db from "@/lib/database/db"

/**
 * List unread notifications for the current user within an organization.
 */
export async function listUnreadNotifications(
    orgId: string
): Promise<Notification[]> {
    const { userId } = await auth()
    if (!userId) return []

    const notifications = await db.notification.findMany({
        where: {
            organizationId: orgId,
            OR: [{ userId }, { userId: null }],
            readAt: null,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
    })

    return notifications.map((n) => ({
        id: n.id,
        organizationId: n.organizationId,
        userId: n.userId,
        message: n.message,
        url: n.url,
        readAt: n.readAt ? n.readAt.toISOString() : null,
        createdAt: n.createdAt.toISOString(),
    }))
}

/**
 * Mark a notification as read by id.
 */
export async function markNotificationRead(id: string): Promise<void> {
    const { userId } = await auth()
    if (!userId) return

    await db.notification.update({
        where: { id },
        data: { readAt: new Date() },
    })
}
