import {
  BankTransferDetails,
  ContactDetails,
  ProjectPurpose,
  GiftDetails,
} from ".";

enum PaymentStatusValues {
  PENDING = "pending",
  INITIATED = "initiated",
  DRAFT = "draft",
  PAID = "paid",
  FAILED = "failed",
  SUCCESS = "success",
}

export interface Donation {
  amount: number;
  account?: BankTransferDetails;
  code?: string;
  comment: any;
  currency: string;
  destination: Destination;
  donorAlias: any;
  frequency: any;
  gateway?: string;
  gift?: Gift;
  hasPublicProfile: boolean;
  id: string;
  isRecurrent: boolean;
  metadata?: Metadata;
  paymentDate?: string;
  paymentStatus: PaymentStatusValues;
  project: Project2;
  quantity: number;
  signupPending: boolean;
  status?: string;
  taxDeductionCountry?: string;
  tenant: string;
  token: string;
  treeCount: number;
  type?: string;
  uid: string;
  units: number;
  donor?: ContactDetails;
}

export interface Destination {
  country: string;
  currency: string;
  id: string;
  name: string;
  purpose: string;
  type: string;
}

export interface Gift {
  code?: string;
  id?: string;
  project?: Project;
  status?: string;
  type?: string;
  units?: number;
}

export interface Project {
  coordinates: number[];
  country: string;
  id: string;
  location: string;
  name: string;
  organization: Organization;
  slug: string;
}

export interface Organization {
  name: string;
  slug: string;
}

export interface Metadata {
  callback_method?: string;
  callback_url?: string;
}

export interface Project2 {
  country: string;
  id: string;
  name: string;
  purpose: string;
}

export interface DonationRequestData {
  purpose: ProjectPurpose;
  project?: string;
  amount: number;
  currency: string;
  donor: ContactDetails;
  frequency: string;
  metadata: Metadata;
  quantity?: number;
  taxDeductionCountry?: string;
  gift?: GiftDetails;
}
