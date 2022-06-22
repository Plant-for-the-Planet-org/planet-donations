import { useTranslation } from "next-i18next";
import PaymentFailedIllustration from "../../../../public/assets/icons/donation/PaymentFailed";
import CloseIcon from "../../../../public/assets/icons/CloseIcon";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";
import InfoIcon from "public/assets/icons/InfoIcon";
import RetryIcon from "public/assets/icons/RetryIcon";

function FailedDonation({ sendToReturn, donation }: any) {
  const { t } = useTranslation(["common"]);

  const {
    callbackUrl,
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
    paymentError,
    setPaymentError,
    setAmount,
    setcallbackUrl,
    setCallbackMethod,
    setredirectstatus,
    loadPaymentSetup,
  } = React.useContext(QueryParamContext);

  async function getDonation() {
    setIsTaxDeductible(donation.taxDeductionCountry);
    setprojectDetails(donation.project);
    setPaymentError("");
    setquantity(donation?.quantity);
    setContactDetails(donation.donor);
    setAmount(donation.amount);

    let country;
    if (donation.taxDeductionCountry) {
      country = donation.taxDeductionCountry;
    } else {
      country = donation.donor.country;
    }
    setcountry(country);
    localStorage.setItem("countryCode", country);
    setcurrency(donation.currency);
    if (donation.gift) {
      setisGift(donation.gift.recipientName ? true : false);

      const _giftDetails = {
        ...(donation.gift.recipientName
          ? { recipientName: donation.gift.recipientName }
          : {}),
        ...(donation.gift.recipientEmail
          ? { recipientEmail: donation.gift.recipientEmail }
          : {}),
        ...(donation.gift.type ? { type: donation.gift.type } : {}),
      };
      // TODO - Gift type invitation and direct will have different properties
      setgiftDetails(_giftDetails);
    }

    // TODO - Test this again after backend is updated
    setfrequency(donation.isRecurrent ? donation.frequency : "once");
    await loadPaymentSetup({
      projectGUID: donation.project.id,
      paymentSetupCountry: country,
      shouldSetPaymentDetails: true,
    });
    setcallbackUrl(donation.metadata.callback_url);
    setCallbackMethod(donation.metadata.callback_method);
    setredirectstatus("");
    setdonationStep(3);
  }

  return (
    <div>
      {callbackUrl && (
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
          <RetryIcon color="#fff" />
          {t("common:retryPayment")}
        </button>
      )}
    </div>
  );
}

export default FailedDonation;
