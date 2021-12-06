import countriesData from "./countriesData.json";

export const setCountryCode = ({
  setcountry,
  setcurrency,
  profileCountry,
  configCountry,
  country,
}: {
  setcountry: (value: string) => {};
  setcurrency: (value: string) => {};
  profileCountry: string;
  configCountry: string;
  country: string;
}) => {
  if (
    localStorage.getItem("countryCode") &&
    localStorage.getItem("countryCode") !== "undefined"
  ) {
    setCountryInLocalAndContext(
      setcountry,
      setcurrency,
      localStorage.getItem("countryCode")
    );
  } else if (profileCountry) {
    setCountryInLocalAndContext(setcountry, setcurrency, profileCountry);
  } else if (configCountry) {
    setCountryInLocalAndContext(setcountry, setcurrency, configCountry);
  } else if (country && country !== undefined) {
    setCountryInLocalAndContext(setcountry, setcurrency, country);
  } else {
    setCountryInLocalAndContext(setcountry, setcurrency, "DE");
  }
};
export const setCountryInLocalAndContext = (
  setcountry: (value: string) => {},
  setcurrency: (value: string) => {},
  country: string
) => {
  setcountry(country);
  const countryData = countriesData.filter(
    (singleCountryData) => singleCountryData.countryCode == country
  )[0];
  if (countryData) {
    setcurrency(countryData.currencyCode);
  }
};
