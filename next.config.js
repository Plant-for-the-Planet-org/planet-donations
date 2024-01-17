/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const { i18n } = require("./next-i18next.config");

// Use the SentryWebpack plugin to upload the source maps during build step
const SentryWebpackPlugin = require("@sentry/webpack-plugin");

const {
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
  VERCEL_GIT_COMMIT_SHA,
  VERCEL_GITHUB_COMMIT_SHA,
  VERCEL_GITLAB_COMMIT_SHA,
  VERCEL_BITBUCKET_COMMIT_SHA,
  SOURCE_VERSION,
} = process.env;

const COMMIT_SHA =
  VERCEL_GIT_COMMIT_SHA ||
  VERCEL_GITHUB_COMMIT_SHA ||
  VERCEL_GITLAB_COMMIT_SHA ||
  VERCEL_BITBUCKET_COMMIT_SHA ||
  SOURCE_VERSION;

process.env.SENTRY_DSN = SENTRY_DSN;
const basePath = "";

const scheme =
  process.env.SCHEME === "http" || process.env.SCHEME === "https"
    ? process.env.SCHEME
    : "https";

let APPUrl;
if (
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" &&
  process.env.DISABLE_VERCEL_REDIRECT !== "true"
) {
  APPUrl = `${scheme}://${process.env.VERCEL_URL}`;
} else {
  APPUrl = process.env.APP_URL;
}

const hasAssetPrefix =
  process.env.ASSET_PREFIX !== "" && process.env.ASSET_PREFIX !== undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  serverRuntimeConfig: {
    rootDir: __dirname,
  },
  webpack: (config, options) => {
    // In `pages/_app.js`, Sentry is imported from @sentry/browser. While
    // @sentry/node will run in a Node.js environment. @sentry/node will use
    // Node.js-only APIs to catch even more unhandled exceptions.
    //
    // This works well when Next.js is SSRing your page on a server with
    // Node.js, but it is not what we want when your client-side bundle is being
    // executed by a browser.
    //
    // Luckily, Next.js will call this webpack function twice, once for the
    // server and once for the client. Read more:
    // https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
    //
    // So ask Webpack to replace @sentry/node imports with @sentry/browser when
    // building the browser's bundle
    if (!options.isServer) {
      config.resolve.alias["@sentry/node"] = "@sentry/browser";
    }

    // config.node = {
    //   fs: 'empty',
    // };

    // When all the Sentry configuration env variables are available/configured
    // The Sentry webpack plugin gets pushed to the webpack plugins to build
    // and upload the source maps to sentry.
    // This is an alternative to manually uploading the source maps
    // Note: This is disabled in development mode.
    if (
      SENTRY_DSN &&
      SENTRY_ORG &&
      SENTRY_PROJECT &&
      SENTRY_AUTH_TOKEN &&
      COMMIT_SHA &&
      NODE_ENV === "production"
    ) {
      config.plugins.push(
        new SentryWebpackPlugin({
          include: ".next",
          ignore: ["node_modules"],
          stripPrefix: ["webpack://_N_E/"],
          urlPrefix: `~${basePath}/_next`,
          release: COMMIT_SHA,
        })
      );
    }
    return config;
  },
  basePath,
  // your config for other plugins or the general next.js here...
  env: {
    AUTH0_CUSTOM_DOMAIN: process.env.AUTH0_CUSTOM_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    SCHEME: scheme,
    API_ENDPOINT: `${scheme}://${process.env.API_ENDPOINT}`,
    CDN_URL: `${scheme}://${process.env.CDN_URL}`,
    APP_URL: APPUrl,
    VERCEL_URL: process.env.VERCEL_URL,
    CONFIG_URL: process.env.CONFIG_URL,
    ESRI_CLIENT_ID: process.env.ESRI_CLIENT_ID,
    ESRI_CLIENT_SECRET: process.env.ESRI_CLIENT_SECRET,
    RECURRENCY: process.env.RECURRENCY,
    TRACKING_KEY: process.env.TRACKING_KEY,
    ENABLE_GOOGLE_PAY: process.env.ENABLE_GOOGLE_PAY,
    ENABLE_APPLE_PAY: process.env.ENABLE_APPLE_PAY,
    DISABLE_VERCEL_REDIRECT: process.env.DISABLE_VERCEL_REDIRECT,
  },
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  assetPrefix: hasAssetPrefix
    ? `${scheme}://${process.env.ASSET_PREFIX}`
    : undefined,
  // Asset Prefix allows to use CDN for the generated js files
  // https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
  i18n,
  images: {
    domains: ["cdn.plant-for-the-planet.org", "cdn.planetapp.workers.dev"],
  },
};

module.exports = () => {
  const plugins = [withBundleAnalyzer];
  return plugins.reduce((config, plugin) => plugin(config), nextConfig);
};
