import { listOrganizationUsers } from '@/lib/fetchers/userFetchers';
import { UserTable } from '@/components/admin/users/UserTable';
import { InviteUserForm } from '@/components/admin/users/InviteUserForm';

export default async function UserManagementDashboard({
  orgId,
}: {
  orgId: string;
}) {
  const users = await listOrganizationUsers(orgId);
  // Extract roles from users if needed
  return (  
    <div>
      <UserTable users={ users } />
      <InviteUserForm onInvite={ function ( email: string, role: string ): Promise<void> {
        // Handle user invitation logic here
        console.log(`Inviting ${email} with role ${role}`);
        return Promise.resolve();
      } }  />
    </div>

  );
}
