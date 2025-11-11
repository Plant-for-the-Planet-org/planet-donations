import { ProjectPurpose, SentGift } from ".";
import { ContactDetails } from "@planet-sdk/common";

export interface Metadata {
  callback_method?: string;
  callback_url?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_source?: string;
  welcomePackageStatus?: "draft";
}

export interface LineItem {
  project: string;
  units?: number;
  amount: number;
}

export type BaseDonationRequest = {
  currency: string;
  donor: ContactDetails;
  frequency: string;
  metadata: Metadata;
  taxDeductionCountry?: string;
};

export type RegularDonationRequest = BaseDonationRequest & {
  purpose: ProjectPurpose;
  project: string;
  amount: number;
  units?: number;
  gift?: SentGift;
};

export type CompositeDonationRequest = BaseDonationRequest & {
  purpose: "composite";
  lineItems: LineItem[];
};

export type DonationRequestData =
  | RegularDonationRequest
  | CompositeDonationRequest;
