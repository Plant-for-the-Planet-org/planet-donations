import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import PaymentMethodTabs from "../PaymentMethods/PaymentMethodTabs";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import BackButton from "../../../public/assets/icons/BackButton";
import { apiRequest } from "../../Utils/api";
import PaymentProgress from "../../Common/ContentLoaders/Donations/PaymentProgress";
import { Elements } from "@stripe/react-stripe-js";
import getStripe from "../../Utils/stripe/getStripe";
import getFormatedCurrency from "../../Utils/getFormattedCurrency";
import {
  createDonationFunction,
  payDonationFunction,
} from "../PaymentMethods/PaymentFunctions";
import ToggleSwitch from "../../Common/InputTypes/ToggleSwitch";
import CardPayments from "../PaymentMethods/CardPayments";
import SepaPayments from "../PaymentMethods/SepaPayments";
import GiroPayPayments from "../PaymentMethods/GiroPayPayments";
import SofortPayments from "../PaymentMethods/SofortPayment";
import TaxDeductionOption from "../Micros/TaxDeductionOption";
import ButtonLoader from "../../Common/ContentLoaders/ButtonLoader";
import { useAuth0 } from "@auth0/auth0-react";
import NewPaypal from "../PaymentMethods/NewPaypal";
import InfoIcon from "../../../public/assets/icons/InfoIcon";
import themeProperties from "../../../styles/themeProperties";
import { ThemeContext } from "../../../styles/themeContext";

interface Props {}

function PaymentsForm({}: Props): ReactElement {
  const { t, ready, i18n } = useTranslation("common", "donate");

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);
  const [isCreatingDonation, setisCreatingDonation] = React.useState(false);

  const [paymentError, setPaymentError] = React.useState("");

  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [isDonationLoading, setisDonationLoading] = React.useState(false);
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
    quantity,
    projectDetails,
    isGift,
    giftDetails,
    isTaxDeductible,
    isDirectDonation,
    setDonationUid,
    setshowErrorCard,
    hideTaxDeduction,
    queryToken,
    frequency,
  } = React.useContext(QueryParamContext);

  React.useEffect(() => {
    setPaymentType("CARD");
  }, []);

  const sofortCountries = ["AT", "BE", "DE", "IT", "NL", "ES"];

  const onSubmitPayment = async (gateway: any, paymentMethod: any) => {
    let token = null;
    if ((!isLoading && isAuthenticated) || queryToken) {
      token = queryToken ? queryToken : await getAccessTokenSilently();
    }
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
      token,
      country,
      setshowErrorCard,
    });
  };

  const onPaymentFunction = async (paymentMethod: any, paymentRequest: any) => {
    setPaymentType(paymentRequest._activeBackingLibraryName);
    let gateway = "stripe";
    onSubmitPayment(gateway, paymentMethod);
  };

  async function getDonation() {
    let token = null;
    if ((!isLoading && isAuthenticated) || queryToken) {
      token = queryToken ? queryToken : await getAccessTokenSilently();
    }
    setisDonationLoading(true);
    const donation = await createDonationFunction({
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
    });

    if (donation) {
      setaskpublishName(!donation.hasPublicProfile);
      setpublishName(donation.hasPublicProfile);
      setdonationID(donation.id);
      setshouldCreateDonation(false);
      setisCreatingDonation(false);
      setDonationUid(donation.uid);
    }
    setisDonationLoading(false);
  }

  // This feature allows the user to show or hide their names in the leaderboard
  const [publishName, setpublishName] = React.useState(null);
  const [askpublishName, setaskpublishName] = React.useState(false);

  React.useEffect(() => {
    if (donationID && publishName !== null) {
      const requestParams = {
        url: `/app/donations/${donationID}/publish`,
        data: { publish: publishName },
        method: "PUT",
        setshowErrorCard,
      };
      apiRequest(requestParams);
    }
  }, [publishName, donationID]);

  React.useEffect(() => {
    if (!isDirectDonation && shouldCreateDonation) {
      setisCreatingDonation(true);
      getDonation();
    }
  }, [shouldCreateDonation]);

  React.useEffect(() => {
    setPaymentType("CARD");
  }, [currency]);
  const { theme } = React.useContext(ThemeContext);

  return ready ? (
    isPaymentProcessing ? (
      <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
    ) : (
      <div className={"donations-forms-container"}>
        <div className="donations-form">
          <div className="d-flex w-100 align-items-center">
            {!isDirectDonation ? (
              <button
                onClick={() => setdonationStep(2)}
                className="d-flex"
                style={{ marginRight: "12px" }}
              >
                <BackButton
                  color={
                    theme === "theme-light"
                      ? themeProperties.light.primaryFontColor
                      : themeProperties.dark.primaryFontColor
                  }
                />
              </button>
            ) : (
              <></>
            )}
            <p className="title-text">{t("paymentDetails")}</p>
          </div>

          {!hideTaxDeduction && <TaxDeductionOption />}

          {projectDetails.purpose !== "funds" ? (
            <div className={"mt-20"}>
              {!contactDetails.companyname ||
              contactDetails.companyname === "" ? (
                askpublishName ? (
                  <div>
                    <label htmlFor="publishName">{t("askPublishName")}</label>
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
                  <div>
                    <label style={{ textAlign: "center" }}>
                      {t("nameAlreadyPublished")}
                    </label>
                  </div>
                )
              ) : null}
            </div>
          ) : (
            <></>
          )}

          {paymentError && (
            <div
              className={
                "mt-20 d-flex align-items-center callout-danger text-danger"
              }
            >
              <InfoIcon />
              {paymentError}
            </div>
          )}
          {!isCreatingDonation &&
            donationID &&
            paymentSetup &&
            paymentSetup.gateways && (
              <PaymentMethodTabs
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                showCC={
                  paymentSetup?.gateways.stripe.methods.includes("stripe_cc") &&
                  (frequency !== "once"
                    ? paymentSetup?.gateways.stripe.recurrency.enabled.includes(
                        "stripe_cc"
                      )
                    : true)
                }
                showGiroPay={
                  currency === "EUR" &&
                  country === "DE" &&
                  paymentSetup?.gateways.stripe.methods.includes(
                    "stripe_giropay"
                  ) &&
                  (frequency !== "once"
                    ? paymentSetup?.gateways.stripe.recurrency.enabled.includes(
                        "stripe_giropay"
                      )
                    : true)
                }
                showSepa={
                  currency === "EUR" &&
                  isAuthenticated &&
                  paymentSetup?.gateways.stripe.methods.includes(
                    "stripe_sepa"
                  ) &&
                  (frequency !== "once"
                    ? paymentSetup?.gateways.stripe.recurrency.enabled.includes(
                        "stripe_sepa"
                      )
                    : true)
                }
                showSofort={
                  currency === "EUR" &&
                  sofortCountries.includes(country) &&
                  paymentSetup?.gateways.stripe.methods.includes(
                    "stripe_sofort"
                  ) &&
                  (frequency !== "once"
                    ? paymentSetup?.gateways.stripe.recurrency.enabled.includes(
                        "stripe_sofort"
                      )
                    : true)
                }
                showPaypal={
                  paypalCurrencies.includes(currency) &&
                  paymentSetup?.gateways.paypal &&
                  (frequency !== "once"
                    ? false
                    : true)
                }
                showNativePay={
                  paymentSetup?.gateways?.stripe?.account &&
                  currency &&
                  (frequency !== "once"
                    ? paymentSetup?.gateways.stripe.recurrency.enabled.includes(
                        "stripe_cc"
                      )
                    : true)
                }
                onNativePaymentFunction={onPaymentFunction}
              />
            )}

          {!isCreatingDonation && donationID ? (
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
                      quantity * paymentSetup.unitCost
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
                  <NewPaypal
                    paymentSetup={paymentSetup}
                    quantity={quantity}
                    unitCost={paymentSetup.unitCost}
                    currency={currency}
                    donationID={donationID}
                    payDonationFunction={onSubmitPayment}
                    setPaymentError={setPaymentError}
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
          ) : (
            <div className="mt-20">
              <ButtonLoader />
            </div>
          )}
          <br />
          <a
            href="https://a.plant-for-the-planet.org/"
            target="_blank"
            rel="noreferrer"
            className="text-center nolink"
            style={{ fontStyle: "italic" }}
          >
            {t("donationProcessedBy")}
            {/* Needs break */}
          </a>
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
