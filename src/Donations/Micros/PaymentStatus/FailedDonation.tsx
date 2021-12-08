import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import PaymentFailedIllustration from "../../../../public/assets/icons/donation/PaymentFailed";
import CloseIcon from "../../../../public/assets/icons/CloseIcon";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";
import { apiRequest } from "src/Utils/api";
import { useRouter } from "next/router";
import { PAYMENT } from "src/Utils/donationStepConstants";
import InfoIcon from "public/assets/icons/InfoIcon";

function FailedDonation({ sendToReturn, donation }: any) {
  const { t } = useTranslation(["common"]);
  // const [paymentError, setPaymentError] = useState("");
  const {
    returnTo,
    donationID,
    setcountry,
    setIsTaxDeductible,
    setprojectDetails,
    setquantity,
    setContactDetails,
    setisGift,
    setgiftDetails,
    setfrequency,
    setdonationStep,
    setcurrency,
    setshowErrorCard,
    setpaymentSetup,
    country,
    paymentError,
    setPaymentError,
  } = React.useContext(QueryParamContext);
  const router = useRouter();
  console.log(paymentError, "paymentError");
  const [isPaymentOptionsLoading, setIsPaymentOptionsLoading] =
    React.useState<boolean>(false);

  async function loadPaymentSetup(
    projectGUID: string | string[],
    paymentSetupCountry: string
  ) {
    setIsPaymentOptionsLoading(true);
    try {
      const requestParams = {
        url: `/app/projects/${projectGUID}/paymentOptions?country=${paymentSetupCountry}`,
        setshowErrorCard,
      };
      const paymentSetupData: any = await apiRequest(requestParams);
      if (paymentSetupData.data) {
        setcurrency(paymentSetupData.data.currency);
        if (!country) {
          setcountry(paymentSetupData.data.effectiveCountry);
        }
        setpaymentSetup(paymentSetupData.data);
      }
      setIsPaymentOptionsLoading(false);
      // setdonationStep(3);
    } catch (err) {
      // console.log(err);
    }
  }
  async function getDonation() {
    console.log(donation, "Donation");
    setIsTaxDeductible(donation.taxDeductionCountry);
    setprojectDetails(donation.project);
    setPaymentError("");
    // if (donation?.project?.purpose === "trees") {
    //   setquantity(donation?.treeCount);
    // }
    setContactDetails(donation.donor);
    let country;
    if (donation.taxDeductionCountry) {
      country = donation.taxDeductionCountry;
    } else {
      country = donation.donor.country;
    }
    setcountry(country);
    setcurrency(donation.currency);
    if (donation.gift && donation.gift.recipientName) {
      setisGift(donation.gift.recipientName);
      // TODO - Gift type invitation and direct will have different properties
      setgiftDetails({
        recipientName: donation.gift.recipientName,
      });
    }
    // TODO - Test this again after backend is updated
    setfrequency(donation.isRecurrent ? donation.frequency : "once");
    loadPaymentSetup(donation.project.id, country);
    setdonationStep(3);
    router.push({
      query: { ...router.query, step: PAYMENT },
    });
  }

  return (
    <div>
      {returnTo && (
        <button
          id={"thank-you-close"}
          onClick={() => sendToReturn()}
          className="mb-10"
          style={{ alignSelf: "flex-start" }}
        >
          <CloseIcon color={themeProperties.light.primaryFontColor} />
        </button>
      )}

      <div className={"title-text text-center"} data-test-id="donation-failed">
        {t("common:donationFailed")}
      </div>
      <div className={"mt-20 text-center"}>
        {t("common:donationFailedMessage")}
      </div>
      {paymentError && (
        <div
          className={
            "mt-20 d-flex align-items-center callout-danger text-danger"
          }
          style={{ marginBottom: "10px" }}
        >
          <InfoIcon />
          {paymentError}
        </div>
      )}
      <PaymentFailedIllustration />
      {donationID && (
        <button
          onClick={() => getDonation()}
          className="primary-button mt-20 mb-20"
          data-test-id="retryDonation"
        >
          {t("common:retryPayment")}
        </button>
      )}
    </div>
  );
}

export default FailedDonation;
