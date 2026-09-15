/**
 * Helpers for the `to` query parameter, which carries a project slug or guid.
 *
 * Link builders sometimes escape the `&` separators of a donate link, so the rest of the query string arrives inside `to`.
 * `?to=yucatan%26step=donate` reaches us as `to = "yucatan&step=donate"`.
 * These functions are pure and free of Node imports so they also run in the Edge middleware.
 */

const QUERY_SEPARATOR = /[&?#]/;
const VALID_IDENTIFIER = /^[A-Za-z0-9_-]+$/;
const TRAILING_PUNCTUATION = /[.,)"'-]+$/;

/**
 * Splits a query string that ended up inside the `to` value.
 * Returns null when there is nothing to repair.
 */
export function parseProjectParam(
  rawTo: string,
): { identifier: string; recovered: URLSearchParams } | null {
  const separatorIndex = rawTo.search(QUERY_SEPARATOR);
  if (separatorIndex === -1) return null;

  return {
    identifier: rawTo.slice(0, separatorIndex),
    recovered: new URLSearchParams(rawTo.slice(separatorIndex + 1)),
  };
}

/** Removes punctuation picked up when a link is copied out of prose, e.g. `yucatan.` */
export function trimProjectIdentifier(value: string): string {
  return value.replace(TRAILING_PUNCTUATION, "");
}

/** True for a value that could be a project slug or guid. Rejects URLs and probe strings. */
export function isValidProjectIdentifier(value: string): boolean {
  return VALID_IDENTIFIER.test(value);
}
