import { Stripe, loadStripe, StripeElementLocale } from "@stripe/stripe-js";

// Cache is unbounded, but practically this can have a maximum of 35 entries (5 Stripe keys × 7 locales).
// This will happen only in testing cases.
// For most users, the cache size will be a maximum of 10 entries (loading payment setups containing 5 different Stripe keys in 2 languages).
// No cache eviction needed given the small, fixed size.
const stripePromiseCache = new Map<string, Promise<Stripe | null>>();

const getStripe = (stripeKey: string, lang = "en"): Promise<Stripe | null> => {
  const cacheKey = `${stripeKey}-${lang}`;

  const cachedPromise = stripePromiseCache.get(cacheKey);
  if (cachedPromise) {
    return cachedPromise;
  }

  const promise = loadStripe(stripeKey, {
    locale: lang as StripeElementLocale,
  }).catch((error) => {
    stripePromiseCache.delete(cacheKey);
    throw error;
  });

  stripePromiseCache.set(cacheKey, promise);
  return promise;
};

export default getStripe;
