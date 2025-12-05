import { NextRequest, NextResponse } from "next/server";
import { supportedDonationConfig } from "./src/Utils/supportedDonationConfig";

const PUBLIC_FILE = /\.(.*)$/;
const ALLOWED_LOCALES = ["en", "cs", "de", "it", "es", "fr", "pt-BR"];

export async function middleware(
  req: NextRequest,
): Promise<NextResponse | undefined> {
  // Skip middleware for static files, API routes, and Next.js internals
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }

  const localeParam = req.nextUrl.searchParams.get("locale");
  const tenantParam = req.nextUrl.searchParams.get("tenant");

  // Get current locale from Next.js (e.g., "en", "de", "es")
  const currentLocale = req.nextUrl.locale || "en";

  // Check if this tenant has language restrictions
  if (tenantParam && supportedDonationConfig[tenantParam]) {
    const tenantConfig = supportedDonationConfig[tenantParam];
    const tenantSupportedLanguages = tenantConfig.languages;

    // If current locale is not supported by this tenant, redirect
    if (!tenantSupportedLanguages.includes(currentLocale)) {
      const fallbackLocale = tenantSupportedLanguages[0] || "en";

      // Build redirect URL with correct locale
      // Uses req.nextUrl.pathname (already normalized, no locale) and prepends new locale
      return NextResponse.redirect(
        new URL(
          `/${fallbackLocale}${req.nextUrl.pathname}${req.nextUrl.search}`,
          req.url,
        ),
      );
    }
  }

  // Handle ?locale= query parameter (existing logic)
  if (localeParam) {
    const searchParams = new URLSearchParams(req.nextUrl.searchParams);
    searchParams.delete("locale");
    const queryString = searchParams.toString()
      ? `?${searchParams.toString()}`
      : "";

    if (ALLOWED_LOCALES.includes(localeParam)) {
      // Check if tenant restricts this locale
      if (tenantParam && supportedDonationConfig[tenantParam]) {
        const tenantConfig = supportedDonationConfig[tenantParam];
        if (!tenantConfig.languages.includes(localeParam)) {
          // Redirect to tenant's first supported language
          const fallbackLocale = tenantConfig.languages[0] || "en";
          return NextResponse.redirect(
            new URL(
              `/${fallbackLocale}${req.nextUrl.pathname}${queryString}`,
              req.url,
            ),
          );
        }
      }

      // Convert ?locale=de to /de/
      return NextResponse.redirect(
        new URL(
          `/${localeParam}${req.nextUrl.pathname}${queryString}`,
          req.url,
        ),
      );
    } else {
      // Invalid locale param, use current locale
      return NextResponse.redirect(
        new URL(
          `/${currentLocale}${req.nextUrl.pathname}${queryString}`,
          req.url,
        ),
      );
    }
  }
}
