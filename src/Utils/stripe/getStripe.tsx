import { Stripe, loadStripe } from "@stripe/stripe-js";
import { PaymentOptions } from "src/Common/Types";

let stripePromise: Promise<Stripe | null>;

const getStripe = (paymentSetup: PaymentOptions) => {
  const lang = localStorage.getItem("language") || "en";
  const key =
    paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey;
  // Remove code below after confirmation that stripePublishableKey is only within authorization
  /*  ? paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey
    : paymentSetup?.gateways?.stripe?.stripePublishableKey; */
  const account = paymentSetup?.gateways?.stripe?.authorization.accountId;
  stripePromise = loadStripe(key, { stripeAccount: account, locale: lang });
  return stripePromise;
};

export default getStripe;
