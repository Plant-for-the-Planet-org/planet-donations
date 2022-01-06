import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

const getStripe = (paymentSetup: any) => {
  const lang = localStorage.getItem("language") || "en";
  const key = paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey
    ? paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey
    : paymentSetup?.gateways?.stripe?.stripePublishableKey;
  const account = paymentSetup?.gateways?.stripe?.authorization.accountId;
  console.log(`key,{stripeAccount:account,locale:lang}`, key, {
    stripeAccount: account,
    locale: lang,
  });
  stripePromise = loadStripe(key, { stripeAccount: account, locale: lang });

  return stripePromise;
};

export default getStripe;
