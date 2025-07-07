// app/(tenant)/[orgId]/admin/[userId]/page.tsx
import { AdminDashboard } from '@/features/admin/AdminDashboard';
// Cache control for auth-required dynamic pages
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    orgId: string;
    userId: string;
  }>;
}

export default async function AdminDashboardPage({ params }: PageProps) {
  const { orgId, userId } = await params;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Organization ID: {orgId}</p>
      <p>User ID: {userId}</p>
      <AdminDashboard orgId={orgId} userId={userId} />
    </div>
  );
}
