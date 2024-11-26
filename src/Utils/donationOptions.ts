import { NoGift, User } from "@planet-sdk/common";
import {
  PLANETCASH_ALLOWED_PROJECT_PURPOSES,
  PLANETCASH_DISALLOWED_PROJECT_CLASSIFICATIONS,
} from "./projects/constants";
import { FetchedProjectDetails, GiftDetails } from "src/Common/Types";

interface PlanetCashAllowedParams {
  profile: User | null;
  isSignedUp: boolean;
  projectDetails: FetchedProjectDetails | null;
  isGift: boolean;
  giftDetails: GiftDetails | NoGift;
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
}: PlanetCashAllowedParams): boolean => {
  return (
    profile !== null &&
    isSignedUp &&
    profile.planetCash !== null &&
    projectDetails !== null &&
    PLANETCASH_ALLOWED_PROJECT_PURPOSES.includes(projectDetails.purpose) &&
    (projectDetails.classification === null ||
      !PLANETCASH_DISALLOWED_PROJECT_CLASSIFICATIONS.includes(
        projectDetails.classification
      )) &&
    projectDetails.taxDeductionCountries !== undefined &&
    projectDetails.taxDeductionCountries.includes(profile.planetCash.country) &&
    !(isGift && giftDetails.recipientName === "")
  );
};
