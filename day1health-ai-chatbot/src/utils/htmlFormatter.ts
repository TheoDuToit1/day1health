/**
 * Utility to do minimal cleanup of HTML content from AI responses
 * Only fixes critical issues, lets AI control formatting
 */

export function formatHTML(html: string): string {
  if (!html) return '';
  
  let formatted = html;
  
  // Only clean up excessive whitespace
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  formatted = formatted.trim();
  
  return formatted;
}

/**
 * Check if a string contains HTML tags
 */
export function hasHTML(text: string): boolean {
  return /<[^>]+>/.test(text);
}
