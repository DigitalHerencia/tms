/**
 * Invitation Form Component
 *
 * Form for creating single invitations with role selection,
 * expiration settings, and onboarding options.
 */

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

import { createInvitation } from "@/lib/actions/invitationActions";
import { invitationFormSchema, type InvitationFormSchemaData } from "@/schemas/invitations";
import { SystemRoles, type SystemRole } from "@/types/abac";
import { ROLE_DISPLAY_NAMES, ROLE_COLORS, INVITATION_DEFAULTS } from "@/types/invitations";

interface InvitationFormProps {
  organizationId: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function InvitationForm({ organizationId, onSuccess, trigger }: InvitationFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InvitationFormSchemaData>({
    resolver: zodResolver(invitationFormSchema) as any,
    defaultValues: {
      email: "",
      role: "" as SystemRole,
      bypassOnboarding: false,
      expiresInDays: INVITATION_DEFAULTS.EXPIRES_IN_DAYS,
      redirectUrl: "",
      metadata: {},
    },
  });

  const onSubmit = async (data: InvitationFormSchemaData) => {
    setIsLoading(true);

    try {
      const result = await createInvitation(organizationId, {
        email: data.email,
        role: data.role as SystemRole,
        redirectUrl: data.redirectUrl || undefined,
        bypassOnboarding: data.bypassOnboarding,
        expiresInDays: data.expiresInDays,
        metadata: data.metadata,
      });

      if (result.success) {
        toast({
          title: "Invitation Sent",
          description: result.message || `Invitation sent to ${data.email}`,
        });

        form.reset();
        setOpen(false);
        onSuccess?.();
      } else {
        toast({
          title: "Failed to Send Invitation",
          description: result.error || "An error occurred while sending the invitation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Invite User
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Invitation
          </DialogTitle>
          <DialogDescription>
            Invite a new user to join your organization with a specific role and permissions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Selection */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(SystemRoles).map((role) => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center gap-2">
                            <Badge className={ROLE_COLORS[role]}>{ROLE_DISPLAY_NAMES[role]}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The role determines what permissions the user will have in your organization.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expiration Days */}
            <FormField
              control={form.control}
              name="expiresInDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invitation Expires In</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>How long the invitation link will remain valid.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bypass Onboarding */}
            <FormField
              control={form.control}
              name="bypassOnboarding"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      disabled={isLoading}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Skip onboarding process</FormLabel>
                    <FormDescription>
                      The user will be taken directly to their dashboard instead of the onboarding
                      flow.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Redirect URL (Optional) */}
            <FormField
              control={form.control}
              name="redirectUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Redirect URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://your-app.com/welcome"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Where to redirect the user after accepting the invitation. Leave blank for
                    default.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invitation
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
