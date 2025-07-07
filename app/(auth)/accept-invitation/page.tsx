'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSignUp, useUser } from '@clerk/nextjs';
import { Loader2, MapPinned } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { SystemRoles, type SystemRole } from '@/types/abac';

interface InvitationMetadata {
  role: SystemRole;
  bypassOnboarding: boolean;
  invitedBy: string;
  invitedAt: string;
  organizationId: string;
}

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded: userLoaded, user } = useUser();
  const { isLoaded: signUpLoaded, signUp, setActive } = useSignUp();

  const [loading, setLoading] = useState(false);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    password: '',
  });

  // Extract invitation token from URL
  useEffect(() => {
    const ticket = searchParams.get('__clerk_ticket');
    if (ticket) {
      setInvitationToken(ticket);
    } else {
      toast({
        title: 'Invalid Invitation',
        description: 'This invitation link is invalid or has expired.',
        variant: 'destructive',
      });
      router.push('/sign-in');
    }
  }, [searchParams, router]);

  // If user is already signed in, redirect them appropriately
  useEffect(() => {
    if (userLoaded && user && invitationToken) {
      // User is already signed in, they just need to accept the invitation
      // This would typically happen if they clicked the invite link while already logged in
      toast({
        title: 'Already Signed In',
        description:
          'You are already signed in. Redirecting to your dashboard.',
      });

      // Get user's role and redirect to appropriate dashboard
      const userRole =
        (user.publicMetadata?.role as SystemRole) || SystemRoles.MEMBER;
      const orgId = user.publicMetadata?.organizationId as string;

      if (orgId) {
        const dashboardPath = getRoleDashboardPath(userRole, orgId, user.id);
        router.push(dashboardPath);
      } else {
        router.push('/onboarding');
      }
    }
  }, [userLoaded, user, router, invitationToken]);

  const getRoleDashboardPath = (
    role: SystemRole,
    orgId: string,
    userId: string
  ): string => {
    switch (role) {
      case SystemRoles.ADMIN:
        return `/${orgId}/dashboard/${userId}`;
      case SystemRoles.DISPATCHER:
        return `/${orgId}/dispatcher/${userId}`;
      case SystemRoles.DRIVER:
        return `/${orgId}/drivers/${userId}`;
      case SystemRoles.COMPLIANCE:
        return `/${orgId}/compliance/${userId}`;
      default:
        return `/${orgId}/dashboard/${userId}`;
    }
  };

  const handleSignUpWithInvitation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signUpLoaded || !invitationToken) {
      toast({
        title: 'Not Ready',
        description: 'Please wait while we load the invitation details.',
        variant: 'destructive',
      });
      return;
    }

    if (!userInfo.firstName || !userInfo.lastName || !userInfo.password) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create the sign-up with invitation token
      const result = await signUp.create({
        strategy: 'ticket',
        ticket: invitationToken,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        password: userInfo.password,
      });

      // Clerk automatically verifies email for invited users
      if (result.status === 'complete') {
        // Get invitation metadata from the result
        const invitationMetadata = result.createdSessionId
          ? ((result as any).publicMetadata as InvitationMetadata)
          : null;

        // Set the session as active
        await setActive({ session: result.createdSessionId });

        // Check if onboarding should be bypassed
        if (invitationMetadata?.bypassOnboarding) {
          const role = invitationMetadata.role;
          const orgId = invitationMetadata.organizationId;

          toast({
            title: 'Welcome to FleetFusion!',
            description: `You've been added as a ${role} to the organization.`,
          });

          // Redirect to role-specific dashboard
          const dashboardPath = getRoleDashboardPath(
            role,
            orgId,
            result.createdUserId!
          );
          router.push(dashboardPath);
        } else {
          // Fallback to regular onboarding
          router.push('/onboarding');
        }
      } else {
        toast({
          title: 'Additional Verification Required',
          description: 'Please check your email for verification instructions.',
        });
      }
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast({
        title: 'Error',
        description:
          error.errors?.[0]?.message ||
          'Failed to accept invitation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!signUpLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!invitationToken) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-lg bg-blue-600 p-3">
              <MapPinned className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Join FleetFusion</CardTitle>
          <CardDescription>
            You've been invited to join an organization. Complete your profile
            to get started.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUpWithInvitation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={userInfo.firstName}
                onChange={e =>
                  setUserInfo(prev => ({ ...prev, firstName: e.target.value }))
                }
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={userInfo.lastName}
                onChange={e =>
                  setUserInfo(prev => ({ ...prev, lastName: e.target.value }))
                }
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={userInfo.password}
                onChange={e =>
                  setUserInfo(prev => ({ ...prev, password: e.target.value }))
                }
                required
                disabled={loading}
                minLength={8}
              />
              <p className="text-muted-foreground text-sm">
                Password must be at least 8 characters long
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting Invitation...
                </>
              ) : (
                'Accept Invitation'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{' '}
              <a href="/sign-in" className="text-blue-600 hover:underline">
                Sign in here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
