import countriesData from "./countriesData.json";

export const setCountryCode = ({
  setcountry,
  setcurrency,
  profileCountry,
  configCountry,
  country,
}: {
  setcountry: (value: string) => void;
  setcurrency: (value: string) => void;
  profileCountry?: string;
  configCountry?: string;
  country?: string;
}): void => {
  let newCountry: string | null = "DE";
  if (
    localStorage.getItem("countryCode") &&
    localStorage.getItem("countryCode") !== "undefined"
  ) {
    newCountry = localStorage.getItem("countryCode") as string;
  } else if (profileCountry) {
    newCountry = profileCountry;
  } else if (configCountry) {
    newCountry = configCountry;
  } else if (country && country !== undefined) {
    newCountry = country;
  }
  setCountryInLocalAndContext(setcountry, setcurrency, newCountry);
};

export const setCountryInLocalAndContext = (
  setcountry: (value: string) => void,
  setcurrency: (value: string) => void,
  country: string
): void => {
  setcountry(country);
  const countryData = countriesData.filter(
    (singleCountryData) => singleCountryData.countryCode == country
  )[0];
  if (countryData?.currencyCode) {
    setcurrency(countryData.currencyCode);
  }
};
