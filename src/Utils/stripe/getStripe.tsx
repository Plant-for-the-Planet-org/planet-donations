import { Stripe, loadStripe, StripeElementLocale } from "@stripe/stripe-js";
import { PaymentOptions } from "src/Common/Types";

let stripePromise: Promise<Stripe | null>;

const getStripe = (
  paymentSetup: PaymentOptions,
  lang = "en"
): Promise<Stripe | null> => {
  const key =
    paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey;
  const account = paymentSetup?.gateways?.stripe?.authorization.accountId;
  stripePromise = loadStripe(key, {
    stripeAccount: account,
    locale: lang as StripeElementLocale,
  });
  return stripePromise;
};

export default getStripe;
