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
  let newCountry: string = "DE";
  if (
    localStorage.getItem("countryCode") &&
    localStorage.getItem("countryCode") !== "undefined"
  ) {
    newCountry = localStorage.getItem("countryCode");
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
  setcountry: (value: string) => {},
  setcurrency: (value: string) => {},
  country: string
) => {
  setcountry(country);
  const countryData = countriesData.filter(
    (singleCountryData) => singleCountryData.countryCode == country
  )[0];
  if (countryData?.currencyCode) {
    setcurrency(countryData.currencyCode);
  }
};
