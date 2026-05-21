/**
 * String normalization and validation utilities
 * Eliminates duplicate string processing logic
 */

/**
 * Normalize email address
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Normalize name (trim and title case)
 */
export function normalizeName(name: string): string {
  return name.trim();
}

/**
 * Normalize text field (trim and clean)
 */
export function normalizeText(text: string): string {
  return text.trim();
}

/**
 * Validate and normalize phone number (Egyptian format)
 */
export function normalizePhone(phone: string): string {
  // Remove all spaces and special characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Add +20 prefix if missing
  if (cleaned.startsWith('01')) {
    return `+20${cleaned}`;
  }
  if (cleaned.startsWith('201')) {
    return `+${cleaned}`;
  }
  
  return cleaned;
}

/**
 * Validate required string field
 */
export function validateRequired(value: string | undefined | null, fieldName: string): string {
  if (!value?.trim()) {
    throw Object.assign(
      new Error(`${fieldName} is required`), 
      { statusCode: 400 }
    );
  }
  return value.trim();
}

/**
 * Validate and normalize email
 */
export function validateEmail(email: string | undefined | null): string {
  const normalized = validateRequired(email, 'Email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(normalized)) {
    throw Object.assign(
      new Error('Invalid email address'), 
      { statusCode: 400 }
    );
  }
  
  return normalizeEmail(normalized);
}

/**
 * Clean and validate text with length limits
 */
export function validateText(
  text: string | undefined | null, 
  fieldName: string, 
  minLength: number = 1, 
  maxLength: number = 1000
): string {
  const normalized = validateRequired(text, fieldName);
  
  if (normalized.length < minLength) {
    throw Object.assign(
      new Error(`${fieldName} must be at least ${minLength} characters`), 
      { statusCode: 400 }
    );
  }
  
  if (normalized.length > maxLength) {
    throw Object.assign(
      new Error(`${fieldName} must be no more than ${maxLength} characters`), 
      { statusCode: 400 }
    );
  }
  
  return normalized;
}

/**
 * Sanitize HTML content (basic)
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}