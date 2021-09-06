import defaultForest from "../../public/tenants/default/default-forest.jpg";
import klumforest from "../../public/tenants/leniklum/leniklum.jpg";
import getImageUrl from "./getImageURL";

export function getTenantBackground(tenant: any, projectDetails: any) {
  let imageUrl = defaultForest;
  if (projectDetails && projectDetails.image) {
    imageUrl = getImageUrl("project", "large", projectDetails.image);
  } else {
    switch (tenant) {
      case "ten_I9TW3ncG":
        imageUrl = defaultForest;
        break;
      case "ten_KRHYP8TR":
        imageUrl = klumforest;
        break;
      default:
        imageUrl = defaultForest;
        break;
    }
  }
  return imageUrl;
}
