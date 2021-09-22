import React from "react";
import { useTranslation } from "next-i18next";
import PaymentFailedIllustration from "../../../../public/assets/icons/donation/PaymentFailed";
import CloseIcon from "../../../../public/assets/icons/CloseIcon";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";
import { apiRequest } from "src/Utils/api";

function FailedDonation({ sendToReturn,donation }: any) {
  const { t } = useTranslation(["common"]);

  const { returnTo, donationID, setcountry,setIsTaxDeductible,setprojectDetails, setquantity,setContactDetails, setisGift, setgiftDetails,setfrequency,setdonationStep,setcurrency,setshowErrorCard,setpaymentSetup,country } = React.useContext(QueryParamContext);

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
      setdonationStep(3);
    } catch (err) {
      // console.log(err);
    }
  }
  async function getDonation() {
    setIsTaxDeductible(donation.taxDeductionCountry);
    setprojectDetails(donation.project);
    setquantity(donation.amount);
    setContactDetails(donation.donor);
    let country;
    if (donation.taxDeductionCountry) {
      country = donation.taxDeductionCountry;
    } else {
      country = donation.donor.country;
    }
    setcountry(country);
    setcurrency(donation.currency);
    if(donation.gift && donation.gift.recipientName ){
      setisGift(donation.gift.recipientName);
      setgiftDetails({
        recipientName:donation.gift.recipientName
      });
    }
    setfrequency(donation.isRecurrent ? donation.frequency : "once");
    loadPaymentSetup(donation.project.id,country);
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

      <div className={"title-text text-center"}>
        {t("common:donationFailed")}
      </div>
      <div className={"mt-20 text-center"}>
        {t("common:donationFailedMessage")}
      </div>
      <PaymentFailedIllustration />
      {donationID && (
        <button
          onClick={()=>getDonation()}
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
