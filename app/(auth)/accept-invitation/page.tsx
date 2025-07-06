"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignUp, useUser } from "@clerk/nextjs";
import { Loader2, MapPinned, CheckCircle, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { SystemRoles, type SystemRole } from "@/types/abac";
import { getInvitationByToken } from "@/lib/fetchers/invitationFetchers";
import { acceptInvitation } from "@/lib/actions/invitationActions";
import { type Invitation, type InvitationMetadata } from "@/types/invitations";

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded: userLoaded, user } = useUser();
  const { isLoaded: signUpLoaded, signUp, setActive } = useSignUp();

  const [loading, setLoading] = useState(false);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    password: "",
  });

  // Extract invitation token and load invitation data
  useEffect(() => {
    const loadInvitation = async () => {
      const ticket = searchParams.get("__clerk_ticket");
      const token = searchParams.get("token");
      const invitationToken = ticket || token;

      if (!invitationToken) {
        setError("This invitation link is invalid or has expired.");
        return;
      }

      setInvitationToken(invitationToken);

      // If we have a custom token, load invitation details
      if (token && !ticket) {
        try {
          const invitationData = await getInvitationByToken(token);
          if (invitationData) {
            setInvitation(invitationData);
          } else {
            setError("This invitation link is invalid or has expired.");
          }
        } catch (error) {
          setError("Failed to load invitation details.");
        }
      }
    };

    loadInvitation();
  }, [searchParams]);

  // Handle already signed-in users
  useEffect(() => {
    if (userLoaded && user && invitationToken) {
      // User is already signed in, handle invitation acceptance
      const handleExistingUser = async () => {
        if (invitation?.token) {
          try {
            const result = await acceptInvitation({
              token: invitation.token,
            });

            if (result.success) {
              toast({
                title: "Welcome!",
                description: `You've successfully joined ${invitation.organization?.name}.`,
              });

              const dashboardPath = getRoleDashboardPath(
                invitation.role,
                invitation.organizationId,
                user.id,
              );
              router.push(dashboardPath);
            } else {
              setError(result.error || "Failed to accept invitation.");
            }
          } catch (error) {
            setError("An error occurred while accepting the invitation.");
          }
        }
      };

      handleExistingUser();
    }
  }, [userLoaded, user, router, invitationToken, invitation]);

  const getRoleDashboardPath = (role: SystemRole, orgId: string, userId: string): string => {
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
        title: "Not Ready",
        description: "Please wait while we load the invitation details.",
        variant: "destructive",
      });
      return;
    }

    if (!userInfo.firstName || !userInfo.lastName || !userInfo.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let result;

      // Use Clerk ticket if available, otherwise handle custom token
      if (searchParams.get("__clerk_ticket")) {
        // Clerk invitation flow
        result = await signUp.create({
          strategy: "ticket",
          ticket: invitationToken,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          password: userInfo.password,
        });
      } else if (invitation?.token) {
        // Custom invitation flow
        const acceptResult = await acceptInvitation({
          token: invitation.token,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          password: userInfo.password,
        });

        if (acceptResult.success) {
          // Create account with Clerk after accepting invitation
          result = await signUp.create({
            emailAddress: invitation.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            password: userInfo.password,
          });
        } else {
          throw new Error(acceptResult.error || "Failed to accept invitation");
        }
      }

      if (result?.status === "complete") {
        await setActive({ session: result.createdSessionId });

        const role = invitation?.role;
        const orgId = invitation?.organizationId;

        if (role && orgId && invitation?.bypassOnboarding) {
          toast({
            title: "Welcome to FleetFusion!",
            description: `You've been added as a ${role} to the organization.`,
          });

          const dashboardPath = getRoleDashboardPath(role, orgId, result.createdUserId!);
          router.push(dashboardPath);
        } else {
          router.push("/onboarding");
        }
      } else {
        toast({
          title: "Additional Verification Required",
          description: "Please check your email for verification instructions.",
        });
      }
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept invitation. Please try again.",
        variant: "destructive",
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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-lg bg-red-600 p-3">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Invalid Invitation</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/sign-in")} className="w-full">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userLoaded && user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
            You've been invited to join {invitation?.organization?.name || "an organization"}.
            Complete your profile to get started.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {invitation && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You're being invited as a <strong>{invitation.role}</strong> by{" "}
                {invitation.inviter?.firstName} {invitation.inviter?.lastName}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignUpWithInvitation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={userInfo.firstName}
                onChange={(e) => setUserInfo((prev) => ({ ...prev, firstName: e.target.value }))}
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
                onChange={(e) => setUserInfo((prev) => ({ ...prev, lastName: e.target.value }))}
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
                onChange={(e) => setUserInfo((prev) => ({ ...prev, password: e.target.value }))}
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
                "Accept Invitation"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
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
