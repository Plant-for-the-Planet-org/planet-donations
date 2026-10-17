import { captureRequestError } from "@sentry/nextjs";

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
}

// Next 14 ignores this hook. It starts reporting request errors once the app moves to Next 15.
export const onRequestError = captureRequestError;
