# Next.js 16 Upgrade Roadmap

For `planet-donations` (donate.plant-for-the-planet.org). Based on `develop` at `854ac45`. Facts checked on 2026-10-07 against the repo, GitHub and the [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16).

## Goal

| | Today | Target |
| --- | --- | --- |
| Next.js | 14.2.35 | 16.x (16.3.8 is the newest 16.3 patch; 16.4.0 came out on 2026-10-06) |
| React | 18.3.1 | 18.3.1 (no change) |
| Router | Pages Router | Pages Router (no change) |
| Bundler | webpack + Babel (`.babelrc`) | Turbopack + SWC |
| Node | 22.x | 22.x (Next 16 needs 20.9+) |

**Why:** 23 open Dependabot alerts for `next` (2 critical, 8 high) and 4 for `postcss` (2 high, bundled inside Next 14). There is no 14.x fix. Fixes exist only in 15.5.x and 16.x. The open alerts need 15.5.24+, and newer advisories (2026-09-30) need 15.5.27.

**Alerts that apply to us** (we use Pages Router, no Server Actions): Image Optimization API issues (incl. a critical RCE with AVIF), "Middleware / Proxy bypass in Pages Router applications using i18n", and "Middleware / Proxy redirects can be cache-poisoned".

**What blocks a plain version bump** (found in a trial build):

1. Next 16 builds with Turbopack by default and fails when it finds a custom `webpack` config. We have one (Sentry), and `@next/bundle-analyzer` v10 adds one too.
2. `next/config` and `serverRuntimeConfig` were removed. [pages/_app.tsx:4](pages/_app.tsx#L4) imports `next/config`.
3. Under Turbopack, our webpack alias `@sentry/node` → `@sentry/browser` is ignored, so Node-only code ends up in the browser bundle.

**Approach:** 5 small PRs, each shipped and checked on its own, so each one can be rolled back alone.

## Phase overview

| Phase | What | PR / branch | Effort | Ships on |
| --- | --- | --- | --- | --- |
| 0 | Prepare, no code | #629 release, decisions | 0.5 day | Next 14 |
| 1 | Sentry v6 → `@sentry/nextjs` | #499, `feature/sentry-package-upgrade` | 0.5 to 1 day | Next 14 |
| 2 | Clean-ups safe on 14 and 16 | `feature/prepare-nextjs-16` | 0.5 day | Next 14 |
| 3 | Next 16, still on webpack | `feature/nextjs-16` | 1 day | Next 16 |
| 4 | Turbopack + SWC | `feature/turbopack` | 0.5 to 1 day | Next 16 |
| 5 | `middleware` → `proxy` | `feature/middleware-to-proxy` | 0.5 day | Next 16 |
| 6 | Optional follow-ups | separate projects | - | Next 16 |

Effort is for one developer and includes testing on a Vercel preview.

## Current status

`feature/nextjs-16` is branched from `feature/sentry-package-upgrade` (#499), so it already has the Sentry changes. On top of that it has:

- Phase 2, step 1: `serverRuntimeConfig` and the `images` block removed from `next.config.js`.
- Phase 3, steps 1 to 4: Next 16.3.8 (`~16.3.8`), `--webpack` scripts, the `tsconfig.json` changes Next makes, and the PayPal type import fix.
- `next-env.d.ts` is no longer tracked (Next rewrites it differently for `dev` and `build`), and `*.tsbuildinfo` is ignored.
- `baseUrl` in `tsconfig.json` is replaced with `paths` for `src/*`, `public/*` and `styles/*` (TypeScript 6 deprecates `baseUrl`).

Checked locally: clean `next build` passes, `tsc` shows the same 67 errors as `develop`, lint passes, and the redirect and SSR smoke tests match the trial. `/api/image` could not be tested on Windows and needs the Vercel preview.

Merge order: #499 first, released and watched on its own. Then point this PR at `develop`.

---

## Phase 0: Prepare

No code changes.

1. Release PR #629 (`develop` → `main`, the merged Dependabot updates incl. axios 1.20). Check project load and donation creation on production.
2. Review and merge PR #616 (`welcomePackageLanguage`), so it is tested on Next 14 and needs no rebase across the upgrade. Small conflict risk with Phase 2 (one import line in `QueryParamContext.tsx`).
3. Close #621 and #613 (Dependabot `next` 16 bumps), with a link to this roadmap. They only change `package.json` and the lockfile, so their Vercel builds fail. #613 also has merge conflicts now.
4. Decide the browser floor (see "Decisions needed"). Look at browser and OS data for the last 90 days in Vercel Analytics or Sentry. The decision must be ready before Phase 3, because Next 16's new default targets apply from the version bump, not from the bundler change.
5. Check Vercel project settings: Node 22.x, build command `npm run build`, and `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `NEXT_PUBLIC_SENTRY_DSN` set for Production and Preview.
6. Record a production baseline: Sentry error rate, Web Vitals, donation conversion, and screenshots of key screens in `en` and `de` on mobile and desktop.
7. Agree on a release window. Avoid campaign peaks (for example December). Release early in the week, in working hours, with someone watching Sentry.
8. Book QA time and set up staging test accounts: Auth0 user, Stripe test cards (card, SEPA, Apple Pay, Google Pay), PayPal sandbox, a PlanetCash account, a membership project. There are no automated end-to-end tests (the Cypress workflow is turned off).

**Done when:** #629 is on production, the baseline is recorded, and the browser decision is made.

---

## Phase 1: Sentry to `@sentry/nextjs` (PR #499)

Still on Next 14. PR #499 moves Sentry v6 to `@sentry/nextjs` 11.4. It removes our `webpack` function, the `@sentry/node` alias, `@sentry/webpack-plugin` and the `next/config` import, and adds `instrumentation.ts` and `instrumentation-client.ts`. This removes blockers 1 (our part), 2 (the import) and 3.

Before merge:

1. Use `pages/sentry-test.tsx` on the preview to throw client errors. Also throw one in `getServerSideProps` and one in `/api/image`. Check each one reaches Sentry with a readable stack trace and the right release (commit SHA).
2. On Next 14, `instrumentation.ts` only runs with `experimental.instrumentationHook: true`. If server errors do not reach Sentry, set the flag in `next.config.js`.
3. `onRequestError` only works from Next 15. Add a Sentry `pages/_error.tsx` (with `captureUnderscoreErrorException`) so SSR errors are not missed.
4. Optional: remove `serverRuntimeConfig` from `next.config.js` here (nothing reads it after #499), otherwise do it in Phase 2.
5. Delete `pages/sentry-test.tsx` (the file says so itself).
6. Note: #499 adds `@babel/core` as a dev dependency. It is removed in Phase 4.

After release: watch Sentry for a day. The error rate should match the baseline and `ignoreErrors` should still filter noise.

**Closes:** the `@sentry/browser` and `cookie` alerts.

**Why first:** it removes the biggest Next 16 blockers while everything else stays the same. If Sentry breaks, we find it on Next 14, not mixed with the upgrade.

---

## Phase 2: Clean-ups that work on Next 14 and 16

1. [next.config.js](next.config.js): remove `serverRuntimeConfig` and the `images` block. `images.domains` is deprecated and we do not use `next/image`. Removing it also closes the optimizer to remote images. Done on `feature/nextjs-16`.
2. [src/Layout/QueryParamContext.tsx:1](src/Layout/QueryParamContext.tsx#L1): change `next/dist/client/router` (internal path) to `next/router`.
3. [src/Common/ErrorPopup/ErrorPopup.module.scss:78-81](src/Common/ErrorPopup/ErrorPopup.module.scss#L78-L81): delete the `:export` block. Turbopack cannot parse it and no JS reads these values.
4. Upgrade `@next/bundle-analyzer` from 10.2.3 to 16.x. v10 always adds a `webpack` key, which breaks Turbopack builds.
5. Remove `eslint-config-next` from `devDependencies`. It is installed but not used in [.eslintrc.js](.eslintrc.js).
6. [.github/workflows/eslint.yml:18](.github/workflows/eslint.yml#L18): change Node `18.x` to `22.x`.
7. Add `.nvmrc` with `22`, to match `engines` and Vercel.

Ship to production on Next 14 and watch for a day.

**Why before the bump:** shipping these alone proves they are safe, and the Next 16 PR shrinks to almost only a version change.

---

## Phase 3: Next.js 16, still on webpack

Steps 1 to 4 are done on `feature/nextjs-16`.

1. Install Next 16.3 (`~16.3.8`), the line the trial build tested. 16.4.0 is now `latest` but untested here; if we pick it, test the build again first. Keep React 18 (Next 16 supports `^18.2.0 || ^19.0.0`).
2. Set scripts to `next dev --webpack` and `next build --webpack`.
3. Run `npm run build` once. Commit the `tsconfig.json` changes Next makes (`moduleResolution: "bundler"`, `jsx: "react-jsx"`). Stop tracking `next-env.d.ts`, because Next rewrites it differently for `dev` and `build`.
4. Fix the one new type error: in [src/Common/Types/index.tsx:2](src/Common/Types/index.tsx#L2), import `OnApproveData` from `"@paypal/paypal-js"` instead of `"@paypal/paypal-js/types/components/buttons"`.
5. Apply the browser decision: either update [src/Utils/browsercheck.ts:49](src/Utils/browsercheck.ts#L49) to the new floor (today it only blocks Safari below 13), or add a `browserslist` field to `package.json` to keep older targets. Test an old Safari (below 16.4) on the preview.
6. Remove `experimental.instrumentationHook` if it was added in Phase 1. Check that `onRequestError` now reports SSR errors to Sentry.
7. Keep `middleware.ts`. Expect a deprecation warning. The build also warns that Next's own code and Sentry's Edge code use Node.js APIs in the Edge bundle; check the middleware on the preview.
8. From 16.3, `next dev` writes an `AGENTS.md` file when it detects a coding agent (it can be turned off with the `agentRules` option). Decide whether to commit or ignore it.
9. Do not run the full `npx @next/codemod@canary upgrade`. It also renames middleware and changes config, which we do in later steps.
10. Run the full testing checklist on the Vercel preview, then release.

**Closes:** all open `next` and `postcss` alerts.

**Why webpack first:** closes the security alerts with the smallest change in behaviour. The bundler swap is a separate risk. Phases 3 and 4 can be joined if the team prefers fewer releases.

**Fallback:** if Next 16 shows a blocker we cannot fix fast, use the latest Next 15.5.x (15.5.27 or newer). It has the security fixes, builds with webpack by default and accepts `middleware.ts`. Phase 1 and 2 work is needed for 15.5 too.

---

## Phase 4: Turbopack and SWC

1. Remove `--webpack` from the scripts.
2. Delete [.babelrc](.babelrc), `@babel/plugin-transform-unicode-regex` and `@babel/core`. The plugin is not needed for Next 16's browser targets (the `\p{L}` regexes in `ContactsForm.tsx` run natively).
3. Repeat the old-browser test from Phase 3, since SWC now replaces Babel.
4. Check that the build shows no `webpack config` error and no Babel message.
5. Compare screenshots with the Phase 0 baseline. CSS order between global SCSS, CSS Modules, Emotion and styled-jsx can change with a new bundler.
6. Repeat the Sentry checks from Phase 1 (Turbopack source maps).
7. For bundle analysis, use `next analyze` (Turbopack). `@next/bundle-analyzer` only works with `--webpack`.

**Why here:** by now nothing depends on webpack, so this PR is only about the bundler.

---

## Phase 5: `middleware` to `proxy`

1. Run `npx @next/codemod@canary middleware-to-proxy .` (renames [middleware.ts](middleware.ts) to `proxy.ts` and the function `middleware` to `proxy`).
2. Remove `sentry.edge.config.ts` if one was added and nothing else runs on Edge.
3. Test every redirect: `?locale=`, the `NEXT_LOCALE` cookie, tenant language rules, `?to=` link repair, `?s=` removal, static files and `/api/*` skipped.
4. After release, watch Vercel function latency, errors and cost.

**Why last and alone:** `middleware.ts` still works in Next 16 (only deprecated). `proxy` always runs on Node.js, not Edge, which can change cold starts and cost. Keeping it separate makes it easy to measure and roll back.

---

## Phase 6: Optional follow-ups

Not needed for Next 16. Each is its own project, in any order, once Phase 5 is stable.

- React 19: replace `ReactDOM.findDOMNode` in [ShareOptions.tsx:63](src/Donations/Micros/ShareOptions.tsx#L63), upgrade `@auth0/auth0-react` to v2, the Stripe React packages and `@types/react` to 19.
- `next-i18next` 16 with `i18next` and `react-i18next` upgrades, as one set.
- ESLint 9 flat config (drop ESLint 7 and `@typescript-eslint` 4).
- Sass `@import` → `@use` (8 files).
- Bring Cypress back (see [cypress/MIGRATION.md](cypress/MIGRATION.md)) and turn its workflow on again.
- MUI upgrade.
- Fix the existing type errors and turn off `ignoreBuildErrors`.

Out of scope: the `node-fetch` alert (from `geocoder-arcgis`), and the dev-only `uuid` and `sprintf-js` alerts.

---

## Testing checklist

Run all of it on the Vercel preview for Phases 3 and 4. For Phases 1, 2 and 5, run the marked parts plus a short pass over the donation flows.

**Build and tooling**

- [ ] `npm ci` passes with no `ERESOLVE` errors.
- [ ] `npm run build` passes. Only known warnings (Sass `@import`, and the middleware warning until Phase 5).
- [ ] `npm run lint:errors` passes, locally and in CI.
- [ ] `npx tsc --noEmit` shows no new errors (67 on a clean `npm ci` of `develop`).
- [ ] `npm run dev` starts and hot reload works.
- [ ] Vercel preview deploy is green.

**Routing and middleware** [Phase 5]

- [ ] `/` and `/de` return 200.
- [ ] `/?locale=de` redirects to `/de` and sets `NEXT_LOCALE=de`. `/?locale=xx` falls back. No loop with an existing cookie.
- [ ] A tenant with an unsupported locale redirects to its first language.
- [ ] `/?to=yucatan%26step=donate` is repaired to `/?to=yucatan&step=donate`.
- [ ] `/?s=<id>` on a project that cannot take gifts redirects with `s` removed.
- [ ] Unknown paths show the 404 page. `/auth` returns to the saved `redirectPath`.
- [ ] On previews, the `VERCEL_URL` redirect in `_app.tsx` still works.

**Server rendering and translations**

- [ ] Project page has the right `<title>`, description, `og:*` and `twitter:*` tags.
- [ ] `og:image` (`/api/image?path=…`) returns a PNG within Vercel size and time limits.
- [ ] `?context=<donationId>`, `?s=`, `?gift=true`, `utm_*`, `callback_url` and `country` work.
- [ ] All 7 locales (`en`, `cs`, `de`, `it`, `es`, `fr`, `pt-BR`) show translated text on first load and after switching.

**Donation flows** (staging)

- [ ] Tree, funding, bouquet and membership donations, one-time and recurring.
- [ ] Card, SEPA, PayPal, Apple Pay, Google Pay, bank transfer, PlanetCash.
- [ ] Tax country, currency and minimum amount rules. Gift, on-behalf and contact form validation.
- [ ] Thank-you, failed and pending pages, share buttons, "download image".
- [ ] Auth0 login, logout and redirect back to the same page and locale.

**Look and feel** [Phases 2 and 4]

- [ ] Screens match the Phase 0 screenshots on mobile and desktop. No flash of unstyled content.
- [ ] Error popup looks the same after removing `:export`.

**Monitoring** [Phases 1, 3 and 4]

- [ ] Client, SSR and API errors reach Sentry with readable stack traces and the right release.
- [ ] `ignoreErrors` still filters noise.

**Browsers** [Phases 3 and 4]

- [ ] Latest Chrome, Firefox, Safari, Edge, iOS Safari 16.4+, Samsung Internet, Android Chrome.
- [ ] The oldest agreed browser works, and one below it shows "browser not supported", not a blank page.

**After each release**

- [ ] Watch Sentry and Vercel function errors for 24 to 48 hours against the baseline.
- [ ] Compare conversion and Web Vitals after one week.
- [ ] Check that the expected Dependabot alerts are closed.

---

## Rollback

- One PR per phase, merged as one commit, so `git revert <commit>` undoes one phase.
- Vercel Instant Rollback: note the current production deployment before each release. Promote it again if needed.
- No phase changes the API, the database, cookies or local storage, so rollback is safe at any time.
- Do not start Phase 3 until Sentry works on `@sentry/nextjs`.
- Rolling back Phase 3 reopens the security alerts. Use Next 15.5.x as the fallback.
- Phase 5: rename `proxy.ts` back to `middleware.ts`.

---

## Decisions needed

1. **Browser floor:** accept Next 16's default (Safari 16.4+, Chrome 111+), or keep older browsers with `browserslist`? Needs browser data, and must be decided before Phase 3.
2. **Path:** straight to Next 16 (recommended) or 15.5.x first?
3. **PR #616:** merge before the upgrade (recommended) or after Phase 3?
4. **Phases 3 and 4:** two releases (recommended) or one?
5. **Proxy:** rename in Phase 5, or stay on Edge middleware for now?
6. **Cypress:** bring back before Phase 3 (safer, slower) or in Phase 6?
7. **`AGENTS.md`:** commit it or add it to `.gitignore`?
