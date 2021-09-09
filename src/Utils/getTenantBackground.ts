import defaultForest from "../../public/tenants/default/default-forest.jpg";
import klumforest from "../../public/tenants/leniklum/leniklum.jpg";
import bahlsen from "../../public/tenants/bahlsen/bahlsen.png";

import getImageUrl from "./getImageURL";

// Set tenant image -> set tenant image where needed, except for default
// Default -> Check for tenant image if not found, use project image, if not found, use base
export function getTenantBackground(tenant: any, projectDetails: any) {
  let tenantImage = null;
  let imageUrl = defaultForest;

  switch (tenant) {
    case "ten_KRHYP8TR":
      tenantImage = klumforest;
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
    if (projectDetails && projectDetails.image) {
      imageUrl = getImageUrl("project", "large", projectDetails.image);
    }else{
      imageUrl = defaultForest;
    }
  }

  return imageUrl;
}
