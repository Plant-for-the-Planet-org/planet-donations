import { Stripe, loadStripe } from "@stripe/stripe-js";
import { PaymentSetup } from "../../../src/Donations/PaymentMethods/Interfaces";

let stripePromise: Promise<Stripe | null>;

const getStripe = (paymentSetup: PaymentSetup) => {
  const lang = localStorage.getItem("language") || "en";
  const key = paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey
    ? paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey
    : paymentSetup?.gateways?.stripe?.stripePublishableKey;
  const account = paymentSetup?.gateways?.stripe?.authorization.accountId;
  stripePromise = loadStripe(key, { stripeAccount: account, locale: lang });
  return stripePromise;
};

export default getStripe;
