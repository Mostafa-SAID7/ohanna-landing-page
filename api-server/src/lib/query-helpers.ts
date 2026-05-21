import type { ParsedQs } from "qs";

/**
 * Extract a plain string from Express query/param values.
 * Handles: string | string[] | ParsedQs | ParsedQs[] | undefined
 */
export function ensureString(
  value: string | string[] | ParsedQs | ParsedQs[] | undefined
): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : undefined;
  return undefined;
}
