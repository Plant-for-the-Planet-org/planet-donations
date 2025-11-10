import { Stripe, loadStripe, StripeElementLocale } from "@stripe/stripe-js";

const stripePromiseCache = new Map<string, Promise<Stripe | null>>();

const getStripe = (stripeKey: string, lang = "en"): Promise<Stripe | null> => {
  const cacheKey = `${stripeKey}-${lang}`;

  const cachedPromise = stripePromiseCache.get(cacheKey);
  if (cachedPromise) {
    return cachedPromise;
  }

  const promise = loadStripe(stripeKey, {
    locale: lang as StripeElementLocale,
  });
  stripePromiseCache.set(cacheKey, promise);
  return promise;
};

export default getStripe;
