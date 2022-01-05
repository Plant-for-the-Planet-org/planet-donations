import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

const getStripe = (paymentSetup: any) => {
  // const lang = localStorage.getItem("language") || "en";
  // const key = paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey
  //   ? paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey
  //   : paymentSetup?.gateways?.stripe?.stripePublishableKey;
  // const account = paymentSetup?.gateways?.stripe?.authorization.accountId;
  // console.log(`key,{stripeAccount:account,locale:lang}`, key, {
  //   stripeAccount: account,
  //   locale: lang,
  // });
  // stripePromise = loadStripe(key, { stripeAccount: account, locale: lang });
  stripePromise = loadStripe("pk_test_zOadi2MBKX0gATOBvc3fzdRY00SLVj1YvJ", {
    stripeAccount: "acct_1DYCMDD2OpW2f42N",
    locale: "en",
  });
  return stripePromise;
};

export default getStripe;
