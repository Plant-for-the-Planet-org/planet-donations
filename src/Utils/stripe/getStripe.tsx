import { Stripe, loadStripe, StripeElementLocale } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

const getStripe = (stripeKey: string, lang = "en"): Promise<Stripe | null> => {
  stripePromise = loadStripe(stripeKey, {
    locale: lang as StripeElementLocale,
  });
  return stripePromise;
};

export default getStripe;
