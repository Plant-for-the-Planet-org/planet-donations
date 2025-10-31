import {
  ProjectPurpose,
  TreeProjectClassification,
  FundsProjectClassification,
} from "src/Common/Types";

export const NON_GIFTABLE_PROJECT_PURPOSES: Array<ProjectPurpose> = [
  "planet-cash",
  "bouquet",
];

export const PLANETCASH_ALLOWED_PROJECT_PURPOSES: Array<ProjectPurpose> = [
  "trees",
  "conservation",
  "funds",
];

export const PLANETCASH_DISALLOWED_PROJECT_CLASSIFICATIONS: Array<
  FundsProjectClassification | TreeProjectClassification
> = ["endowment"];

// TODO - update types in planet-sdk to include "isGiftable" and "purpose=membership" in Project type
