import {
  RootObject,
  ContactDetails,
  projectDetails,
} from "src/Donations/PaymentMethods/Interfaces";

export interface ProjectTypes {
  data: {
    allowDonations: boolean;
    certificates: Array<{}>;
    classification: string;
    coordinates: { lat: number; lon: number };
    countDonated: number;
    countPlanted: number;
    countRegistered: number;
    countTarget: number;
    country: string;
    currency: string;
    degradationCause: string;
    degradationYear: number;
    description: string;
    employeesCount: number;
    enablePlantLocations: false;
    expenses: Array<any>;
    firstTreePlanted: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
    fixedRates: [];
    geoLocation: {
      boundingBox: null;
      crs: null;
      type: string;
      coordinates: Array<any>;
    };
    id: string;
    image: string;
    images: Array<{}>;
    isCertified: false;
    isPublished: true;
    lastUpdated: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
    location: string;
    longTermPlan: string;
    mainChallenge: string;
    minTreeCount: number;
    motivation: string;
    paymentDefaults: {
      fixedDefaultTreeCount: number;
      fixedTreeCountOptions: Array<any>;
    };
    plantingDensity: number;
    plantingSeasons: Array<string>;
    reviewRequested: true;
    siteOwnerName: string;
    siteOwnerType: Array<string>;
    sites: Array<{}>;
    slug: string;
    survivalRate: number;
    survivalRateStatus: string;
    taxDeductionCountries: Array<string>;
    tpo: {
      id: string;
      name: string;
      email: string;
      address: {};
      slug: string;
    };
    treeCost: number;
    videoUrl: string | null;
    visitorAssistance: false;
    website: string;
    yearAbandoned: number;
    yearAcquired: number;
    _scope: string;
  };
}

export interface giftDetailsProps {
  type: string | null;
  recipientName: string | null;
  email: string | null;
  giftMessage: string | null;
  recipientTreecounter: number | null;
  receipients: {} | null;
}

export interface CreateDonationFunctionProps {
  isTaxDeductible: boolean | null;
  country: string;
  projectDetails: projectDetails;
  quantity: number;
  paymentSetup: RootObject;
  currency: string;
  contactDetails: ContactDetails;
  giftDetails: giftDetailsProps;
  isGift: boolean;
  setIsPaymentProcessing: (...args: unknown[]) => unknown;
  setPaymentError: (...args: unknown[]) => unknown;
  setdonationID: (...args: unknown[]) => unknown;
  token: any;
  setshowErrorCard: (...args: unknown[]) => unknown;
  frequency: string | null;
  amount?: number | null;
  callbackUrl?: string | undefined;
  callbackMethod?: string | undefined;
  tenant: string;
}

export interface PayDonationProps {
  gateway: string;
  method: string;
  providerObject: string;
  setIsPaymentProcessing: (...args: unknown[]) => unknown;
  setPaymentError: (...args: unknown[]) => unknown;
  t: any;
  paymentSetup: RootObject;
  donationID: string;
  contactDetails: ContactDetails;
  token: string;
  country: string;
  setshowErrorCard: (...args: unknown[]) => unknown;
  router: any;
  tenant: string;
  setTransferDetails: (...args: unknown[]) => unknown;
}

export interface HandleStripeSCAPaymentProps {
  method: string;
  paymentResponse: any;
  paymentSetup: RootObject;
  window: any;
  setIsPaymentProcessing: (...args: unknown[]) => unknown;
  setPaymentError: (...args: unknown[]) => unknown;
  donationID: string;
  contactDetails: ContactDetails;
  token: string;
  country: string;
  setshowErrorCard: (...args: unknown[]) => unknown;
  router: any;
  tenant: string;
}

export interface PaymentSetupProps {
  currency: string;
  effectiveCountry: string;
  frequencies?: string[] | null;
  gateways: Gateways;
  minQuantity: number;
  options?: OptionsEntity[] | null;
  project: string;
  purpose: string;
  recurrency: Recurrency;
  requestedCountry: string;
  treeCost: number;
  unit: string;
  unitCost: number;
}
export interface Gateways {
  paypal: Paypal;
  stripe: Stripe;
  offline: Offline;
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
export interface OptionsEntity {
  id: string;
  caption: string;
  description?: string | null;
  icon?: string | null;
  quantity?: number | null;
  isDefault: boolean;
}
export interface Recurrency {
  supported: boolean;
  methods?: string[] | null;
  frequencies?: string[] | null;
}
