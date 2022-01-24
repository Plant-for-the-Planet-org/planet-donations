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
    plantingSeasons: Array<any>;
    reviewRequested: true;
    siteOwnerName: string;
    siteOwnerType: Array<any>;
    sites: Array<{}>;
    slug: string;
    survivalRate: number;
    survivalRateStatus: string;
    taxDeductionCountries: Array<any>;
    tpo: {
      id: string;
      name: string;
      email: string;
      address: {};
      slug: string;
    };
    treeCost: number;
    videoUrl: null;
    visitorAssistance: false;
    website: string;
    yearAbandoned: number;
    yearAcquired: number;
    _scope: string;
  };
}

export interface giftDetailsProps {
  type: String | null;
  recipientName: String | null;
  email: String | null;
  giftMessage: String | null;
  recipientTreecounter: Number | null;
  receipients: {} | null;
}

export interface CreateDonationFunctionProps {
  isTaxDeductible: Boolean | null;
  country: any;
  projectDetails: Object;
  quantity: number;
  paymentSetup: {};
  currency: String;
  contactDetails: Object;
  giftDetails: giftDetailsProps;
  isGift: Boolean;
  setIsPaymentProcessing: Function;
  setPaymentError: Function;
  setdonationID: any;
  token: any;
  setshowErrorCard: Function;
  frequency: string | null;
  amount?: number | null;
  callbackUrl?: string | undefined;
  callbackMethod?: string | undefined;
  tenant: string;
}

export interface PayDonationProps {
  gateway: string;
  method: string;
  providerObject: Object;
  setIsPaymentProcessing: Function;
  setPaymentError: Function;
  t: any;
  paymentSetup: Object;
  donationID: string;
  contactDetails: Object;
  token: string;
  country: string;
  setshowErrorCard: Function;
  router: any;
  tenant: string;
  setTransferDetails: Function;
}

export interface HandleStripeSCAPaymentProps {
  method: string;
  paymentResponse: any;
  paymentSetup: Object;
  window: any;
  setIsPaymentProcessing: Function;
  setPaymentError: Function;
  donationID: string;
  contactDetails: Object;
  token: string;
  country: string;
  setshowErrorCard: Function;
  router: any;
  tenant: string;
}

export interface PaymentSetupProps {
  // costIsMonthly: boolean;
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
