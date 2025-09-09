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
  quantity: number;
  amount?: number; // Optional, used for support projects with currency amounts
}

export type BaseDonationRequest = {
  currency: string;
  donor: ContactDetails;
  frequency: string;
  metadata: Metadata;
  taxDeductionCountry?: string;
  gift?: SentGift;
};

export type RegularDonationRequest = BaseDonationRequest & {
  purpose: ProjectPurpose;
  project: string;
  amount: number;
  quantity?: number;
};

export type CompositeDonationRequest = BaseDonationRequest & {
  purpose: "composite";
  lineItems: LineItem[];
};

export type DonationRequestData =
  | RegularDonationRequest
  | CompositeDonationRequest;
