/**
 * Create Invitation Dialog Component
 *
 * Modal dialog for creating single invitations with form validation.
 */

"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

import { createInvitation } from "@/lib/actions/invitationActions";
import { invitationFormSchema } from "@/schemas/invitations";
import { type InvitationFormData, ROLE_DISPLAY_NAMES } from "@/types/invitations";
import { SystemRoles, type SystemRole } from "@/types/abac";

interface CreateInvitationDialogProps {
  organizationId: string;
}

export function CreateInvitationDialog({ organizationId }: CreateInvitationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<InvitationFormData>({
    resolver: zodResolver(invitationFormSchema) as any, // Explicit cast to avoid type error
    defaultValues: {
      email: "",
      role: "" as SystemRole | "", // Ensure type matches schema
      bypassOnboarding: false,
      expiresInDays: 7,
    },
  });

  const onSubmit = (data: InvitationFormData) => {
    // Guard: ensure role is selected and valid
    if (
      !data.role ||
      typeof data.role !== "string" ||
      !(Object.values(SystemRoles) as string[]).includes(data.role)
    ) {
      toast({
        title: "Role Required",
        description: "Please select a role for the invitation.",
        variant: "destructive",
      });
      return;
    }
    startTransition(async () => {
      try {
        const result = await createInvitation(organizationId, {
          email: data.email,
          role: data.role as SystemRole, // ensure type is SystemRole
          bypassOnboarding: data.bypassOnboarding,
          expiresInDays: data.expiresInDays,
          redirectUrl: `${window.location.origin}/accept-invitation`,
        });

        if (result.success) {
          toast({
            title: "Invitation Sent",
            description: `Invitation has been sent to ${data.email}`,
          });
          form.reset();
          setOpen(false);
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
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization with a specific role.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(SystemRoles).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {ROLE_DISPLAY_NAMES[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresInDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expires In (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Number of days until the invitation expires (1-365)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bypassOnboarding"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Skip Onboarding</FormLabel>
                    <FormDescription>
                      Allow user to skip the onboarding process and go directly to their dashboard
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
