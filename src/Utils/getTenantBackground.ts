const defaultForest = `${process.env.CDN_URL}/default-forest.jpg`;
const klumforest = "/tenants/leniklum/leniklum.jpg";
const treesforjane = "/tenants/treesforjane/treesforjane.jpg";
const bahlsen = "/tenants/bahlsen/bahlsen.png";

import getImageUrl from "./getImageURL";
import {ProjectDetails} from "../.././src/Donations/PaymentMethods/Interfaces"

interface getTenantBackground {
  tenant: string;
  projectDetails: ProjectDetails
}

// Set tenant image -> set tenant image where needed, except for default
// Default -> Check for tenant image if not found, use project image, if not found, use base
export function getTenantBackground({tenant, projectDetails}: getTenantBackground) {

  
  let tenantImage = null;
  let imageUrl = defaultForest;

  switch (tenant) {
    case "ten_KRHYP8TR":
      tenantImage = klumforest;
      break;
    case "ten_1e5WejOp":
      tenantImage = treesforjane;
      break;
    case "ten_eiRX3E3x":
      tenantImage = bahlsen;
      break;
    default:
      break;
  }

  if (tenantImage) {
    imageUrl = tenantImage;
  } else {
    if (projectDetails && projectDetails.projectImage) {
      imageUrl = getImageUrl("project", "large", projectDetails.projectImage);
    } else {
      imageUrl = defaultForest;
    }
  }

  return imageUrl;
}
