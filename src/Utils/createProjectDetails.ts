import { FetchedProjectDetails, PaymentOptions } from "src/Common/Types";

export const createProjectDetails = (
  paymentOptions: PaymentOptions
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
  };

  switch (paymentOptions.purpose) {
    case "trees":
      return {
        ...baseDetails,
        purpose: "trees",
        category: paymentOptions.category,
      };
    case "funds":
      return {
        ...baseDetails,
        purpose: "funds",
        category: paymentOptions.category,
      };
    default:
      return {
        ...baseDetails,
        purpose: paymentOptions.purpose,
        category: null,
      };
  }
};
