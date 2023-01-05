//REPLACE WITH TYPES FROM PLANET-SDK WHEN READY

export interface Project {
  [key: string]: unknown;
  properties: ProjectConcise;
}

// Project properties contained in the projects api with _scope = map
export interface ProjectConcise {
  id: string;
  _scope: string;
  allowDonations: boolean;
  classification?: ProjectClassification; //Not for conservation projects
  countPlanted?: number; //Not for conservation projects
  countTarget?: number | null;
  country: string;
  currency: string;
  fixedRates: [] | { [key: string]: number };
  image: string;
  isApproved?: boolean; //Not for conservation projects
  isFeatured?: boolean;
  isPublished: boolean; //Not for conservation projects
  isTopProject?: boolean; //Not for conservation projects
  location?: string; //should location be nullable? This is deprecated - confirm? //Not for conservation projects
  minTreeCount?: number; //not for conservation
  name: string;
  paymentDefaults?: DefaultPaymentConfig | null;
  purpose: ProjectPurpose;
  reviewScore: number; //Is this used?
  slug: string;
  taxDeductionCountries: string[];
  tpo: Tpo;
  treeCost: number;
  unitCost: number;
  description: string | null; //always returned as null for map
  metadata: MetadataShort; // all properties are null for map
  options: UnitOptions[]; //always an empty array. should this be removed?
}

export interface MetadataShort {
  degradationCause?: string | null; //only trees
  longTermPlan: string | null; //common
  mainChallenge: string | null; //common
  motivation: string | null; //common
  actions?: string | null; //only conservation
  benefits?: string | null; //only conservation
  coBenefits?: string | null; //only conservation
  ecologicalBenefits?: string | null; //only conservation
  socialBenefits?: string | null; //only conservation
}

type ProjectClassification =
  | "large-scale-planting"
  | "urban-planting"
  | "agroforestry"
  | "managed-regeneration"
  | "natural-regeneration"
  | "mangroves"
  | "other-planting";

export interface UnitOptions {
  caption: string | null;
  description: string | null;
}

export interface DefaultPaymentConfig {
  fixedTreeCountOptions: number[];
  fixedDefaultTreeCount: number;
}

type ProjectPurpose = "trees" | "conservation" | "funds" | "reforestation";

export interface Tpo {
  image?: string;
  address: Address;
  name: string;
  id: string;
  email: string;
  slug: string;
}

export interface Address {
  zipCode?: string;
  country: string;
  address?: string;
  city?: string;
}
