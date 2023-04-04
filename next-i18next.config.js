/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  i18n: {
    // debug: true,
    defaultLocale: "en", //Do not change this
    locales: ["en", "cs", "de", "it", "es", "fr", "pt-BR"], //If you change this, update ALLOWED_LOCALES in middleware.ts
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/public/locales",
  returnNull: false,
};
