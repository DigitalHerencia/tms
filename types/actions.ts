export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type AdminActionResult<T> = ActionResult<T>;
export type AnalyticsActionResult<T> = ActionResult<T>;
