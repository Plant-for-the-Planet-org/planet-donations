import { ProjectPurpose, TreeProjectClassification } from "@planet-sdk/common";
import { FundsProjectClassification } from "src/Common/Types";

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
> = ["membership", "endowment"];
