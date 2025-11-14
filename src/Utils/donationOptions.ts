import { NoGift, User } from "@planet-sdk/common";
import { PLANETCASH_ALLOWED_PROJECT_PURPOSES } from "./projects/constants";
import { FetchedProjectDetails, GiftDetails } from "src/Common/Types";

interface PlanetCashAllowedParams {
  profile: User | null;
  isSignedUp: boolean;
  projectDetails: FetchedProjectDetails | null;
  isGift: boolean;
  giftDetails: GiftDetails | NoGift;
  hasPlanetCashGateway: boolean;
}

/**
 * Determines if Planet Cash is allowed for the current donation
 */
export const isPlanetCashAllowed = ({
  profile,
  isSignedUp,
  projectDetails,
  isGift,
  giftDetails,
  hasPlanetCashGateway,
}: PlanetCashAllowedParams): boolean => {
  return (
    profile !== null &&
    isSignedUp &&
    profile.planetCash !== null &&
    hasPlanetCashGateway &&
    projectDetails !== null &&
    PLANETCASH_ALLOWED_PROJECT_PURPOSES.includes(projectDetails.purpose) &&
    projectDetails.taxDeductionCountries !== undefined &&
    projectDetails.taxDeductionCountries.includes(profile.planetCash.country) &&
    !(isGift && giftDetails.recipientName === "")
  );
};
