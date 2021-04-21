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
  type:String|null;
  recipientName: String|null;
  email: String|null;
  giftMessage: String|null;
  recipientTreecounter: Number|null;
  receipients: {}|null;
}

export interface CreateDonationFunctionProps {
  isTaxDeductible:Boolean | null;
  country:any;
  projectDetails: Object;
  treeCount: number;
  treeCost: number;
  currency: String;
  contactDetails: Object;
  giftDetails: giftDetailsProps;
  isGift: Boolean;
  setIsPaymentProcessing: Function;
  setPaymentError: Function;
  setdonationID:any;
}