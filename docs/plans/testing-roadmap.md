# Testing roadmap

planet-donations has no running tests today. The old Cypress suite (`cypress/`) stopped working after the upgrade from v8 to v15 and its workflow is off.
More PRs now come from AI agents as well as humans. We want a check on every PR that says "this broke the donation flow" or "this is fine", without someone testing by hand.

> Status: started 2026-11-20. Phase 0 (type check with a baseline) is in place. See the task list at the bottom for what is done and what is next.

## Decisions

- Two layers: unit tests for pure logic, plus a small set of end-to-end (E2E) tests in a real browser.
- Same tools as planet-webapp: Vitest for unit tests, Playwright for E2E. We copy its setup into this repo; there is no shared package for now. When a shared piece changes in one repo, update the other.
- E2E tests run against each PR's Vercel preview, which uses the staging API, like planet-webapp. There is no mock API.
- Payments: one basic Stripe test card payment runs on every PR. The full payment set (declined cards, 3D Secure, SEPA, bank transfer, recurring) runs only on release PRs (`develop` into `main`) and on manual runs.
- Cypress is not migrated. Its specs are a list of scenarios to cover. Each old spec is deleted once Playwright covers it.
- All new CI checks start as report-only. Once they have been stable for 1 to 2 weeks, a repo admin makes them required.
- `ignoreBuildErrors: true` stays in `next.config.js`. The CI type check is enough, same as planet-webapp.

## What to test, by payoff (not by coverage percent)

1. Pure logic: payload builders, amount and currency helpers, URL and project parsing, country rules. Fast, stable, and where many real bugs live.
2. Key flows in a browser: open a project, pick an amount, fill the contact form, reach payment, pay with a test card.
3. Payment variants: slower and more fragile, so they run on release PRs only.

Test behavior, not implementation. Check what the user or caller sees, not which internal function was called, so tests survive refactors.
Do not chase a coverage number. Cover the targets below, then add a test with every bug fix.

## Phase 0: Type check with a baseline (done)

- `npm run typecheck` runs `tsc --noEmit`.
- `npm run typecheck:baseline` runs `scripts/typecheck-baseline.mjs`. It fails only if there is a type error that is not in `.typecheck-baseline`, and prints just the new errors with their line numbers.
- `.typecheck-baseline` lists the known errors, one per line, as `file: code: message`. Line numbers are left out, so editing a file does not make its old errors look new. The same error can be listed more than once, and each copy counts.
- A PR that fixes one error and adds another still fails. Comparing counts alone would miss that.
- One case is not caught: fixing an error and adding the exact same error (same file, code and message) elsewhere in that file. Without line numbers the two look the same. This is the cost of leaving line numbers out, and it is most likely in `PaymentFunctions.ts`, which has 11 identical `TS18046` errors.
- `.github/workflows/typecheck.yml` runs the check on PRs to `develop` and `main`.
- The list starts with 67 errors in 22 files. They were hidden because the build ignores type errors.
- After fixing errors, run `npm run typecheck:baseline -- --update` and commit `.typecheck-baseline`. The PR diff then shows which errors were fixed. The check fails until you do, because a fixed error left in the list would let the same error come back unnoticed.
- An added line in `.typecheck-baseline` means someone accepted a new error. Reviewers should question it. The only good reason is code moving between files, or a TypeScript upgrade that changes error wording.
- `--update` refuses to run in CI, so CI can never accept a new error by itself.

## Fixing the 67 type errors

About 55 are type-only fixes that do not change how the app runs. About 5 may be real bugs.
We fix them in two PRs, so that payment code is only touched once unit tests cover it.

### PR A: non-payment errors (about 45, type-only)

- `src/Utils/browsercheck.ts`: add parameter types (13 errors).
- `src/Utils/api.ts`: change `tenant?: string` to `tenant?: string | null`. This fixes about 6 call sites.
- React 18 no longer adds `children` to props by default. Add `children: ReactNode` in `pages/_app.tsx`, `src/Layout/index.tsx` and `src/Donations/LeftPanel/*`.
- Small ones: `Nullable` is missing in `src/Common/Types/index.tsx`; add `declare module 'geocoder-arcgis'`; use `useState<CountryType>()` in `AutoCompleteCountry.tsx`; type the `createContext` call in `QueryParamContext.tsx`.
- Other `string | null` passed where `string` is expected.

### PR B: payment files and possible bugs (after Phase 1 covers `PaymentFunctions.ts`)

- `PaymentFunctions.ts`: `catch (error)` is `unknown` (11 errors); narrow it with `axios.isAxiosError`. Also fix the Stripe error shape (`paymentError.data`).
- `PaymentsForm.tsx`, `NewPaypal.tsx`, `DonationsForm.tsx`: `string | null` props.
- Stripe private fields (`_canMakePaymentAvailability`, `_activeBackingLibraryName`, `hasRegisteredListener`): add a cast for now. The code relies on Stripe internals for Apple Pay and Google Pay, which a Stripe update can break without warning. That is a separate follow-up.

Possible bugs to look into, each with a test if it turns out to be real:
- `src/Donations/Micros/PaymentStatus/FailedDonation.tsx:63` uses `donation.lineItems[0]`, but `lineItems` is not in the `Donation` type. If the API leaves it out and `units` is empty, the failed-donation screen crashes.
- `src/Donations/Micros/GiftForm.tsx:188` checks `classification !== "membership"`, but `"membership"` is not a valid value. Ask the backend team whether the type is out of date or the branch is dead.
- `src/Donations/Micros/PaymentStatus/TransferDetails.tsx:57` passes a string amount where a number is expected. Wrap it in `Number()`.
- `src/Donations/Micros/Authentication.tsx` builds a user object that does not match the `User` type.

After PR B the baseline list is empty. Switch CI to plain `npm run typecheck` and delete the baseline script and file.

## Phase 1: Unit tests with Vitest

Setup, copied from planet-webapp:
- `vitest.config.mts`: jsdom, `silent: 'passed-only'`, `clearMocks` and `restoreMocks`, a setup file. Change the alias to this repo's paths (`src/*`, `public/*`, `styles/*`).
- `src/test-utils/setup.ts`: Testing Library `cleanup()` after each test.
- `.github/workflows/test.yml`: runs Vitest on every PR.
- Scripts: `test`, `test:watch`, `test:verbose`.
- Tests live next to the code: `src/Utils/foo.ts` gets `src/Utils/foo.test.ts`.

First targets, highest value first:
- `src/Utils/projectIdentifier.ts`: `parseProjectParam`, `trimProjectIdentifier`, `isValidProjectIdentifier`. `middleware.ts` uses these, so a bug here breaks every donation link.
- `src/Donations/PaymentMethods/PaymentFunctions.ts`: `createDonationData`, `buildPaymentProviderRequest`, `getPaymentType`. These build what we send to the API.
- `src/Utils/stripe/stripeHelpers.tsx`: `formatAmountForStripe`, `formatAmountForDisplay`, including zero-decimal currencies.
- `src/Utils/getExchange.ts`: `getMinimumAmountForCurrency`.
- `src/Utils/donationOptions.ts`: `isPlanetCashCountryAllowed`, `isPlanetCashAllowed`. Guards the fix from PR #668.
- `middleware.ts`: repairs broken links such as `?to=yucatan%26step=donate`. planet-webapp's `middleware.test.ts` is a pattern to follow.
- Zip code validation with `src/Utils/countryZipCode.js` (moved here from the old Cypress form test).
- Then: `fundraiserId.ts`, `isEmailValid.ts`, `isSelfGift.ts`, `isGiftMessageBlacklisted.ts`, `getFormattedNumber.ts`, `getFormattedCurrency.ts`, `countryUtils.ts`, `projects/filterProjects.ts`.

## Phase 2: E2E tests with Playwright

Setup, copied from planet-webapp:
- `playwright.config.ts`: uses `PLAYWRIGHT_BASE_URL` (the preview) or the local dev server; 2 retries in CI; `trace: 'retain-on-failure'`; `locale: 'en-US'`; Chromium only.
- `e2e/support/fixtures.ts`: an extended `test` that fails when the page throws an uncaught error. Specs import `test` from here.
- Scripts: `test:e2e`, `test:e2e:ui`, `test:e2e:report`.
- Folders: `e2e/support/` for helpers and test data, `e2e/tests/` for specs.

Differences from planet-webapp:
- Set `testIdAttribute: 'data-test-id'`. The app still has these attributes from the Cypress days (`continue-next`, `test-firstName`, `test-donateButton`, `test-thankYou`, `donation-failed`, `selectCurrency`, `giftSubmit`, and more), so `page.getByTestId()` works with no new markup.
- `e2e/support/donation.ts`: helpers that replace `cypress/support/commands.js`, such as `openProject`, `chooseAmount`, `fillContactForm`, `payWithCard`, `addGift`. Fill Stripe card fields with `page.frameLocator()`.

Rules:
- Use a long-lived staging project (`yucatan`) for stable data.
- Use role and label selectors where they read better than test IDs.
- No fixed waits. The old Cypress specs waited 5 to 15 seconds at a time; use Playwright's auto-waiting assertions instead.
- Use the deployment URL from Vercel (`environment_url`), not the branch alias. The redirect in `pages/_app.tsx` drops the query string on the alias.

Tags:
- No tag: runs on every PR.
- `@release`: runs only on release PRs and manual runs.

Specs for every PR:
1. `?to=yucatan` shows the project and donation options.
2. Pick an amount, go to the contact form, and check that required-field errors show.
3. Fill the contact form and check that the payment step shows the payment methods.
4. The broken link `?to=yucatan%26step=donate` is repaired.
5. Gift donation shows the gift fields.
6. `/de` shows German text.
7. One card payment with Stripe test card `4242 4242 4242 4242` reaches the thank-you screen.

Specs tagged `@release`:
- Declined card (`4000 0000 0000 0002`), low funds (`4000 0000 0000 9995`), wrong CVC (`4000 0000 0000 0101`): an error shows and the donor can try again.
- 3D Secure card (`4000 0027 6000 3184`): the redirect comes back and shows success.
- Cards from other countries (Germany, Spain) and multi-tree donations.
- Bank transfer, SEPA, and PayPal sandbox if it can run headless (check first).
- Monthly and yearly donations, if recurring is on in staging.

## What the old Cypress specs covered, and where each scenario goes

| Old spec | What it checked | New home | Runs on |
|---|---|---|---|
| `donations.spec.js` | Card 4242 with a German address | `payment.spec.ts` | every PR |
| `donations.spec.js` | Gift, multi-tree, reference donation | `donation-options.spec.ts`, stops at the payment step | every PR |
| `donations.spec.js` | Declined card, low funds, CVC fail, German and Spanish cards | `payment-cards.spec.ts` | `@release` |
| `donations.spec.js` | Bank transfer | `payment-bank.spec.ts` | `@release` |
| `donations.spec.js` | Monthly and yearly (commented out) | `payment-recurring.spec.ts` | `@release`, if staging allows |
| `formError.spec.js` | Error for each empty or wrong contact field | `contact-form.spec.ts`, one test per field in a loop | every PR |
| `formError.spec.js` | Zip code format per country | Unit test with `countryZipCode.js` | Vitest |
| `languageTest.spec.js` | Payment works in 5 languages | `i18n.spec.ts`, checks text only, no payment | every PR |
| `bouquetDonations.spec.js` | Funding-type project | `bouquet.spec.ts`; needs a current staging project ID | every PR |

The old specs never covered PayPal, SEPA, Apple Pay, Google Pay, logged-in flows (Auth0, PlanetCash), fundraiser links, 3D Secure, or the link repair in the middleware.

## Removing Cypress, step by step

- Nothing changes until Playwright runs in CI.
- When a Playwright spec from the table above is merged, delete the old spec it replaces in the same PR. For example, the PR that adds `contact-form.spec.ts` deletes `formError.spec.js`.
- When the last old spec is gone, one small PR removes the rest: `cypress/`, `cypress.json`, `.github/workflows/cypress.yml`, the `cypress`, `cypress-plugin-stripe-elements` and `randexp` packages, the `cypress:*` scripts, the `cypress` entries in `tsconfig.json` `types`, and `CYPRESS_INSTALL_BINARY` in `typecheck.yml`.

## Phase 3: CI workflows

- `test.yml`: lint, type check and Vitest on every PR. Fold `eslint.yml` and `typecheck.yml` into it.
- `e2e.yml`: copied from planet-webapp. It runs when Vercel finishes a preview deployment, and uploads the Playwright report. Changes for this repo:
  - Look up the PR for the deployed commit (`gh api repos/{owner}/{repo}/commits/{sha}/pulls`, needs `pull-requests: read`).
  - If the PR targets `main`, run all specs. Otherwise skip `@release` specs (`--grep-invert @release`).
  - Add `workflow_dispatch` with a URL input to run all specs by hand.
- Check first: does Vercel make a Preview deployment for the `develop` branch? Release PRs are built from `develop`. If not, `e2e.yml` will not run for release PRs, and we need another trigger, such as the staging deployment.

## Phase 4: Make it stick

- Add a "Testing" section to `CLAUDE.md` and `CONTRIBUTING.md`: how to run tests, where they live, "every bug fix adds a test", "tag slow payment tests `@release`".
- Add a PR template checkbox: "Added or updated tests".
- After 1 to 2 weeks with no flaky runs, make the checks required on `develop` and `main`.

## Task list

- [x] Phase 0: `typecheck` script, baseline list of 67 known errors, `typecheck.yml` (report-only).
- [ ] PR A: fix non-payment type errors, update the baseline list.
- [ ] Phase 1: Vitest setup, `test.yml`, first unit tests.
- [ ] PR B: fix payment type errors and look into the possible bugs. Baseline list is empty; switch to plain `typecheck`.
- [ ] Phase 2 and 3: Playwright setup, `e2e.yml`, first specs for every PR.
- [ ] Port the remaining scenarios, one area per PR, deleting each old Cypress spec as it is covered.
- [ ] Remove the remaining Cypress tooling.
- [ ] Phase 4: docs and PR template; make checks required.
