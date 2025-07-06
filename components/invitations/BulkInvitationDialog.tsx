/**
 * Bulk Invitation Dialog Component
 *
 * Modal dialog for creating multiple invitations at once.
 */

"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, Loader2, Download } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import { createBulkInvitations } from "@/lib/actions/invitationActions";
import { bulkInvitationFormSchema } from "@/schemas/invitations";
import { type BulkInvitationFormData, ROLE_DISPLAY_NAMES } from "@/types/invitations";
import { SystemRoles, type SystemRole } from "@/types/abac";

interface BulkInvitationDialogProps {
  organizationId: string;
}

export function BulkInvitationDialog({ organizationId }: BulkInvitationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<BulkInvitationFormData>({
    resolver: zodResolver(bulkInvitationFormSchema) as any,
    defaultValues: {
      emails: "",
      role: "" as any,
      bypassOnboarding: false,
      expiresInDays: 7,
    },
  });

  const onSubmit = (data: BulkInvitationFormData) => {
    // Guard: ensure role is selected
    if (!data.role || typeof data.role !== "string" || !(Object.values(SystemRoles) as string[]).includes(data.role)) {
      toast({
        title: "Role Required",
        description: "Please select a role for the invitations.",
        variant: "destructive",
      });
      return;
    }
    startTransition(async () => {
      try {
        // Split emails string into array (by newlines and commas), trim, and filter out empty lines
        const emailsArray = data.emails
          .split(/[\n,]+/)
          .map((email) => email.trim())
          .filter((email) => email.length > 0);

        const result = await createBulkInvitations(organizationId, {
          emails: emailsArray,
          role: data.role as SystemRole, // fix: cast to SystemRole (lowercase)
          bypassOnboarding: data.bypassOnboarding,
          expiresInDays: data.expiresInDays,
          redirectUrl: `${window.location.origin}/accept-invitation`,
        });

        if (result.success) {
          const message =
            result.failed > 0
              ? `${result.successful} invitations sent successfully, ${result.failed} failed`
              : `${result.successful} invitations sent successfully`;

          toast({
            title: "Bulk Invitations Processed",
            description: message,
            variant: result.failed > 0 ? "destructive" : "default",
          });

          if (result.failed > 0) {
            console.log("Failed invitations:", result.errors);
          }

          form.reset();
          setOpen(false);
        } else {
          toast({
            title: "Failed to Send Invitations",
            description: "An error occurred while processing bulk invitations.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error sending bulk invitations:", error);
        toast({
          title: "Error",
          description: "Failed to send invitations. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const downloadTemplate = () => {
    const template = `email1@example.com
email2@example.com
email3@example.com`;

    const blob = new Blob([template], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invitation-template.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Bulk Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Invite Users</DialogTitle>
          <DialogDescription>
            Send invitations to multiple users at once. Enter one email per line.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Email Addresses</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={downloadTemplate}
                      className="h-auto p-1 text-xs"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Template
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                      className="min-h-[120px]"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter one email address per line, or separate with commas. Maximum 50 emails per
                    batch.
                  </FormDescription>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiresInDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires In (Days)</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                        disabled={isPending}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bypassOnboarding"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Skip Onboarding</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

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
                  "Send Invitations"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
