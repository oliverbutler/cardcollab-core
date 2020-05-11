/**
 * Capitalize a String
 *
 * @param s - String to capitalize
 */
export const capitalize = (s: String): String => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Sleep Function
 *
 * @param ms - Milliseconds to sleep
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
