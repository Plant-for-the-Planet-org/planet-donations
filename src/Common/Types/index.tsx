import { PaymentMethod } from "@stripe/stripe-js/types/api/payment-methods";
import { OnApproveData } from "@paypal/paypal-js/types/components/buttons";
import { Dispatch, SetStateAction } from "react";
import { TFunction } from "next-i18next";
import { NextRouter } from "next/router";
import {
  NoGift,
  SentDirectGift,
  SentInvitationGift,
  ContactDetails,
  BankTransferDetails,
  PaymentGateway,
  CurrencyCode,
} from "@planet-sdk/common";
import { DonationBreakdown } from "./QueryParamContextInterface";

/** planet-donations only allows direct or invitation gifts */
export interface DirectGiftDetails extends SentDirectGift {
  recipientName?: string;
  recipientProfile?: string;
}
export interface InvitationGiftDetails extends SentInvitationGift {}

export type SentGift = SentDirectGift | SentInvitationGift;

export type GiftDetails = DirectGiftDetails | InvitationGiftDetails;

export interface PaymentProviderRequest {
  account?: string;
  gateway: PaymentGateway;
  method?: string;
  source?:
    | {
        id?: string;
        object?: string | PaymentMethod | PaypalApproveData | PaypalErrorData;
      }
    | PaypalApproveData
    | PaypalErrorData
    | Record<string, never>;
}

export interface CreateDonationFunctionProps {
  isTaxDeductible: boolean | null;
  country: string;
  projectDetails: FetchedProjectDetails;
  quantity: number;
  paymentSetup: PaymentOptions;
  currency: string;
  contactDetails: ContactDetails;
  giftDetails: GiftDetails | NoGift;
  isGift: boolean;
  setIsPaymentProcessing: Dispatch<SetStateAction<boolean>>;
  setPaymentError: Dispatch<SetStateAction<string>>;
  setdonationID: Dispatch<SetStateAction<string | null>>;
  token: string | null;
  setshowErrorCard: Dispatch<SetStateAction<boolean>>;
  frequency: string;
  amount?: number | null;
  callbackUrl?: string | undefined;
  callbackMethod?: string | undefined;
  utmCampaign?: string | undefined;
  utmMedium?: string | undefined;
  utmSource?: string | undefined;
  isPackageWanted: boolean | null;
  tenant: string;
  locale: string;
  // Add supported donation parameters
  isSupportedDonation?: boolean;
  supportedProjectId?: string | null;
  getDonationBreakdown?: () => DonationBreakdown;
}

export interface PayDonationProps {
  gateway: PaymentGateway;
  method: string;
  providerObject?: string | PaymentMethod | PaypalApproveData | PaypalErrorData;
  setIsPaymentProcessing: Dispatch<SetStateAction<boolean>>;
  setPaymentError: Dispatch<SetStateAction<string>>;
  t: TFunction;
  paymentSetup: PaymentOptions;
  donationID: string;
  contactDetails: ContactDetails;
  token: string | null;
  country: string;
  setshowErrorCard: Dispatch<SetStateAction<boolean>>;
  router: NextRouter;
  tenant: string;
  locale: string;
  setTransferDetails: (transferDetails: BankTransferDetails | null) => void;
}

export interface HandleStripeSCAPaymentProps {
  method: string;
  paymentResponse: UpdateDonationActionRequiredData;
  paymentSetup: PaymentOptions;
  window: Window & typeof globalThis;
  setIsPaymentProcessing: Dispatch<SetStateAction<boolean>>;
  setPaymentError: Dispatch<SetStateAction<string>>;
  donationID: string;
  contactDetails: ContactDetails;
  token: string | null;
  country: string;
  setshowErrorCard: Dispatch<SetStateAction<boolean>>;
  router: NextRouter;
  tenant: string;
  locale: string;
}

export interface CreateDonationDataProps {
  projectDetails: FetchedProjectDetails;
  quantity: number;
  paymentSetup: PaymentOptions;
  currency: string;
  contactDetails: ContactDetails;
  taxDeductionCountry: string | null;
  isGift: boolean;
  giftDetails: GiftDetails | NoGift;
  frequency: string;
  amount?: number | null;
  callbackUrl: string | undefined;
  callbackMethod: string | undefined;
  utmCampaign: string | undefined;
  utmMedium: string | undefined;
  utmSource: string | undefined;
  isPackageWanted: boolean | null;
  isSupportedDonation?: boolean;
  supportedProjectId?: string | null;
  getDonationBreakdown?: () => DonationBreakdown;
}

export interface PlanetCashSignupDetails {
  name: string;
  ownerName: string;
  ownerAvatar: string | null;
  purpose: "planet-cash-signup";
}

export interface FetchedBaseProjectDetails {
  id: string;
  name: string;
  description?: string | null;
  ownerAvatar: string | null;
  ownerName: string | null;
  image?: string | null;
  purpose: ProjectPurpose;
  classification: Nullable<ProjectClassification>;
  taxDeductionCountries?: Array<string>;
  isApproved: boolean;
  isTopProject: boolean;
}

export interface FetchedTreeProjectDetails extends FetchedBaseProjectDetails {
  purpose: "trees";
  classification: TreeProjectClassification;
}

export interface FetchedFundsProjectDetails extends FetchedBaseProjectDetails {
  purpose: "funds";
  classification: FundsProjectClassification;
}

export interface FetchedOtherProjectDetails extends FetchedBaseProjectDetails {
  purpose: "conservation" | "reforestation" | "bouquet" | "planet-cash";
  classification: null;
}

export type FetchedProjectDetails =
  | FetchedTreeProjectDetails
  | FetchedFundsProjectDetails
  | FetchedOtherProjectDetails;

export type ProjectPurpose =
  | "trees"
  | "conservation"
  | "funds"
  | "reforestation"
  | "bouquet"
  | "planet-cash";

export type TreeProjectClassification =
  | "agroforestry"
  | "managed-regeneration"
  | "large-scale-planting"
  | "mangroves"
  | "natural-regeneration"
  | "other-planting"
  | "urban-planting";

export type FundsProjectClassification =
  | "academy"
  | "endowment"
  | "forest-protection"
  | "funding"
  | "membership"
  | "mixed"
  | "neutral"
  | "neutral-event"
  | "penalty"
  | "public-funds"
  | "research"
  | "sponsorship"
  | "subscription"
  | "subsidy";

export type ProjectClassification =
  | TreeProjectClassification
  | FundsProjectClassification;

export type PaymentOptions = FetchedProjectDetails & {
  requestedCountry: string;
  effectiveCountry: string;
  frequencies: Frequencies;
  gateways: Gateways;
  recurrency: Recurrency;
  /** @deprecated - use unitType instead */
  unit: string;
  unitType: UnitType;
  unitCost: number;
  currency: string;
  destination: string;
};

export type UnitType = "tree" | "m2" | "currency" | CurrencyCode;

interface Frequencies {
  [key: string]: Frequency;
}

interface Frequency {
  minQuantity: number;
  options: OptionsEntity[];
}

export interface Gateways {
  paypal: Paypal;
  stripe: Stripe;
  offline?: Offline;
  "planet-cash"?: PlanetCashGateway;
}
export interface Paypal {
  methods?: string[] | null;
  account: string;
  authorization: AuthorizationPaypal;
}

export interface AuthorizationPaypal {
  client_id: string;
}

export interface Stripe {
  methods?: string[] | null;
  account: string;
  authorization: AuthorizationStripe;
}

export interface AuthorizationStripe {
  stripePublishableKey: string;
  accountId: string;
}

export interface Offline {
  methods?: string[] | null;
  account: string;
}

export interface PlanetCashGateway {
  account: string;
  balance: number;
  creditLimit: number;
  available: number;
}

export interface OptionsEntity {
  id?: string;
  caption: string | null;
  description: string | null;
  icon: string | null;
  quantity: number | null;
  isDefault: boolean;
}

export interface Recurrency {
  supported: boolean;
  methods: string[] | null;
}

export interface Country {
  countryName: string;
  countryCode: string;
  currencyName: string;
  currencyCode: string;
  currencyCountryFlag: string;
  languageCode: string;
}

export type CountryProperty = keyof Country;

export interface CurrencyList {
  [key: string]: string;
}

export interface OnBehalfDonor {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ShowPaymentMethodParams {
  paymentMethod: "card" | "sepa_debit";
  countries?: string[];
  currencies?: string[];
  authenticatedMethod?: boolean;
}

export interface ConfigResponse {
  appVersions: {
    ios: string;
    android: string;
  };
  clientIp: string;
  country?: string;
  currency: string;
  cdnMedia: {
    images: string;
    cache: string;
    pdfs: string;
  };
  loc: {
    latitude: string;
    longitude: string;
    city: string;
    postalCode: string;
    countryCode: string;
    regionCode: string;
    timezone: string;
  };
}

export interface PaypalApproveData extends OnApproveData {
  type: string;
}

export interface PaypalErrorData {
  type: string;
  status: "error";
  errorMessage?: unknown;
  [key: string]: unknown;
}

export interface UpdateDonationResponse {
  data: UpdateDonationData;
  [key: string]: unknown;
}

export type UpdateDonationData =
  | UpdateDonationSuccessData
  | UpdateDonationFailureData
  | UpdateDonationActionRequiredData;

type UpdateDonationSuccessData = {
  paymentStatus?: string; //TODOO - May not be there. Check and remove.
  status: "success" | "pending" | "paid";
  id: string;
  response?: {
    type: "transfer_required";
    account: BankTransferDetails;
  };
};

type UpdateDonationFailureData = {
  paymentStatus?: string; //TODOO - May not be there. Check and remove.
  status: "failed";
  id: string;
  errorCode: string;
  message: string;
};

type UpdateDonationActionRequiredData = {
  paymentStatus?: string; //TODOO - May not be there. Check and remove.
  status: "action_required";
  id: string;
  response: {
    type: string;
    requires_action: boolean;
    payment_intent_client_secret: string;
    account: string;
  };
};
