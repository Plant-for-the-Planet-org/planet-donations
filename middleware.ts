import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const ALLOWED_LOCALES = ["en", "cs", "de", "it", "es", "fr", "pt-BR"];

export async function middleware(
  req: NextRequest
): Promise<NextResponse | undefined> {
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }

  const localeParam = req.nextUrl.searchParams.get("locale");
  const localeTestRegex = new RegExp("&?locale=" + localeParam); //looks for locale as a query param (optionally preceded by &)
  const queryString = req.nextUrl.search.replace(localeTestRegex, "");

  // locale is removed from query parameters and user is redirected if the locale is supported
  if (localeParam) {
    if (ALLOWED_LOCALES.includes(localeParam)) {
      return NextResponse.redirect(
        new URL(`/${localeParam}${req.nextUrl.pathname}${queryString}`, req.url)
      );
    } else {
      return NextResponse.redirect(
        new URL(
          `/${req.nextUrl.locale}${req.nextUrl.pathname}${queryString}`,
          req.url
        )
      );
    }
  }
}
