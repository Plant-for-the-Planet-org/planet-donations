import { Dispatch, SetStateAction } from "react";
import { PaymentSetupProps } from "src/Common/Types";
import { apiRequest } from "./api";

async function loadPaymentSetup({
  projectGUID,
  paymentSetupCountry,
  setIsPaymentOptionsLoading,
  setshowErrorCard,
  tenant,
  setcurrency,
  country,
  setcountry,
  setpaymentSetup,
  setprojectDetails,
  shouldSetPaymentDetails,
}: {
  projectGUID: string;
  paymentSetupCountry: string | string[];
  setIsPaymentOptionsLoading: Dispatch<SetStateAction<boolean>>;
  setshowErrorCard: Dispatch<SetStateAction<boolean>>;
  tenant: string;
  setcurrency?: Dispatch<SetStateAction<string>>;
  country?: string | string[];
  setcountry?: Dispatch<SetStateAction<string | string[]>> | undefined;
  setpaymentSetup?: Dispatch<SetStateAction<{} | PaymentSetupProps>>;
  setprojectDetails?: Dispatch<SetStateAction<Object | null>>;
  shouldSetPaymentDetails?: Boolean;
}) {
  setIsPaymentOptionsLoading(true);
  try {
    const requestParams = {
      url: `/app/projects/${projectGUID}/paymentOptions?country=${paymentSetupCountry}`,
      setshowErrorCard,
      tenant,
    };
    const paymentSetupData: any = await apiRequest(requestParams);
    if (paymentSetupData.data) {
      const paymentSetup = paymentSetupData.data;
      if (shouldSetPaymentDetails) {
        setcurrency(paymentSetup.currency);
        if (!country) {
          setcountry(paymentSetup.effectiveCountry);
          localStorage.setItem("countryCode", paymentSetup.effectiveCountry);
        }

        setpaymentSetup(paymentSetup);
      }
      setprojectDetails({
        id: paymentSetup.id,
        name: paymentSetup.name,
        description: paymentSetup.description,
        purpose: paymentSetup.purpose,
        ownerName: paymentSetup.ownerName,
        taxDeductionCountries: paymentSetup.taxDeductionCountries,
        ownerImage: paymentSetup.image,
        ownerAvatar: paymentSetup.ownerAvatar,
      });
    }
    setIsPaymentOptionsLoading(false);
  } catch (err) {
    // console.log(err);
  }
}

export default loadPaymentSetup;
