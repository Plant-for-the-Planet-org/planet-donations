import { WelcomePackageLanguage } from "src/Common/Types/donation";

/**
 * Returns the Welcome Package language for the given app locale.
 * The locale already reflects the browser language via Next.js locale detection.
 * "de" -> "de", any other locale -> "en".
 */
export function getWelcomePackageLanguageFromLocale(
  locale: string,
): WelcomePackageLanguage {
  return locale === "de" ? "de" : "en";
}
