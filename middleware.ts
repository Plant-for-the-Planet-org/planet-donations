import { NextRequest, NextResponse } from "next/server";
import { supportedDonationConfig } from "src/Utils/supportedDonationConfig";

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

  const currentLocale = req.nextUrl.locale || "en";

  // Check if this tenant has language restrictions
  if (tenantParam && supportedDonationConfig[tenantParam]) {
    const tenantConfig = supportedDonationConfig[tenantParam];
    const tenantSupportedLanguages = tenantConfig.languages;

    // If current locale is not supported by this tenant, redirect
    if (!tenantSupportedLanguages.includes(currentLocale)) {
      const fallbackLocale = tenantSupportedLanguages[0] || "en";

      // Build redirect URL with correct locale
      // e.g., /de/donate?tenant=xyz -> /en/donate?tenant=xyz
      const url = new URL(req.url);
      url.pathname = url.pathname.replace(
        `/${currentLocale}`,
        `/${fallbackLocale}`,
      );

      return NextResponse.redirect(url);
    }
  }

  // locale is removed from query parameters and user is redirected if the locale is supported
  if (localeParam) {
    const localeTestRegex = new RegExp("&?locale=" + localeParam); //looks for locale as a query param (optionally preceded by &)
    const queryString = req.nextUrl.search.replace(localeTestRegex, "");
    if (ALLOWED_LOCALES.includes(localeParam)) {
      return NextResponse.redirect(
        new URL(
          `/${localeParam}${req.nextUrl.pathname}${queryString}`,
          req.url,
        ),
      );
    } else {
      return NextResponse.redirect(
        new URL(
          `/${req.nextUrl.locale}${req.nextUrl.pathname}${queryString}`,
          req.url,
        ),
      );
    }
  }
}
