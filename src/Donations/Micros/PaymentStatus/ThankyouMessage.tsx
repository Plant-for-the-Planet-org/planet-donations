import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import getFormattedCurrency from "src/Utils/getFormattedCurrency";
import { getFormattedNumber } from "src/Utils/getFormattedNumber";
import { QueryParamContext } from "src/Layout/QueryParamContext";
import { Donation } from "@planet-sdk/common/build/types/donation";

interface Props {
  donation: Donation;
  paymentTypeUsed: string;
}

function ThankyouMessage({ donation, paymentTypeUsed }: Props): ReactElement {
  const { tenant, frequency, isSupportedDonation } =
    React.useContext(QueryParamContext);
  const { t, i18n } = useTranslation(["common", "country"]);
  let currencyFormat = () => {};
  if (donation) {
    currencyFormat = () =>
      getFormattedCurrency(
        i18n.language,
        donation.currency,
        Number(donation.amount),
      );
  }

  // EXAMPLE: Your ₹21,713.64 donation was successful {with Google Pay}
  const donationSuccessfulMessage = t(
    isSupportedDonation
      ? "common:supportedDonationSuccessful"
      : paymentTypeUsed === "GOOGLE_PAY" || paymentTypeUsed === "APPLE_PAY"
        ? "common:donationSuccessfulWith"
        : "common:donationSuccessful",
    {
      totalAmount: currencyFormat(),
      paymentTypeUsed,
      purpose:
        donation.destination === null
          ? t("common:generalDonationPurpose")
          : t(`common:${donation.destination.purpose}Purpose`),
      frequency: donation.isRecurrent ? t(`common:${frequency}Success`) : "",
    },
  );

  // EXAMPLE: We've sent an email to Sagar Aryal about the gift.
  // TO DO - if recipientEmail is not present, then show message - You will receive the Gift certificate for {{recipientName}} on your email
  const donationGiftMessage =
    donation?.gift?.type === "invitation" && donation.gift.recipientEmail //TODOO - address TS warnings after /donations is updated to send gift data
      ? " " +
        t("common:giftSentMessage", {
          recipientName: donation.gift.recipientName,
        })
      : null;

  // EXAMPLE: Your donation will be used to restore 1,000 trees by Yucatán Restoration in Mexico.
  // EXAMPLE: Your donation will be used to restore 2,000 m² by Saving Sumatra’s Last Refuge in Indonesia.
  const donationProjectMessage =
    donation.destination && donation.units
      ? " " +
        t("common:restorationDonationUsage", {
          units: getFormattedNumber(i18n.language, donation.units),
          unitType: t(`common:${donation.unitType}`, { count: donation.units }),
          projectName: donation.destination.name,
          location: t("country:" + donation.destination.country.toLowerCase()),
        })
      : null;

  const Message = () => {
    if (!donation.destination) {
      return (
        <div className={"mt-20 thankyouText"}>{donationSuccessfulMessage}</div>
      );
    }

    return (
      <div>
        {donation.destination.purpose === "trees" && (
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

        {donation.destination.purpose === "funds" && (
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

        {donation.destination.purpose === "planet-cash" && (
          <div className="thank-you-purpose">
            <div className="mt-20">{donationSuccessfulMessage}</div>
            <div className="mt-10 go-back">
              {t("common:fundingDonationSuccess")}
            </div>
          </div>
        )}

        {donation.destination.purpose === "bouquet" && (
          <>
            <div className={"mt-20 thankyouText"}>
              {donationSuccessfulMessage}
              {" " + t("common:fundingDonationSuccess")}
            </div>
            {tenant !== "ten_1e5WejOp" && (
              <div className={"mt-20 thankyouText"}>
                {t("common:fundingContributionMessage")}
              </div>
            )}
          </>
        )}
        {donation.destination.purpose === "conservation" && (
          <>
            <div className={"mt-20 thankyouText"}>
              {donationSuccessfulMessage}
              {" " + t("common:fundingDonationSuccess")}
            </div>
            {tenant !== "ten_1e5WejOp" && (
              <div className={"mt-20 thankyouText"}>
                {t("common:fundingContributionMessage")}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return <Message />;
}

export default ThankyouMessage;
