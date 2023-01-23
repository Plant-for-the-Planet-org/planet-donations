import supportedLanguages from "../../supportedLanguages.json";
/**
 * * Returns country details by searching country data json file and options
 * @param {string} code - language Code
 * @returns {string} language name
 */
// @ankit please check this function always
// eslint-disable-next-line consistent-return
export default function getLanguageName(code: string): string {
  // Finds required language name from the code
  for (let i = 0; i < supportedLanguages.length; i++) {
    if (supportedLanguages[i].langCode === code) {
      return supportedLanguages[i].languageName;
    }
  }
  // returns English as default language if none matches
  return "English";
}
