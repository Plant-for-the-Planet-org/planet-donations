import countriesData from "./countriesData.json";
import { Country, CountryProperty, CurrencyList } from "src/Common/Types";
import { TFunction } from "react-i18next";

const sortedCountries: { [key: string]: Country[] } = {};

/**
 * * Returns country details by searching country data json file and options
 * @param {String} key - deciding factor to find country data from can hold values
 *        countryCode || countryName || currencyName || currencyCode || currencyCountryFlag
 *
 * @param {String} value - value of the key to compare with
 *
 * @returns {Object} contains
 *  - {countryCode, countryName, currencyName, currencyCode, currencyCountryFlag}
 */
// eslint-disable-next-line consistent-return
export function getCountryDataBy(
  key: CountryProperty,
  value: string
): Country | undefined {
  // Finds required country data from the country data array and returns the
  // matched country result
  for (let i = 0; i < countriesData.length; i += 1) {
    if (countriesData[i][key] === value) {
      return countriesData[i];
    }
  }
}

/**
 * Sorts the countries array in the required format
 * @param {String} sortBy - can have values
 *    countryName, currencyName, currencyCode, currencyCountryFlag
 */
export function sortCountriesData(sortBy: CountryProperty): Country[] {
  // returns a sorted array which is sorted by passed value
  return countriesData.sort((a, b) => {
    if (a[sortBy] > b[sortBy]) {
      return 1;
    }
    if (a[sortBy] < b[sortBy]) {
      return -1;
    }
    return 0;
  });
}

/**
 * Filters countries array and returns countries with enabled currencies (for payment)
 * @param countriesData
 * @param enabledCurrencies
 * @returns {CountriesArray} Countries with currencies enabled for payment
 */
function filterByEnabledCurrencies(
  countriesData: Country[],
  enabledCurrencies: CurrencyList
) {
  return countriesData.filter((country) => {
    return enabledCurrencies[country.currencyCode] !== undefined;
  });
}

/**
 * Sorts the countries array for the translated country name
 * @param {Function} t - translation function
 * @param {String} language - language to get country names for
 * @param {Array} priorityCountries - country code to always show first in given order
 * @param {CurrencyList} enabledCurrencies - object containing enabled currencies
 */
export function sortCountriesByTranslation(
  t: TFunction,
  language: string,
  priorityCountryCodes: string[],
  enabledCurrencies: CurrencyList | null
): Country[] {
  const key = `${language}.${priorityCountryCodes}`;
  if (!sortedCountries[key]) {
    const priorityCountries: Country[] = [];
    // filter priority countries from list
    const filteredCountries = enabledCurrencies
      ? filterByEnabledCurrencies(countriesData, enabledCurrencies).filter(
          function (value) {
            if (priorityCountryCodes?.includes(value.countryCode)) {
              priorityCountries.push(value);
              return false;
            } else {
              return true;
            }
          }
        )
      : countriesData;
    // sort array of countries
    sortedCountries[key] = priorityCountries.concat(
      filteredCountries.sort((a, b) => {
        const nameA = t(`country:${a.countryCode.toLowerCase()}`);
        const nameB = t(`country:${b.countryCode.toLowerCase()}`);
        if (nameA > nameB) {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }
        return 0;
      })
    );
  }
  return sortedCountries[key];
}

export const stripeAllowedCountries = [
  "AE",
  "AT",
  "AU",
  "BE",
  "BG",
  "BR",
  "CA",
  "CH",
  "CI",
  "CR",
  "CY",
  "CZ",
  "DE",
  "DK",
  "DO",
  "EE",
  "ES",
  "FI",
  "FR",
  "GB",
  "GR",
  "GT",
  "HK",
  "HU",
  "ID",
  "IE",
  "IN",
  "IT",
  "JP",
  "LT",
  "LU",
  "LV",
  "MT",
  "MX",
  "MY",
  "NL",
  "NO",
  "NZ",
  "PE",
  "PH",
  "PL",
  "PT",
  "RO",
  "SE",
  "SG",
  "SI",
  "SK",
  "SN",
  "TH",
  "TT",
  "US",
  "UY",
];
