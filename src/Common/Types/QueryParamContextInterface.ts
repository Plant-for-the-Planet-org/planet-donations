import {
  BankTransferDetails,
  ContactDetails,
  CurrencyList,
  FetchedProjectDetails,
  GiftDetails,
  OnBehalfDonor,
  PaymentOptions,
  PlanetCashSignupDetails,
} from ".";
import { Project } from "./project";
import { User } from "./user";
import { Dispatch, SetStateAction } from "react";
import { Donation } from "./donation";
import { PaymentRequest } from "@stripe/stripe-js/types/stripe-js/payment-request";

export default interface QueryParamContextInterface {
  isGift: boolean;
  setisGift: Dispatch<SetStateAction<boolean>>;
  giftDetails: GiftDetails;
  setgiftDetails: Dispatch<SetStateAction<GiftDetails>>;
  contactDetails: ContactDetails;
  setContactDetails: Dispatch<SetStateAction<ContactDetails>>;
  country: string;
  setcountry: Dispatch<SetStateAction<string>>;
  paymentSetup: PaymentOptions | null;
  setpaymentSetup: Dispatch<SetStateAction<PaymentOptions | null>>;
  currency: string;
  setcurrency: Dispatch<SetStateAction<string>>;
  enabledCurrencies: CurrencyList | null;
  setEnabledCurrencies: Dispatch<SetStateAction<CurrencyList | null>>;
  donationStep: number | null;
  setdonationStep: Dispatch<SetStateAction<number | null>>;
  projectDetails: FetchedProjectDetails | PlanetCashSignupDetails | null;
  setprojectDetails: Dispatch<
    SetStateAction<FetchedProjectDetails | PlanetCashSignupDetails | null>
  >;
  quantity: number;
  setquantity: Dispatch<SetStateAction<number>>;
  language: string | null;
  setlanguage: Dispatch<SetStateAction<string>>;
  donationID: string | null;
  setdonationID: Dispatch<SetStateAction<string | null>>;
  paymentType: string;
  setPaymentType: Dispatch<SetStateAction<string>>;
  shouldCreateDonation: boolean;
  setshouldCreateDonation: Dispatch<SetStateAction<boolean>>;
  isTaxDeductible: boolean;
  setIsTaxDeductible: Dispatch<SetStateAction<boolean>>;
  isPaymentOptionsLoading: boolean;
  setIsPaymentOptionsLoading: Dispatch<SetStateAction<boolean>>;
  redirectstatus: string | null;
  setredirectstatus: Dispatch<SetStateAction<string | null>>;
  callbackUrl: string;
  setcallbackUrl: Dispatch<SetStateAction<string>>;
  callbackMethod: string;
  setCallbackMethod: Dispatch<SetStateAction<string>>;
  isDirectDonation: boolean;
  setisDirectDonation: Dispatch<SetStateAction<boolean>>;
  tenant: string;
  settenant: Dispatch<SetStateAction<string>>;
  selectedProjects: Array<Project>;
  setSelectedProjects: (selectedProjects: Array<Project>) => void;
  allProjects: Array<Project>;
  allowTaxDeductionChange: boolean;
  setallowTaxDeductionChange: Dispatch<SetStateAction<boolean>>;
  donationUid: string | null;
  setDonationUid: Dispatch<SetStateAction<string | null>>;
  setshowErrorCard: Dispatch<SetStateAction<boolean>>;
  transferDetails: BankTransferDetails | null;
  setTransferDetails: (transferDetails: BankTransferDetails | null) => void;
  loadselectedProjects: () => Promise<void>;
  hideTaxDeduction: boolean;
  sethideTaxDeduction: Dispatch<SetStateAction<boolean>>;
  queryToken: string | null;
  setqueryToken: Dispatch<SetStateAction<string | null>>;
  isSignedUp: boolean;
  setIsSignedUp: Dispatch<SetStateAction<boolean>>;
  frequency: string;
  setfrequency: Dispatch<SetStateAction<string>>;
  profile: User | null;
  setprofile: (profile: User) => void;
  hideLogin: boolean;
  setHideLogin: Dispatch<SetStateAction<boolean>>;
  paymentError: string;
  setPaymentError: Dispatch<SetStateAction<string>>;
  amount: number | null;
  setAmount: (amount: number) => void;
  taxIdentificationAvail: boolean;
  setTaxIdentificationAvail: Dispatch<SetStateAction<boolean>>;
  retainQuantityValue: boolean;
  setRetainQuantityValue: Dispatch<SetStateAction<boolean>>;
  loadPaymentSetup: (value: {
    projectGUID: string;
    paymentSetupCountry: string;
    shouldSetPaymentDetails?: boolean;
  }) => Promise<void>;
  isPlanetCashActive: boolean;
  setIsPlanetCashActive: Dispatch<SetStateAction<boolean>>;
  onBehalf: boolean;
  setOnBehalf: Dispatch<SetStateAction<boolean>>;
  onBehalfDonor: OnBehalfDonor;
  setOnBehalfDonor: Dispatch<SetStateAction<OnBehalfDonor>>;
  donation: Donation | null;
  setdonation: Dispatch<SetStateAction<Donation | null>>;
  paymentRequest: PaymentRequest | null;
  setPaymentRequest: Dispatch<SetStateAction<PaymentRequest | null>>;
}
