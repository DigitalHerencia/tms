// Centralized error handler utility for DRY compliance
export function handleError(error: unknown, context?: string) {
  if (error instanceof Error) {
    // Optionally log to external service here
    console.error(`[${context || 'Error'}]`, error.message);
    return { success: false, error: error.message };
  }
  console.error(`[${context || 'Error'}]`, error);
  return { success: false, error: 'An unknown error occurred' };
}
