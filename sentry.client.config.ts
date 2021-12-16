import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/nextjs";
import getConfig from "next/config";

const config = getConfig();
const distDir = `${config.serverRuntimeConfig.rootDir}/.next`;

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  enabled: process.env.NODE_ENV === "production",
  integrations: [
    new RewriteFrames({
      iteratee: (frame) => {
        frame.filename = frame.filename?.replace(distDir, "app:///_next");
        return frame;
      },
    }),
  ],
  // from https://gist.github.com/pioug/b006c983538538066ea871d299d8e8bc,
  // also see https://docs.sentry.io/platforms/javascript/configuration/filtering/#decluttering-sentry
  ignoreErrors: [
    /^No error$/,
    /__show__deepen/,
    /_avast_submit/,
    /Access is denied/,
    /anonymous function: captureException/,
    /Blocked a frame with origin/,
    /console is not defined/,
    /cordova/,
    /DataCloneError/,
    /Error: AccessDeny/,
    /event is not defined/,
    /feedConf/,
    /ibFindAllVideos/,
    /myGloFrameList/,
    /SecurityError/,
    /MyIPhoneApp/,
    /snapchat.com/,
    /vid_mate_check is not defined/,
    /win\.document\.body/,
    /window\._sharedData\.entry_data/,
    /ztePageScrollModule/,
  ],
  denyUrls: [],
});
