/**
 * Helpers for the `fundraiser_id` query parameter, which links a donation to a fundraiser.
 *
 * It takes the fundraiser guid (`fr_` + 12 characters) or, until the platform drops it after 2027-02-01, a legacy HID (2-digit year + 8 characters).
 * `utm_campaign` is only a campaign tag and never links a fundraiser.
 */

const FUNDRAISER_GUID = /^fr_[a-zA-Z0-9]{12}$/;
const LEGACY_HID = /^\d{2}[0-9A-Z]{8}$/;

export function isValidFundraiserId(value: string): boolean {
  return FUNDRAISER_GUID.test(value) || LEGACY_HID.test(value);
}

/** The SDK types donation metadata as flat strings, but `fundraiser` is an object. */
export function getFundraiserId(metadata: unknown): string {
  const fundraiser = (metadata as { fundraiser?: { id?: unknown } } | undefined)
    ?.fundraiser;
  return typeof fundraiser?.id === "string" ? fundraiser.id : "";
}
