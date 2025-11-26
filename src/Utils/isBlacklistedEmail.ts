/**
 * Checks whether the given email belongs to a blacklisted email domain.
 *
 * It reads a comma-separated list of domains from the environment variable:
 * `NEXT_PUBLIC_BLACKLISTED_EMAIL_DOMAINS`, normalizes them, and compares
 * against the domain part of the provided email.
 *
 * Example:
 *  - Blacklist: "gmail.com,yahoo.com"
 *  - Email: "test@gmail.com" → returns true
 *  - Email: "hello@company.com" → returns false
 *
 * @param email - The email address to validate
 * @returns true if the email domain is blacklisted, otherwise false
 */

export const isBlacklistedEmail = (email: string | undefined): boolean => {
  if (!email || !email.includes("@")) return false;

  const blacklistedDomains = (
    process.env.NEXT_PUBLIC_BLACKLISTED_EMAIL_DOMAINS || ""
  )
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);

  const emailDomain = email.split("@")[1].toLowerCase();

  return blacklistedDomains.includes(emailDomain);
};
