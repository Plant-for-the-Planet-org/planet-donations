import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ContactDetails, NoGift } from "@planet-sdk/common";
import {
  FetchedProjectDetails,
  PaymentOptions,
  PlanetCashSignupDetails,
  OnBehalfDonor,
  GiftDetails,
} from "src/Common/Types";
import Avatar from "./Avatar";
import TransactionSummary from "./TransactionSummary";
import SummaryTitle from "./SummaryTitle";
import ProjectInfo from "./ProjectInfo";
import styles from "./LeftPanel.module.scss";
import GiftInfo from "./GiftInfo";
import OnBehalfInfo from "./OnBehalfInfo";
import ContactDetailsInfo from "./ContactDetailsInfo";

interface Props {
  isMobile: boolean;
  projectDetails: FetchedProjectDetails | null;
  pCashSignupDetails: PlanetCashSignupDetails | null;
  donationStep: number | null;
  donationID: string | null;
  paymentSetup: PaymentOptions | null;
  quantity: number;
  currency: string;
  frequency: string;
  giftDetails: GiftDetails | NoGift;
  contactDetails: ContactDetails;
  isPlanetCashActive: boolean;
  isGift: boolean;
  onBehalf: boolean;
  onBehalfDonor: OnBehalfDonor;
  tenant: string;
  country: string;
}

const LeftPanelInfo = ({
  isMobile,
  projectDetails,
  pCashSignupDetails,
  donationStep,
  donationID,
  paymentSetup,
  quantity,
  currency,
  frequency,
  giftDetails,
  contactDetails,
  isPlanetCashActive,
  isGift,
  onBehalf,
  onBehalfDonor,
  tenant,
  country,
}: Props): ReactElement | null => {
  const { i18n } = useTranslation("common");
  const router = useRouter();

  const info = projectDetails || pCashSignupDetails;
  const canShowAvatar =
    pCashSignupDetails !== null || (donationStep !== null && donationStep > 0);
  const canShowTransactionSummary =
    paymentSetup !== null && (donationStep === 2 || donationStep === 3);
  const canShowSummary =
    pCashSignupDetails !== null || (donationStep !== null && donationStep > 0);
  const canShowGift =
    (donationStep === 1 || donationStep === 2 || donationStep === 3) &&
    giftDetails.type !== null &&
    isGift &&
    giftDetails.recipientName !== undefined &&
    projectDetails?.purpose !== "planet-cash";
  const canShowOnBehalf =
    donationStep === 1 &&
    isPlanetCashActive &&
    onBehalf &&
    onBehalfDonor.firstName.length > 0;
  const canShowContactDetails =
    donationStep === 3 && contactDetails.firstname.length > 0;
  const canShowDonationLink =
    donationID !== null && !(isMobile && router.query.step === "thankyou");

  return info !== null ? (
    <div className={styles["left-panel-info"]}>
      {canShowAvatar && <Avatar info={info} />}
      {canShowTransactionSummary && (
        <TransactionSummary
          currency={currency}
          quantity={quantity}
          frequency={frequency}
          paymentSetup={paymentSetup}
        />
      )}
      {canShowSummary && (
        <div className={styles["summary-container"]}>
          <SummaryTitle info={info} />
          {info.purpose !== "planet-cash-signup" && (
            <ProjectInfo projectDetails={info} />
          )}
        </div>
      )}
      {canShowGift && <GiftInfo giftDetails={giftDetails} />}
      {canShowOnBehalf && <OnBehalfInfo onBehalfDonor={onBehalfDonor} />}
      {canShowContactDetails && (
        <ContactDetailsInfo contactDetails={contactDetails} />
      )}

      {canShowDonationLink && (
        <a
          href={`${process.env.APP_URL}/${i18n.language}?context=${donationID}&tenant=${tenant}&country=${country}`}
          className={styles["donation-link"]}
          data-test-id="referenceDonation"
        >
          {`Ref - ${donationID}`}
        </a>
      )}
    </div>
  ) : null;
};

export default LeftPanelInfo;
