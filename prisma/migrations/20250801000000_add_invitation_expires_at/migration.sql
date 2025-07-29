-- Add expires_at column to organization_invitations
ALTER TABLE "organization_invitations" ADD COLUMN "expires_at" TIMESTAMP(3);
