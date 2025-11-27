/**
 * Converts a string (like a title or name) into a URL-friendly slug.
 * @param text The input string (e.g., "Casual Apparel", "Buty zimowe - mąż")
 * @returns The sanitized slug (e.g., "casual-apparel", "buty-zimowe-maz")
 */
export function slugify(text: string): string {
  // Step 1: Handle diacritics (e.g., 'ą' -> 'a', 'ś' -> 's')
  const withoutDiacritics = text
    .normalize('NFD') // Normalize to separate base character and diacritic mark
    .replace(/[\u0300-\u036f]/g, ''); // Remove the diacritic marks

  // Step 2: Clean up and format
  return withoutDiacritics
    .toLowerCase()
    .trim()
    // Replace non-alphanumeric, non-hyphen, non-space characters with nothing
    .replace(/[^a-z0-9\s-]/g, '') 
    // Replace spaces and consecutive hyphens with a single hyphen
    .replace(/[\s-]+/g, '-') 
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}