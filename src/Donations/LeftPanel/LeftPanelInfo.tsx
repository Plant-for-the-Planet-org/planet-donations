import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ContactDetails, NoGift } from "@planet-sdk/common";
import {
  FetchedProjectDetails,
  PaymentOptions,
  PlanetCashSignupDetails,
  OnBehalfDonor,
  SentGift,
} from "src/Common/Types";
import Avatar from "./Avatar";
import TransactionSummary from "./TransactionSummary";
import ProjectTitle from "./ProjectTitle";
import ProjectInfo from "./ProjectInfo";
import styles from "./LeftPanel.module.scss";
import GiftInfo from "./GiftInfo";
import OnBehalfInfo from "./OnBehalfInfo";
import ContactDetailsInfo from "./ContactDetailsInfo";

interface Props {
  isMobile: boolean;
  projectDetails: FetchedProjectDetails | PlanetCashSignupDetails | null;
  donationStep: number | null;
  donationID: string | null;
  paymentSetup: PaymentOptions | null;
  quantity: number;
  currency: string;
  frequency: string;
  giftDetails: SentGift | NoGift;
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

  const canShowAvatar = donationStep !== null && donationStep > 0;
  const canShowTransactionSummary =
    paymentSetup !== null && (donationStep === 2 || donationStep === 3);
  const canShowProject = donationStep !== null && donationStep > 0;
  const canShowGift =
    (donationStep === 1 || donationStep === 2 || donationStep === 3) &&
    giftDetails.type !== null &&
    isGift &&
    giftDetails.recipientName !== undefined;
  const canShowOnBehalf =
    donationStep === 1 &&
    isPlanetCashActive &&
    onBehalf &&
    onBehalfDonor.firstName.length > 0;
  const canShowContactDetails =
    donationStep === 3 && contactDetails.firstname.length > 0;
  const canShowDonationLink =
    donationID !== null && !(isMobile && router.query.step === "thankyou");

  return projectDetails ? (
    <div className={styles["left-panel-info"]}>
      {canShowAvatar && <Avatar projectDetails={projectDetails} />}
      {canShowTransactionSummary && (
        <TransactionSummary
          currency={currency}
          quantity={quantity}
          frequency={frequency}
          paymentSetup={paymentSetup}
        />
      )}
      {canShowProject && (
        <div className={styles["project-info-container"]}>
          <ProjectTitle projectDetails={projectDetails} isMobile={isMobile} />
          {projectDetails.purpose !== "planet-cash-signup" && (
            <ProjectInfo projectDetails={projectDetails} />
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
