export interface UserInvitationResult {
  success: boolean;
  userId?: string;
  invitationToken?: string;
  error?: string;
}
