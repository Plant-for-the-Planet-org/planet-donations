import { CurrencyList } from ".";

export default interface QueryParamContextInterface {
  isGift: boolean;
  setisGift: (isGift: boolean) => void;
  giftDetails: {}; //TODOO
  setgiftDetails: (value: {}) => void; //TODOO
  contactDetails: {}; //TODOO
  setContactDetails: (value: {}) => void; //TODOO
  country: string;
  setcountry: (country: string) => void;
  paymentSetup: {}; //TODOO
  setpaymentSetup: ({}) => void; //TODOO
  currency: string;
  setcurrency: (currency: string) => void;
  enabledCurrencies: CurrencyList | null;
  setEnabledCurrencies: (value: CurrencyList) => void;
  donationStep: number | null;
  setdonationStep: (donationStep: number) => void;
  projectDetails: {}; //TODOO
  setprojectDetails: (value: {}) => void; //TODOO
  quantity: number;
  setquantity: (quantity: number) => void;
  language: string | null;
  setlanguage: (language: string) => void;
  donationID: string | null;
  setdonationID: (donationID: string) => void;
  paymentType: string; //TOCHECK
  setPaymentType: (paymentType: string) => void; //TOCHECK
  shouldCreateDonation: boolean;
  setshouldCreateDonation: (shouldCreateDonation: boolean) => {};
  isTaxDeductible: boolean;
  setIsTaxDeductible: (isTaxDeductible: boolean) => void;
  isPaymentOptionsLoading: false;
  redirectstatus: "";
  setredirectstatus: (value: string) => void;
  callbackUrl: "";
  setcallbackUrl: (value: string) => void;
  isDirectDonation: false;
  tenant: "";
  settenant: (value: string) => void;
  selectedProjects: [];
  setSelectedProjects: (value: Array<any>) => void;
  allProjects: [];
  allowTaxDeductionChange: true;
  setallowTaxDeductionChange: (value: boolean) => void;
  donationUid: null;
  setDonationUid: (value: string) => "";
  setshowErrorCard: (value: boolean) => void;

  transferDetails: null;
  setTransferDetails: (value: {}) => void;
  loadselectedProjects: () => void;
  hideTaxDeduction: false;
  queryToken: "";
  setqueryToken: (value: string) => "";
  sethideTaxDeduction: (value: boolean) => void;
  setisDirectDonation: (value: boolean) => void;
  isSignedUp: false;
  setIsSignedUp: (value: boolean) => void;
  frequency: "";
  setfrequency: (value: string) => void;
  hideLogin: false;
  setHideLogin: (value: boolean) => void;
  paymentError: "";
  setPaymentError: (value: string) => void;
  amount: null;
  setAmount: (value: number) => void;
  taxIdentificationAvail: {};
  setTaxIdentificationAvail: (value: boolean) => void;
  callbackMethod: "";
  setCallbackMethod: (value: string) => void;
  retainQuantityValue: false;
  setRetainQuantityValue: (value: boolean) => void;
  projectName: "";
  setProjectName: (value: string) => void;
  projectDescription: "";
  setProjectDescription: (value: string) => void;
  setIsPaymentOptionsLoading: (value: boolean) => void;
  loadPaymentSetup: (value: {
    projectGUID: string;
    paymentSetupCountry: string | string[];
    shouldSetPaymentDetails?: Boolean;
  }) => void;
  profile: null;
  isPlanetCashActive: false;
  setIsPlanetCashActive: (value: boolean) => void;
  onBehalf: false;
  setOnBehalf: (value: boolean) => void;
  onBehalfDonor: {};
  setOnBehalfDonor: (value: {}) => void;
  donation: null;
  setdonation: (value: {}) => void;
  paymentRequest: null;
  setPaymentRequest: (value: {}) => void;
}
