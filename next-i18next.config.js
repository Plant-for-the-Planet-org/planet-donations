const path = require('path');
module.exports = {
  i18n: {
    // debug: true,
    localeDetection: false,
    defaultLocale: "en",
    locales: ["en", "cs", "de", "it", "es", "fr", "pt-BR"],
    localePath: path.resolve('./public/locales')
  },
};
