import React from "react";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import GiftForm from "../Micros/GiftForm";
import { useTranslation } from "next-i18next";
import getFormatedCurrency from "../../Utils/getFormattedCurrency";
import { getMinimumAmountForCurrency } from "../../Utils/getExchange";
import { formatAmountForStripe } from "../../Utils/stripe/stripeHelpers";
import { NativePay } from "../PaymentMethods/PaymentRequestCustomButton";
import ButtonLoader from "../../Common/ContentLoaders/ButtonLoader";
import {
  createDonationFunction,
  payDonationFunction,
} from "../PaymentMethods/PaymentFunctions";
import PaymentProgress from "../../Common/ContentLoaders/Donations/PaymentProgress";
import SelectCurrencyModal from "./../Micros/SelectCurrencyModal";
import TaxDeductionOption from "./../Micros/TaxDeductionOption";
import Authentication from "./../Micros/Authentication";
import { useAuth0 } from "@auth0/auth0-react";
import DonationAmount from "../Micros/DonationAmount";
import TreeDonation from "../Micros/DonationTypes/TreeDonation";
import FundingDonations from "../Micros/DonationTypes/FundingDonations";
import FrequencyOptions from "../Micros/FrequencyOptions";
import { useRouter } from "next/router";
import BouquetDonations from "../Micros/DonationTypes/BouquetDonations";
import { CONTACT } from "src/Utils/donationStepConstants";

function DonationsForm() {
  const {
    isGift,
    setdonationStep,
    quantity,
    currency,
    paymentSetup,
    projectDetails,
    country,
    giftDetails,
    setIsTaxDeductible,
    isPaymentOptionsLoading,
    setPaymentType,
    setdonationID,
    isTaxDeductible,
    setshowErrorCard,
    queryToken,
    profile,
    frequency,
    tenant,
    setTransferDetails,
  } = React.useContext(QueryParamContext);
  const { t, i18n } = useTranslation(["common", "country", "donate"]);

  const [minAmt, setMinAmt] = React.useState(0);
  const [showFrequencyOptions, setShowFrequencyOptions] = React.useState(false);
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const router = useRouter();

  React.useEffect(() => {
    if (paymentSetup.minQuantity) {
      setMinAmt((paymentSetup.minQuantity * paymentSetup.unitCost).toFixed(2));
    } else {
      setMinAmt(getMinimumAmountForCurrency(currency));
    }
  }, [currency, paymentSetup]);

  React.useEffect(() => {
    // if (Object.keys(paymentSetup).length !== 0 && paymentSetup?.gateways) {
    //   for (const gateway in paymentSetup?.gateways) {
    //     const frequencies = paymentSetup.gateways[gateway].recurrency.intervals;
    //     console.log(frequencies, "frequencies");
    //     if (frequencies && frequencies.length > 0) {
    //       console.log("Show Frequency Options");
    //       setShowFrequencyOptions(true);
    //     }
    //   }
    // }
    if (paymentSetup && paymentSetup?.recurrency) {
      setShowFrequencyOptions(paymentSetup?.recurrency.supported);
    }
  }, [paymentSetup]);
  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);
  const purposes = ["trees"];
  const [paymentError, setPaymentError] = React.useState("");
  // let queryParams = { ...router.query };
  // delete queryParams.callback_method;
  // console.log(queryParams, "queryParams");
  const onPaymentFunction = async (paymentMethod: any, paymentRequest: any) => {
    // eslint-disable-next-line no-underscore-dangle
    setPaymentType(paymentRequest._activeBackingLibraryName);

    let fullName = paymentMethod.billing_details.name;
    fullName = String(fullName).split(" ");
    const firstName = fullName[0];
    fullName.shift();
    const lastName = String(fullName).replace(/,/g, " ");

    const contactDetails = {
      firstname: firstName,
      lastname: lastName,
      email: paymentMethod.billing_details.email,
      address: paymentMethod.billing_details.address.line1,
      zipCode: paymentMethod.billing_details.address.postal_code,
      city: paymentMethod.billing_details.address.city,
      country: paymentMethod.billing_details.address.country,
    };

    let token = null;
    if ((!isLoading && isAuthenticated) || (queryToken && profile.address)) {
      token = queryToken ? queryToken : await getAccessTokenSilently();
    }

    await createDonationFunction({
      isTaxDeductible,
      country,
      projectDetails,
      paymentSetup,
      quantity,
      currency,
      contactDetails,
      isGift,
      giftDetails,
      setIsPaymentProcessing,
      setPaymentError,
      setdonationID,
      token,
      setshowErrorCard,
      frequency,
      tenant,
    }).then(async (res) => {
      let token = null;
      if ((!isLoading && isAuthenticated) || queryToken) {
        token = queryToken ? queryToken : await getAccessTokenSilently();
      }
      payDonationFunction({
        gateway: "stripe",
        method: "card", // Hard coding card here since we only have card enabled in gpay and apple pay
        providerObject: paymentMethod, // payment method
        setIsPaymentProcessing,
        setPaymentError,
        t,
        paymentSetup,
        donationID: res.id,
        contactDetails,
        token,
        country,
        setshowErrorCard,
        router,
        tenant,
        setTransferDetails,
      });
    });
  };

  const [openCurrencyModal, setopenCurrencyModal] = React.useState(false);

  const donationSelection = () => {
    switch (projectDetails.purpose) {
      case "funds":
        return <FundingDonations setopenCurrencyModal={setopenCurrencyModal} />;
      case "conservation":
      case "bouquet":
        return <BouquetDonations setopenCurrencyModal={setopenCurrencyModal} />;
      case "trees":
      default:
        return <TreeDonation setopenCurrencyModal={setopenCurrencyModal} />;
    }
  };

  let paymentLabel = "";

  if (paymentSetup && currency) {
    switch (projectDetails.purpose) {
      case "trees":
        paymentLabel = t("treesInCountry", {
          treeCount: quantity,
          country: t(`country:${projectDetails.country.toLowerCase()}`),
        });
        break;
      case "funds":
        paymentLabel = t("fundingPaymentLabel", {
          amount: getFormatedCurrency(
            i18n.language,
            currency,
            paymentSetup.unitCost * quantity
          ),
        });
        break;
      case "bouquet":
      case "conservation":
        paymentLabel = t("bouquetPaymentLabel", {
          amount: getFormatedCurrency(
            i18n.language,
            currency,
            paymentSetup.unitCost * quantity
          ),
        });
        break;
      default:
        paymentLabel = t("treesInCountry", {
          treeCount: quantity,
          country: t(`country:${projectDetails?.country?.toLowerCase()}`),
        });
        break;
    }
  }

  return isPaymentProcessing ? (
    <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
  ) : (
    <div className="donations-forms-container">
      <div className="w-100">
        <Authentication />
        <div className="donations-tree-selection-step">
          {projectDetails.purpose !== "funds" && (
            <p className="title-text">{t("donate")}</p>
          )}
          {projectDetails.purpose === "trees" ? (
            <div className="donations-gift-container mt-10">
              <GiftForm />
            </div>
          ) : (
            <></>
          )}

          {process.env.RECURRENCY &&
          showFrequencyOptions &&
          !(isGift && giftDetails.recipientName === "") ? (
            <div
              className={`donations-gift-container mt-10 ${
                Object.keys(paymentSetup.frequencies).length == 2
                  ? "funds-frequency-container"
                  : ""
              }`}
            >
              <FrequencyOptions />
            </div>
          ) : (
            <></>
          )}

          {donationSelection()}

          <div
            className={`${
              isGift && giftDetails.recipientName === "" ? "display-none" : ""
            }`}
          >
            <TaxDeductionOption />

            <div className={"horizontal-line"} />

            {(projectDetails.purpose === "trees" ||
              projectDetails.purpose === "conservation") && <DonationAmount />}

            {paymentSetup && projectDetails ? (
              minAmt && paymentSetup?.unitCost * quantity >= minAmt ? (
                !isPaymentOptionsLoading &&
                paymentSetup?.gateways?.stripe?.account &&
                currency ? (
                  <NativePay
                    country={country}
                    currency={currency}
                    amount={formatAmountForStripe(
                      paymentSetup?.unitCost * quantity,
                      currency.toLowerCase()
                    )}
                    onPaymentFunction={onPaymentFunction}
                    paymentSetup={paymentSetup}
                    continueNext={() => {
                      router.push({
                        query: { ...router.query, step: CONTACT },
                      });
                      setdonationStep(2);
                    }}
                    isPaymentPage={false}
                    paymentLabel={paymentLabel}
                    frequency={frequency}
                  />
                ) : (
                  <div className="mt-20 w-100">
                    <ButtonLoader />
                  </div>
                )
              ) : minAmt > 0 ? (
                <p className={"text-danger mt-20 text-center"}>
                  {t("minDonate")}{" "}
                  <span>
                    {getFormatedCurrency(i18n.language, currency, minAmt)}
                  </span>
                </p>
              ) : (
                <></>
              )
            ) : (
              <div className="mt-20 w-100">
                <ButtonLoader />
              </div>
            )}
          </div>
        </div>
      </div>

      <SelectCurrencyModal
        openModal={openCurrencyModal}
        handleModalClose={() => setopenCurrencyModal(false)}
      />
    </div>
  );
}

export default DonationsForm;
