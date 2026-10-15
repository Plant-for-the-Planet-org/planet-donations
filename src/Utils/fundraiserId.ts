/**
 * Helpers for the `fundraiser_id` query parameter, which links a donation to a fundraiser.
 *
 * It takes the fundraiser guid (`fr_` + 12 characters) or, until the platform drops it after 2027-02-01, a legacy HID.
 * Legacy HIDs come in two shapes, for example `26NZ151G29` and slugs like `nature-conservation-day`, so the HID check is loose. The platform looks up the value and alerts on Slack when no fundraiser matches.
 * The platform still links a fundraiser through `utm_campaign` when `fundraiser.id` is absent, but that fallback is deprecated. Use `fundraiser_id` for new links.
 */

const FUNDRAISER_GUID = /^fr_[a-zA-Z0-9]{12}$/;
const LEGACY_HID = /^[a-zA-Z0-9-]{1,64}$/;

export function isValidFundraiserId(value: string): boolean {
  return FUNDRAISER_GUID.test(value) || LEGACY_HID.test(value);
}

/** The SDK types donation metadata as flat strings, but `fundraiser` is an object. */
export function getFundraiserId(metadata: unknown): string {
  const fundraiser = (metadata as { fundraiser?: { id?: unknown } } | undefined)
    ?.fundraiser;
  return typeof fundraiser?.id === "string" ? fundraiser.id : "";
}
