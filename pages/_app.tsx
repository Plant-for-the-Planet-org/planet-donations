import type { AppProps /*, AppContext */ } from "next/app";
import Layout from "../src/Layout";
import ThemeProvider, { useTheme } from "../styles/themeContext";
import getConfig from "next/config";
import * as Sentry from "@sentry/node";
import { RewriteFrames } from "@sentry/integrations";
import theme from "./../styles/theme";
import "./../styles/globals.scss";
import CssBaseline from '@material-ui/core/CssBaseline';

// if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
//   const config = getConfig();
//   const distDir = `${config.serverRuntimeConfig.rootDir}/.next`;
//   Sentry.init({
//     enabled: process.env.NODE_ENV === "production",
//     integrations: [
//       new RewriteFrames({
//         iteratee: (frame) => {
//           frame.filename = frame.filename?.replace(distDir, "app:///_next");
//           return frame;
//         },
//       }),
//     ],
//     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
//     // from https://gist.github.com/pioug/b006c983538538066ea871d299d8e8bc,
//     // also see https://docs.sentry.io/platforms/javascript/configuration/filtering/#decluttering-sentry
//     ignoreErrors: [
//       /^No error$/,
//       /__show__deepen/,
//       /_avast_submit/,
//       /Access is denied/,
//       /anonymous function: captureException/,
//       /Blocked a frame with origin/,
//       /console is not defined/,
//       /cordova/,
//       /DataCloneError/,
//       /Error: AccessDeny/,
//       /event is not defined/,
//       /feedConf/,
//       /ibFindAllVideos/,
//       /myGloFrameList/,
//       /SecurityError/,
//       /MyIPhoneApp/,
//       /snapchat.com/,
//       /vid_mate_check is not defined/,
//       /win\.document\.body/,
//       /window\._sharedData\.entry_data/,
//       /ztePageScrollModule/,
//     ],
//     denyUrls: [],
//   });
// }

function MyApp({ Component, pageProps }: AppProps) {
  const { theme: themeType } = useTheme();

  return (
    <ThemeProvider>
      <CssBaseline />
      <style jsx global>
        {theme}
      </style>
      <div className={`${themeType}`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </ThemeProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp;
