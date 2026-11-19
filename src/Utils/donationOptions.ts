import { NoGift, User } from "@planet-sdk/common";
import { PLANETCASH_ALLOWED_PROJECT_PURPOSES } from "./projects/constants";
import {
  FetchedProjectDetails,
  GiftDetails,
  PlanetCashGateway,
} from "src/Common/Types";

interface PlanetCashAllowedParams {
  profile: User | null;
  isSignedUp: boolean;
  projectDetails: FetchedProjectDetails | null;
  isGift: boolean;
  giftDetails: GiftDetails | NoGift;
  planetCashGateway: PlanetCashGateway | undefined;
  hasRecurringFrequenciesOnly: boolean;
}

/**
 * Checks if the project accepts PlanetCash from an account in this country.
 * Older backends send the gateway only to a signed-in user whose account may pay for the project, without `countries`, so its presence is the answer.
 */
export const isPlanetCashCountryAllowed = (
  planetCashGateway: PlanetCashGateway | undefined,
  accountCountry: string,
): boolean => {
  if (planetCashGateway === undefined) return false;
  const { countries } = planetCashGateway;
  if (countries === undefined || countries.length === 0) return true;
  return countries.some(
    (country) => country.toUpperCase() === accountCountry.toUpperCase(),
  );
};

/**
 * Determines if Planet Cash is allowed for the current donation
 */
export const isPlanetCashAllowed = ({
  profile,
  isSignedUp,
  projectDetails,
  isGift,
  giftDetails,
  planetCashGateway,
  hasRecurringFrequenciesOnly,
}: PlanetCashAllowedParams): boolean => {
  return (
    profile !== null &&
    isSignedUp &&
    profile.planetCash !== null &&
    isPlanetCashCountryAllowed(planetCashGateway, profile.planetCash.country) &&
    !hasRecurringFrequenciesOnly &&
    projectDetails !== null &&
    PLANETCASH_ALLOWED_PROJECT_PURPOSES.includes(projectDetails.purpose) &&
    !(isGift && giftDetails.recipientName === "")
  );
};
