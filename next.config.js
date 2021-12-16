const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const { i18n } = require("./next-i18next.config");

const { withSentryConfig } = require("@sentry/nextjs");

const basePath = "";

const scheme =
  process.env.SCHEME === "http" || process.env.SCHEME === "https"
    ? process.env.SCHEME
    : "https";

let APPUrl;
if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
  APPUrl = `${scheme}://${process.env.VERCEL_URL}`;
} else {
  APPUrl = process.env.APP_URL;
}

const hasAssetPrefix =
  process.env.ASSET_PREFIX !== "" && process.env.ASSET_PREFIX !== undefined;

const moduleExports = withPlugins([[withBundleAnalyzer]], {
  productionBrowserSourceMaps: true,
  serverRuntimeConfig: {
    rootDir: __dirname,
  },
  webpack: (config, options) => {
    return config;
  },
  basePath,
  // your config for other plugins or the general next.js here...
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    AUTH0_CUSTOM_DOMAIN: process.env.AUTH0_CUSTOM_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    SCHEME: scheme,
    API_ENDPOINT: `${scheme}://${process.env.API_ENDPOINT}`,
    CDN_URL: `${scheme}://${process.env.CDN_URL}`,
    APP_URL: APPUrl,
    VERCEL_URL: process.env.VERCEL_URL,
    ESRI_CLIENT_ID: process.env.ESRI_CLIENT_ID,
    ESRI_CLIENT_SECRET: process.env.ESRI_CLIENT_SECRET,
    RECURRENCY: process.env.RECURRENCY,
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
  assetPrefix: hasAssetPrefix ? `${scheme}://${process.env.ASSET_PREFIX}` : "",
  // Asset Prefix allows to use CDN for the generated js files
  // https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
  i18n,
  images: {
    domains: ["cdn.plant-for-the-planet.org", "cdn.planetapp.workers.dev"],
  },
});

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
