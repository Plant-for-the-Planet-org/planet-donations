import { init } from "@sentry/nextjs";

init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV == "production",
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
});
