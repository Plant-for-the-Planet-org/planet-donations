/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const { i18n } = require("./next-i18next.config");

const { withSentryConfig } = require("@sentry/nextjs");

const {
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
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

const sentryWebpackPluginOptions = {
  silent: false,
  authToken: SENTRY_AUTH_TOKEN,
  org: SENTRY_ORG,
  project: SENTRY_PROJECT,
  release: COMMIT_SHA,
};

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

module.exports = withSentryConfig(() => {
  const plugins = [withBundleAnalyzer];
  return plugins.reduce((config, plugin) => plugin(config), nextConfig);
}, sentryWebpackPluginOptions);
