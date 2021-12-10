import type { AppProps /*, AppContext */ } from "next/app";
import Layout from "../src/Layout";
import ThemeProvider, { useTheme } from "../styles/themeContext";
import getConfig from "next/config";
import * as Sentry from "@sentry/node";
import { RewriteFrames } from "@sentry/integrations";
import theme from "./../styles/theme";
import "./../styles/globals.scss";
import "./../styles/footer.scss";
import "./../styles/donations.scss";
import "./../styles/projects.scss";
import "./../styles/common.scss";
import CssBaseline from "@material-ui/core/CssBaseline";
import { appWithTranslation } from "next-i18next";
import QueryParamProvider from "../src/Layout/QueryParamContext";
import { Auth0Provider } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import React from "react";
import { browserNotCompatible } from "../src/Utils/browsercheck";
import BrowserNotSupported from "./../src/Common/ContentLoaders/BrowserNotSupported";
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const config = getConfig();
  const distDir = `${config.serverRuntimeConfig.rootDir}/.next`;
  Sentry.init({
    enabled: process.env.NODE_ENV === "production",
    integrations: [
      new RewriteFrames({
        iteratee: (frame) => {
          frame.filename = frame.filename?.replace(distDir, "app:///_next");
          return frame;
        },
      }),
    ],
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
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
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  if (
    process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" &&
    process.env.VERCEL_URL &&
    typeof window !== "undefined"
  ) {
    if (process.env.VERCEL_URL !== window.location.hostname) {
      router.replace(`https://${process.env.VERCEL_URL}`);
    }
  }

  const [browserIncompatible, setBrowserIncompatible] = React.useState(false);
  React.useEffect(() => {
    setBrowserIncompatible(browserNotCompatible());
  }, []);

  if (browserIncompatible) {
    return <BrowserNotSupported />;
  } else {
    return (
      <Auth0Provider
        domain={process.env.AUTH0_CUSTOM_DOMAIN}
        clientId={process.env.AUTH0_CLIENT_ID}
        redirectUri={process.env.APP_URL}
        cacheLocation={"localstorage"}
        audience={"urn:plant-for-the-planet"}
        useRefreshTokens={true}
      >
        <ThemeProvider>
          <QueryParamProvider>
            <CssBaseline />
            <style jsx global>
              {theme}
            </style>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </QueryParamProvider>
        </ThemeProvider>
      </Auth0Provider>
    );
  }
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

export default appWithTranslation(MyApp);
