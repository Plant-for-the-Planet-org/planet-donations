import { ReactElement } from "react";
import AmexIcon from "../../../public/assets/icons/CreditCardIcons/AmexIcon";
import DinersClub from "../../../public/assets/icons/CreditCardIcons/DinersClub";
import DiscoverIcon from "../../../public/assets/icons/CreditCardIcons/DiscoverIcon";
import JcbIcon from "../../../public/assets/icons/CreditCardIcons/JcbIcon";
import Mastercard from "../../../public/assets/icons/CreditCardIcons/Mastercard";
import StripeIcon from "../../../public/assets/icons/CreditCardIcons/StripeIcon";
import VisaIcon from "../../../public/assets/icons/CreditCardIcons/VisaIcon";

export function formatAmountForDisplay(
  amount: number,
  currency: string
): string {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  });
  return numberFormat.format(amount);
}

export function formatAmountForStripe(
  amount: number,
  currency: string
): number {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    maximumSignificantDigits: 21,
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;

  parts.forEach((part) => {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  });
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

export const getCardBrand = (brand: string): ReactElement => {
  switch (brand) {
    case "visa":
      return <VisaIcon color="currentColor" />;
    case "mastercard":
      return <Mastercard color="currentColor" />;
    case "amex":
      return <AmexIcon color="currentColor" />;
    case "discover":
      return <DiscoverIcon color="currentColor" />;
    case "diners":
      return <DinersClub color="currentColor" />;
    case "jcb":
      return <JcbIcon color="currentColor" />;
    case "unionpay":
      return <StripeIcon color="currentColor" />;
    case "unknown":
      return <StripeIcon color="currentColor" />;
    default:
      return <StripeIcon color="currentColor" />;
  }
};
