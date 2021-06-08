import AmexIcon from '../../../public/assets/icons/CreditCardIcons/AmexIcon';
import DinersClub from '../../../public/assets/icons/CreditCardIcons/DinersClub';
import DiscoverIcon from '../../../public/assets/icons/CreditCardIcons/DiscoverIcon';
import JcbIcon from '../../../public/assets/icons/CreditCardIcons/JcbIcon';
import Mastercard from '../../../public/assets/icons/CreditCardIcons/Mastercard';
import StripeIcon from '../../../public/assets/icons/CreditCardIcons/StripeIcon';
import VisaIcon from '../../../public/assets/icons/CreditCardIcons/VisaIcon';

export function formatAmountForDisplay(
  amount: number,
  currency: string,
): string {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  });
  return numberFormat.format(amount);
}

export function formatAmountForStripe(
  amount: number,
  currency: string,
): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;

  parts.forEach((part) => {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  });
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

export const getCardBrand = (brand: String) => {
  switch (brand) {
    case 'visa':
      return <VisaIcon />;
    case 'mastercard':
      return <Mastercard />;
    case 'amex':
      return <AmexIcon />;
    case 'discover':
      return <DiscoverIcon />;
    case 'diners':
      return <DinersClub />;
    case 'jcb':
      return <JcbIcon />;
    case 'unionpay':
      return <StripeIcon />;
    case 'unknown':
      return <StripeIcon />;
    default:
      return <StripeIcon />;
  }
};
