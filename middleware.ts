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

      const response = NextResponse.redirect(
        new URL(
          `/${fallbackLocale}${req.nextUrl.pathname}${req.nextUrl.search}`,
          req.url,
        ),
      );
      // Overwrite the cookie so Next.js doesn't redirect back to the unsupported locale on the next request
      response.cookies.set("NEXT_LOCALE", fallbackLocale, {
        path: "/",
        maxAge: 31536000,
        sameSite: "lax",
      });
      return response;
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
          const response = NextResponse.redirect(
            new URL(
              `/${fallbackLocale}${req.nextUrl.pathname}${queryString}`,
              req.url,
            ),
          );
          // Overwrite cookie to match the tenant fallback locale
          response.cookies.set("NEXT_LOCALE", fallbackLocale, {
            path: "/",
            maxAge: 31536000,
            sameSite: "lax",
          });
          return response;
        }
      }

      // ?locale=en is an explicit instruction from the referring app and must take precedence over the user's NEXT_LOCALE cookie.
      // Without setting the cookie here, Next.js reads the existing NEXT_LOCALE cookie (e.g. "de") on the redirected /en path and immediately overrides back to /de, creating an infinite loop.
      const response = NextResponse.redirect(
        new URL(
          `/${localeParam}${req.nextUrl.pathname}${queryString}`,
          req.url,
        ),
      );
      response.cookies.set("NEXT_LOCALE", localeParam, {
        path: "/",
        maxAge: 31536000,
        sameSite: "lax",
      });
      return response;
    } else {
      // Invalid locale param — fall back to current locale
      const response = NextResponse.redirect(
        new URL(
          `/${currentLocale}${req.nextUrl.pathname}${queryString}`,
          req.url,
        ),
      );
      response.cookies.set("NEXT_LOCALE", currentLocale, {
        path: "/",
        maxAge: 31536000,
        sameSite: "lax",
      });
      return response;
    }
  }
}
