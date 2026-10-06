import { ProjectPurpose } from "src/Common/Types";

export const NON_GIFTABLE_PROJECT_PURPOSES: Array<ProjectPurpose> = [
  "planet-cash",
  "bouquet",
];

export const PLANETCASH_ALLOWED_PROJECT_PURPOSES: Array<ProjectPurpose> = [
  "trees",
  "conservation",
  "funds",
  "academy",
  "forest-protection",
  "sponsorship",
  "membership",
  "reforestation",
  "bouquet",
];

export const PROJECTS_WITH_CURRENCY_UNIT_TYPE: Array<ProjectPurpose> = [
  "funds",
  "academy",
  "forest-protection",
  "sponsorship",
  "membership",
  "endowment",
];

// TODO - update types in planet-sdk to include "isGiftable" and "purpose=membership" in Project type
