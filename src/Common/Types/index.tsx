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

export interface DirectGift {
  type: "direct";
  recipientName: string;
  recipientTreecounter: string;
  recipientEmail: "";
  message: "";
}

export interface InvitationGift {
  type: "invitation";
  recipientName: string;
  recipientEmail: string;
  message: string;
}

export interface DefaultGift {
  type: null;
  recipientName: string;
  recipientEmail: "";
  message: "";
}

export type GiftDetails = InvitationGift | DirectGift | DefaultGift;

export interface ContactDetails {
  firstname: string;
  lastname: string;
  tin?: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  companyname?: string;
}

export interface CreateDonationFunctionProps {
  isTaxDeductible: Boolean | null;
  country: any;
  projectDetails: FetchedProjectDetails;
  quantity: number;
  paymentSetup: PaymentOptions;
  currency: string;
  contactDetails: ContactDetails;
  giftDetails: GiftDetails;
  isGift: boolean;
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
  paymentSetup: PaymentOptions;
  donationID: string;
  contactDetails: ContactDetails;
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
  paymentSetup: PaymentOptions;
  window: any;
  setIsPaymentProcessing: Function;
  setPaymentError: Function;
  donationID: string;
  contactDetails: ContactDetails;
  token: string;
  country: string;
  setshowErrorCard: Function;
  router: any;
  tenant: string;
}

export interface CreateDonationDataProps {
  projectDetails: FetchedProjectDetails;
  quantity: number;
  paymentSetup: PaymentOptions;
  currency: string;
  contactDetails: ContactDetails;
  taxDeductionCountry: any;
  isGift: boolean;
  giftDetails: GiftDetails;
  frequency: any;
  amount: number | undefined;
  callbackUrl: string | undefined;
  callbackMethod: string | undefined;
}

export interface PlanetCashSignupDetails {
  name: string;
  ownerName: string | null;
  ownerAvatar: string | null;
  purpose: "planet-cash-signup";
}

export interface FetchedProjectDetails {
  id: string;
  name: string;
  description?: string | null;
  ownerAvatar?: string | null;
  ownerName?: string;
  image?: string | null;
  purpose: ProjectPurpose;
  taxDeductionCountries?: Array<string>;
}

type ProjectPurpose =
  | "trees"
  | "conservation"
  | "funds"
  | "reforestation"
  | "bouquet"
  | "planet-cash";

export interface PaymentOptions extends FetchedProjectDetails {
  requestedCountry: string;
  effectiveCountry: string;
  frequencies: Frequencies;
  gateways: Gateways;
  recurrency: Recurrency;
  unit: string;
  unitCost: number;
  currency: string;
  destination: string;
  isApproved?: boolean;
  isTopProject?: boolean;
}

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
