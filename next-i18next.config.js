/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  i18n: {
    // debug: true,
    defaultLocale: "en",
    locales: ["en", "cs", "de", "it", "es", "fr", "pt-BR"],
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/public/locales",
};
