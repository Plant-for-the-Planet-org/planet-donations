import { FetchedProjectDetails, PaymentOptions } from "src/Common/Types";

export const createProjectDetails = (
  paymentOptions: PaymentOptions,
): FetchedProjectDetails => {
  const baseDetails = {
    id: paymentOptions.id,
    name: paymentOptions.name,
    description: paymentOptions.description,
    ownerName: paymentOptions.ownerName,
    taxDeductionCountries: paymentOptions.taxDeductionCountries,
    image: paymentOptions.image,
    ownerAvatar: paymentOptions.ownerAvatar,
    isApproved: !!paymentOptions.isApproved,
    isTopProject: !!paymentOptions.isTopProject,
    isGiftable: paymentOptions.isGiftable ?? false,
  };

  switch (paymentOptions.purpose) {
    case "trees":
      return {
        ...baseDetails,
        purpose: "trees",
        classification: paymentOptions.classification,
      };
    case "funds":
      return {
        ...baseDetails,
        purpose: "funds",
        classification: paymentOptions.classification,
      };
    default:
      return {
        ...baseDetails,
        purpose: paymentOptions.purpose,
        classification: null,
      };
  }
};
