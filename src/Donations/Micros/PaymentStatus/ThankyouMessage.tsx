import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import getFormatedCurrency from "src/Utils/getFormattedCurrency";
import { getFormattedNumber } from "src/Utils/getFormattedNumber";

interface Props {
  projectDetails: any;
  donation: any;
  paymentTypeUsed: any;
}

function ThankyouMessage({
  projectDetails,
  donation,
  paymentTypeUsed,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(["common", "country"]);
  let currencyFormat = () => {};
  if (donation) {
    currencyFormat = () =>
      getFormatedCurrency(i18n.language, donation.currency, donation.amount);
  }

  // EXAMPLE: Your ₹21,713.64 donation was successful {with Google Pay}
  const donationSuccessfulMessage = t(
    paymentTypeUsed === "GOOGLE_PAY" || paymentTypeUsed === "APPLE_PAY"
      ? "common:donationSuccessfulWith"
      : "common:donationSuccessful",
    {
      totalAmount: currencyFormat(),
      paymentTypeUsed,
    }
  );

  // EXAMPLE: We've sent an email to Sagar Aryal about the gift.
  // TO DO - if recipientEmail is not present, then show message - You will receive the Gift certificate for {{recipientName}} on your email
  const donationGiftMessage =
    donation && donation.gift && donation.gift.recipientEmail
      ? " " +
        t("common:giftSentMessage", {
          recipientName: donation.gift.recipientName,
        })
      : null;

  // EXAMPLE: Your 50 trees will be planted by AMU EcoVillage Project, Ethiopia in Ethiopia.
  const donationProjectMessage = donation.project
    ? " " +
      t("common:yourTreesPlantedByOnLocation", {
        treeCount: getFormattedNumber(
          i18n.language,
          Number(donation.treeCount)
        ),
        projectName: donation.project.name,
        location: t("country:" + donation.project.country.toLowerCase()),
      })
    : null;

  const Message = () => {
    return (
      <div>
        {projectDetails.purpose === "trees" && (
          <>
            <div className={"mt-20 thankyouText"}>
              {donationSuccessfulMessage}
              {donationGiftMessage}
              {donationProjectMessage}
            </div>
            <div className={"mt-20 thankyouText"}>
              {t("common:contributionMessage")}
            </div>
          </>
        )}

        {projectDetails.purpose === "funds" && (
          <>
            <div className={"mt-20 thankyouText"}>
              {donationSuccessfulMessage}
              {donationGiftMessage}
              {" " + t("common:fundingDonationSuccess")}
            </div>
            <div className={"mt-20 thankyouText"}>
              {t("common:fundingContributionMessage")}
            </div>
          </>
        )}

        {projectDetails.purpose === "bouquet" && (
          <>
            <div className={"mt-20 thankyouText"}>
              {donationSuccessfulMessage}
              {" " + t("common:fundingDonationSuccess")}
            </div>
            <div className={"mt-20 thankyouText"}>
              {t("common:fundingContributionMessage")}
            </div>
          </>
        )}
      </div>
    );
  };

  return <Message />;
}

export default ThankyouMessage;
