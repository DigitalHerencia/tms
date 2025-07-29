export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type AdminActionResult<T> = ActionResult<T>;
export type AnalyticsActionResult<T> = ActionResult<T>;

export interface UserInvitationResult {
  success: boolean;
  userId?: string;
  invitationToken?: string;
  error?: string;
}
