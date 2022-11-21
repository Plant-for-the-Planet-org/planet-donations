import {
  ContactDetails,
  CurrencyList,
  FetchedProjectDetails,
  GiftDetails,
  PaymentOptions,
  PlanetCashSignupDetails,
} from ".";
import { Project } from "./project";
import { User } from "./user";

export default interface QueryParamContextInterface {
  isGift: boolean;
  setisGift: (isGift: boolean) => void;
  giftDetails: GiftDetails;
  setgiftDetails: (value: GiftDetails) => void;
  contactDetails: ContactDetails;
  setContactDetails: (value: ContactDetails) => void;
  country: string;
  setcountry: (country: string) => void;
  paymentSetup: PaymentOptions | null;
  setpaymentSetup: (paymentSetup: PaymentOptions) => void;
  currency: string;
  setcurrency: (currency: string) => void;
  enabledCurrencies: CurrencyList | null;
  setEnabledCurrencies: (enabledCurrencies: CurrencyList) => void;
  donationStep: number | null;
  setdonationStep: (donationStep: number) => void;
  projectDetails: FetchedProjectDetails | PlanetCashSignupDetails | null;
  setprojectDetails: (
    projectDetails: FetchedProjectDetails | PlanetCashSignupDetails | null
  ) => void;
  quantity: number;
  setquantity: (quantity: number) => void;
  language: string | null;
  setlanguage: (language: string) => void;
  donationID: string | null;
  setdonationID: (donationID: string) => void;
  paymentType: string;
  setPaymentType: (paymentType: string) => void;
  shouldCreateDonation: boolean;
  setshouldCreateDonation: (shouldCreateDonation: boolean) => void;
  isTaxDeductible: boolean;
  setIsTaxDeductible: (isTaxDeductible: boolean) => void;
  isPaymentOptionsLoading: boolean;
  setIsPaymentOptionsLoading: (isPaymentOptionsLoading: boolean) => void;
  redirectstatus: string | null;
  setredirectstatus: (redirectstatus: string) => void;
  callbackUrl: string;
  setcallbackUrl: (callbackUrl: string) => void;
  callbackMethod: string;
  setCallbackMethod: (callbackMethod: string) => void;
  isDirectDonation: boolean;
  setisDirectDonation: (isDirectDonation: boolean) => void;
  tenant: string;
  settenant: (tenant: string) => void;
  selectedProjects: Array<Project>;
  setSelectedProjects: (value: Array<Project>) => void;
  allProjects: Array<Project>;
  allowTaxDeductionChange: boolean;
  setallowTaxDeductionChange: (allowTaxDeductionChange: boolean) => void;
  donationUid: string | null;
  setDonationUid: (donationUid: string) => void;
  setshowErrorCard: (showErrorCard: boolean) => void;
  transferDetails: {} | null; //TODOO
  setTransferDetails: (value: {}) => void; //TODOO
  loadselectedProjects: () => Promise<void>;
  hideTaxDeduction: boolean;
  sethideTaxDeduction: (hideTaxDeduction: boolean) => void;
  queryToken: string | null;
  setqueryToken: (queryToken: string) => void;
  isSignedUp: boolean;
  setIsSignedUp: (isSignedUp: boolean) => void;
  frequency: string;
  setfrequency: (frequency: string) => void;
  profile: User | null;
  setprofile: (profile: User) => void;
  hideLogin: boolean;
  setHideLogin: (hideLogin: boolean) => void;
  paymentError: string;
  setPaymentError: (paymentError: string) => void;
  amount: number | null;
  setAmount: (amount: number) => void;
  taxIdentificationAvail: boolean;
  setTaxIdentificationAvail: (taxIdentificationAvail: boolean) => void;
  retainQuantityValue: boolean;
  setRetainQuantityValue: (retainQuantityValue: boolean) => void;
  loadPaymentSetup: (value: {
    projectGUID: string;
    paymentSetupCountry: string | string[];
    shouldSetPaymentDetails?: boolean;
  }) => Promise<void>; //TODOO
  isPlanetCashActive: boolean;
  setIsPlanetCashActive: (isPlanetCashActive: boolean) => void;
  onBehalf: boolean;
  setOnBehalf: (onBehalf: boolean) => void;
  onBehalfDonor: {}; //TODOO
  setOnBehalfDonor: (value: {}) => void; //TODOO
  donation: {} | null; //TODOO
  setdonation: (value: {}) => void; //TODOO
  paymentRequest: {} | null; //TODOO
  setPaymentRequest: (value: {}) => void; //TODOO
}
