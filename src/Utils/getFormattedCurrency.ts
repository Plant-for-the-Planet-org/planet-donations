export default function getFormatedCurrency(
  langCode: string,
  currency: string,
  number: number
): string {
  let options: Intl.NumberFormatOptions = {
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  if (currency) {
    options = {
      style: "currency",
      currency: currency,
      ...options,
    };
  }
  const formatter = new Intl.NumberFormat(langCode, options);
  return formatter.format(number);
}

export function getFormatedCurrencySymbol(
  currency: string
): string | undefined {
  let options: Intl.NumberFormatOptions = {
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  if (currency) {
    options = {
      style: "currency",
      currency: currency,
      ...options,
    };
  }
  const symbol = new Intl.NumberFormat("en", options)
    .formatToParts(0)
    .find((part) => part.type === "currency")?.value;
  return symbol;
}
