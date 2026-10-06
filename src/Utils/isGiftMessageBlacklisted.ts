/**
 * Determines whether the provided email belongs to a blacklisted domain.
 *
 * The blacklist is sourced from the `NEXT_PUBLIC_MESSAGE_BLACKLIST`
 * environment variable, which should contain a comma-separated list
 * of domains (e.g., "gmail.com,yahoo.com").
 *
 * The list is normalized and stored once at module load for performance.
 *
 * @example
 * // If NEXT_PUBLIC_MESSAGE_BLACKLIST = "gmail.com,yahoo.com"
 * isGiftMessageBlacklisted("user@gmail.com"); // true
 * isGiftMessageBlacklisted("info@company.org"); // false
 *
 * @param email - The email address to validate.
 * @returns `true` if the domain is blacklisted, otherwise `false`.
 */

const blacklistedDomains = new Set(
  (process.env.NEXT_PUBLIC_MESSAGE_BLACKLIST || "")
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean)
);

export const isGiftMessageBlacklisted = (
  email: string | undefined
): boolean => {
  if (!email || !email.includes("@")) return false;

  const emailDomain = email.split("@")[1].toLowerCase();

  return blacklistedDomains.has(emailDomain);
};
