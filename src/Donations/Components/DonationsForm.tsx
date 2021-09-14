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
    frequency,
    tenant
  } = React.useContext(QueryParamContext);
  const { t, i18n } = useTranslation(["common", "country", "donate"]);

  const [minAmt, setMinAmt] = React.useState(0);
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const router = useRouter();
  React.useEffect(() => {
    setMinAmt(getMinimumAmountForCurrency(currency));
  }, [currency]);

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);

  const [paymentError, setPaymentError] = React.useState("");

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
    if ((!isLoading && isAuthenticated) || queryToken) {
      token = queryToken ? queryToken : await getAccessTokenSilently();
    }

    await createDonationFunction({
      isTaxDeductible,
      country,
      projectDetails,
      unitCost: paymentSetup.unitCost,
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
    }).then(async (res) => {
      let token = null;
      if ((!isLoading && isAuthenticated) || queryToken) {
        token = queryToken ? queryToken : await getAccessTokenSilently();
      }
      payDonationFunction({
        gateway: "stripe",
        paymentMethod,
        setIsPaymentProcessing,
        setPaymentError,
        t,
        paymentSetup,
        donationID: res.id,
        setdonationStep,
        token,
        country,
        setshowErrorCard,
        router,
        tenant
      });
    });
  };

  const [openCurrencyModal, setopenCurrencyModal] = React.useState(false);

  const donationSelection = () => {
    switch (projectDetails.purpose) {
      case "trees":
        return <TreeDonation setopenCurrencyModal={setopenCurrencyModal} />;
      case "funds":
        return <FundingDonations setopenCurrencyModal={setopenCurrencyModal} />;
      case "bouquet":
        return <BouquetDonations setopenCurrencyModal={setopenCurrencyModal} />;
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
          country: t(`country:${projectDetails.country.toLowerCase()}`),
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
          <p className="title-text">{t("donate")}</p>
          {projectDetails.purpose === "trees" ? (
            <div className="donations-gift-container mt-10">
              <GiftForm />
            </div>
          ) : (
            <></>
          )}

          {process.env.RECURRENCY &&
          projectDetails.purpose === "trees" &&
          projectDetails.frequencies ? (
            <div className="donations-gift-container mt-10">
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

            {projectDetails.purpose === "trees" && <DonationAmount />}

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
                      setdonationStep(2);
                      router.push({
                        query: { ...router.query, step: "contact" },
                      });
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
