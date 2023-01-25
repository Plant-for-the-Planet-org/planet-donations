import countryExchange from "./countryExchangeForMinimumDonationAmount.json";

export const getMinimumAmountForCurrency = (currency: string): number => {
  const exchange = countryExchange.find(
    (element) => element.currencyCode === currency
  );
  if (exchange) return exchange.value * 2;
  else return -1;
};
