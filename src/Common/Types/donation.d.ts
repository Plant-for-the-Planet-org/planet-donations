import { ContactDetails, ProjectPurpose, SentGift } from ".";
export interface Metadata {
  callback_method?: string;
  callback_url?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_source?: string;
}

export type DonationRequestData = {
  purpose: ProjectPurpose;
  project?: string;
  amount: number;
  currency: string;
  donor: ContactDetails;
  frequency: string;
  metadata: Metadata;
  quantity?: number;
  taxDeductionCountry?: string;
  gift?: SentGift;
};
