/**
 * Utility functions for slug management
 */

/**
 * Generates a URL-friendly slug from a string
 * 
 * @param text Input text to convert to slug
 * @returns Normalized slug string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/(^-|-$)/g, "")     // Remove leading/trailing hyphens
    .slice(0, 50);               // Limit length
}

/**
 * Validates if a string is a valid slug format
 * 
 * @param slug Slug to validate
 * @returns Boolean indicating if valid
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,48}[a-z0-9])?$/.test(slug);
}

/**
 * Ensures uniqueness by appending a random suffix if needed
 * Note: This is a placeholder - actual implementation would check DB
 * 
 * @param slug Base slug to make unique
 * @returns Promise resolving to unique slug
 */
export async function ensureUniqueSlug(
  slug: string, 
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = slug;
  let uniqueSlug = baseSlug;
  let counter = 1;
  
  while (await checkExists(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
}