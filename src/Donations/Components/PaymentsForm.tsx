import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import PaymentMethodTabs from "./PaymentMethodTabs";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import BackButton from "../../../public/assets/icons/BackButton";
import { putRequest } from "../../Utils/api";
import PaymentProgress from "../../Common/ContentLoaders/Donations/PaymentProgress";
import { Elements } from "@stripe/react-stripe-js";
import getStripe from "../../Utils/stripe/getStripe";
import getFormatedCurrency from "../../Utils/getFormattedCurrency";
import {
  createDonationFunction,
  payDonationFunction,
} from "../PaymentFunctions";
import ToggleSwitch from "../../Common/InputTypes/ToggleSwitch";
import CardPayments from "../PaymentMethods/CardPayments";
import SepaPayments from "../PaymentMethods/SepaPayments";
import PaypalPayments from "../PaymentMethods/PaypalPayments";
import GiroPayPayments from "../PaymentMethods/GiroPayPayments";
import SofortPayments from "../PaymentMethods/SofortPayment";

interface Props {}

function PaymentsForm({}: Props): ReactElement {
  const { t, ready, i18n } = useTranslation("common");

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);

  const [paymentError, setPaymentError] = React.useState("");

  // This feature allows the user to show or hide their names in the leaderboard
  const [publishName, setpublishName] = React.useState(false);
  const [askpublishName, setaskpublishName] = React.useState(false);

  const {
    paymentSetup,
    country,
    currency,
    setdonationStep,
    donationID,
    setdonationID,
    paymentType,
    setPaymentType,
    contactDetails,
    shouldCreateDonation,
    setshouldCreateDonation,
    treeCount,
    projectDetails,
    isGift,
    giftDetails,
    isTaxDeductible,
  } = React.useContext(QueryParamContext);

  React.useEffect(() => {
    setPaymentType("CARD");
  }, []);

  React.useEffect(() => {
    if (donationID) {
      putRequest(`/app/donations/${donationID}/publish`, {
        publish: publishName,
      });
    }
  }, [publishName, donationID]);

  const sofortCountries = ["AT", "BE", "DE", "IT", "NL", "ES"];

  const onSubmitPayment = (gateway: any, paymentMethod: any) => {
    payDonationFunction({
      gateway,
      paymentMethod,
      setIsPaymentProcessing,
      setPaymentError,
      t,
      paymentSetup,
      donationID,
      setdonationStep,
      contactDetails,
    });
  };

  async function getDonation() {
    const donation = await createDonationFunction({
      isTaxDeductible,
      country,
      projectDetails,
      treeCost: paymentSetup.treeCost,
      treeCount,
      currency,
      contactDetails,
      isGift,
      giftDetails,
      setIsPaymentProcessing,
      setPaymentError,
      setdonationID,
    });
        
    if (donation) {
      setaskpublishName(!donation.hasPublicProfile);
      setpublishName(donation.hasPublicProfile);
      setdonationID(donation.id);
      setshouldCreateDonation(false);
    }
  }
  React.useEffect(() => {
    if (shouldCreateDonation) {
      getDonation();
    }
  }, [shouldCreateDonation]);

  console.log('donationID',donationID);
  

  return ready ? (
    isPaymentProcessing ? (
      <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
    ) : (
      <div className={"donations-forms-container"}>
        <div className="donations-form">
          <button onClick={() => setdonationStep(2)} className="mb-10">
            <BackButton />
          </button>
          <p className="title-text">{t("paymentDetails")}</p>

          {paymentError && <div className={"text-danger"}>{paymentError}</div>}

          {paymentSetup && paymentSetup.gateways && (
            <PaymentMethodTabs
              paymentType={paymentType}
              setPaymentType={setPaymentType}
              showCC={paymentSetup?.gateways.stripe.methods.includes(
                "stripe_cc"
              )}
              showGiroPay={
                country === "DE" &&
                paymentSetup?.gateways.stripe.methods.includes("stripe_giropay")
              }
              showSepa={
                currency === "EUR" &&
                //   (config.enableGuestSepa || token) &&
                paymentSetup?.gateways.stripe.methods.includes("stripe_sepa")
              }
              showSofort={
                sofortCountries.includes(country) &&
                paymentSetup?.gateways.stripe.methods.includes("stripe_sofort")
              }
              showPaypal={
                paypalCurrencies.includes(currency) &&
                paymentSetup?.gateways.paypal
              }
            />
          )}

          <div className={"treeDonationContainer"}>
            {!contactDetails.companyname &&
            contactDetails.companyname === "" ? (
              askpublishName ? (
                <div className={"isCompany"}>
                  <label htmlFor="publishName" className={"isCompanyText"}>
                    {t("askPublishName")}
                  </label>
                  <ToggleSwitch
                    id="publishName"
                    checked={publishName}
                    onChange={() => {
                      setpublishName(!publishName);
                    }}
                    name="checkedB"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </div>
              ) : (
                <div className={"isCompany"}>
                  <label
                    className={"isCompanyText"}
                    style={{ textAlign: "center" }}
                  >
                    {t("nameAlreadyPublished")}
                  </label>
                </div>
              )
            ) : null}
          </div>

          {donationID && (
            <div className="mt-30">
              <div
                role="tabpanel"
                hidden={paymentType !== "CARD"}
                id={`payment-methods-tabpanel-${"CARD"}`}
                aria-labelledby={`scrollable-force-tab-${"CARD"}`}
              >
                <Elements stripe={getStripe(paymentSetup)}>
                  <CardPayments
                    contactDetails={contactDetails}
                    totalCost={getFormatedCurrency(
                      i18n.language,
                      currency,
                      treeCount * paymentSetup.treeCost
                    )}
                    onPaymentFunction={(data) =>
                      onSubmitPayment("stripe", data)
                    }
                    paymentType={paymentType}
                    setPaymentType={setPaymentType}
                  />
                </Elements>
              </div>

              {/* SEPA */}
              <div
                role="tabpanel"
                hidden={paymentType !== "SEPA"}
                id={`payment-methods-tabpanel-${"SEPA"}`}
                aria-labelledby={`scrollable-force-tab-${"SEPA"}`}
              >
                <Elements stripe={getStripe(paymentSetup)}>
                  <SepaPayments
                    paymentType={paymentType}
                    onPaymentFunction={onSubmitPayment}
                    contactDetails={contactDetails}
                  />
                </Elements>
              </div>

              {/* Paypal */}
              <div
                role="tabpanel"
                hidden={paymentType !== "Paypal"}
                id={`payment-methods-tabpanel-${"Paypal"}`}
                aria-labelledby={`scrollable-force-tab-${"Paypal"}`}
              >
                {paymentType === "Paypal" && (
                  <PaypalPayments
                    paymentSetup={paymentSetup}
                    treeCount={treeCount}
                    treeCost={paymentSetup.treeCost}
                    currency={currency}
                    donationID={donationID}
                    payDonationFunction={onSubmitPayment}
                  />
                )}
              </div>
              <div
                role="tabpanel"
                hidden={paymentType !== "GiroPay"}
                id={`payment-methods-tabpanel-${"GiroPay"}`}
                aria-labelledby={`scrollable-force-tab-${"GiroPay"}`}
              >
                <Elements stripe={getStripe(paymentSetup)}>
                  <GiroPayPayments onSubmitPayment={onSubmitPayment} />
                </Elements>
              </div>

              <div
                role="tabpanel"
                hidden={paymentType !== "Sofort"}
                id={`payment-methods-tabpanel-${"Sofort"}`}
                aria-labelledby={`scrollable-force-tab-${"Sofort"}`}
              >
                <Elements stripe={getStripe(paymentSetup)}>
                  <SofortPayments onSubmitPayment={onSubmitPayment} />
                </Elements>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  ) : (
    <></>
  );
}

export default PaymentsForm;

export const paypalCurrencies = [
  "AUD",
  "BRL",
  "CAD",
  "CZK",
  "DKK",
  "EUR",
  "HKD",
  "HUF",
  "ILS",
  "JPY",
  "MYR",
  "MXN",
  "NOK",
  "NZD",
  "PHP",
  "PLN",
  "GBP",
  "RUB",
  "SGD",
  "SEK",
  "CHF",
  "TWD",
  "THB",
  "TRY",
  "USD",
];
