import { init } from "@sentry/nextjs";
import { dataCollection } from "./sentry.dataCollection";

init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV == "production",
  dataCollection,
});
