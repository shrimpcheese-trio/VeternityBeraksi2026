function digitsOf(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * Formats raw input into an id-ID grouped Rupiah display string, e.g. "Rp 150.000".
 * Non-digit characters are stripped, so pasting "1,500,000" or "150000" works.
 * @param raw - the current input value
 * @returns the formatted string, or "" when no digits are present
 */
export function formatPriceInput(raw: string): string {
  const digits = digitsOf(raw);
  if (!digits) return "";
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${grouped}`;
}

/**
 * Parses a formatted Rupiah input back into a whole number.
 * @param formatted - the formatted display string
 * @returns the parsed integer, or null when no digits are present
 */
export function parsePriceInput(formatted: string): number | null {
  const digits = digitsOf(formatted);
  if (!digits) return null;
  return parseInt(digits, 10);
}
