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
import CheckBox from "../../Common/InputTypes/CheckBox";
import { useRouter } from "next/router";
import { CONTACT, THANK_YOU } from "src/Utils/donationStepConstants";
import BankTransfer from "../PaymentMethods/BankTransfer";

interface Props {}

function PaymentsForm({}: Props): ReactElement {
  const { t, ready, i18n } = useTranslation("common", "donate");

  const router = useRouter();

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);
  const [isCreatingDonation, setisCreatingDonation] = React.useState(false);
  const [paypalPlan, setPaypalPlan] = React.useState("");
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
    profile,
    frequency,
    tenant,
    paymentError,
    setPaymentError,
    amount,
    setTransferDetails,
  } = React.useContext(QueryParamContext);

  React.useEffect(() => {
    setPaymentType("CARD");
  }, []);

  const sofortCountries = ["AT", "BE", "DE", "IT", "NL", "ES"];

  const onSubmitPayment = async (
    gateway: string,
    method: string,
    providerObject?: any
  ) => {
    let token = null;
    if ((!isLoading && isAuthenticated) || queryToken) {
      token = queryToken ? queryToken : await getAccessTokenSilently();
    }
    payDonationFunction({
      gateway,
      method,
      providerObject,
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
      router,
      tenant,
      setTransferDetails,
    });
  };

  const onPaymentFunction = async (paymentMethod: any, paymentRequest: any) => {
    setPaymentType(paymentRequest._activeBackingLibraryName);
    const gateway = "stripe";
    onSubmitPayment(gateway, "card", paymentMethod);
  };

  const createPaypalPlan = async (donationID: string) => {
    const paypalAccount = paymentSetup.gateways.paypal.account;
    const requestParams = {
      url: `/app/paypalPlan/${donationID}/${paypalAccount}`,
      data: {},
      method: "POST",
      setshowErrorCard,
    };
    const paypalPlan = await apiRequest(requestParams);
    setPaypalPlan(paypalPlan.data.planId);
  };

  async function getDonation() {
    let token = null;
    if (((!isLoading && isAuthenticated) || queryToken) && profile?.address) {
      token = queryToken ? queryToken : await getAccessTokenSilently();
    }
    setisDonationLoading(true);
    const donation = await createDonationFunction({
      isTaxDeductible,
      country,
      projectDetails,
      // unitCost: paymentSetup.unitCost,
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
      amount,
      paymentSetup,
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
    return donation.id;
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
      getDonation().then((donationID) => {
        if (frequency !== "once" && paymentSetup?.gateways.paypal?.methods) {
          createPaypalPlan(donationID);
        }
      });
    }
  }, [shouldCreateDonation]);

  React.useEffect(() => {
    setPaymentType("CARD");
  }, [currency]);
  const { theme } = React.useContext(ThemeContext);

  const showPaymentMethod = ({
    paymentMethod,
    countries,
    currencies,
    authenticatedMethod,
  }: any) => {
    const isAvailableInCountry = countries ? countries.includes(country) : true;
    const isAvailableForCurrency = currencies
      ? currencies.includes(currency)
      : true;
    const isAuthenticatedMethod = authenticatedMethod ? isAuthenticated : true;

    return (
      isAvailableInCountry &&
      isAvailableForCurrency &&
      isAuthenticatedMethod &&
      paymentSetup?.gateways.stripe?.methods.includes(paymentMethod) &&
      (frequency !== "once"
        ? paymentSetup?.recurrency.methods.includes(paymentMethod)
        : true)
    );
  };

  return ready ? (
    isPaymentProcessing ? (
      <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
    ) : (
      <div className={"donations-forms-container"}>
        <div className="donations-form">
          <div className="d-flex w-100 align-items-center">
            {!isDirectDonation ? (
              <button
                onClick={() => {
                  setdonationStep(2);
                  router.push({
                    query: { ...router.query, step: CONTACT },
                  });
                }}
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

          {/* TODO - When donations are coming from context, check for haspublicprofile */}
          {projectDetails.purpose !== "funds" ? (
            <div className={"mt-20"}>
              {!Object.keys(contactDetails).includes("companyName") ? (
                askpublishName ? (
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <CheckBox
                      id="publishName"
                      name="checkedB"
                      checked={publishName}
                      onChange={() => {
                        setpublishName(!publishName);
                      }}
                      inputProps={{ "aria-label": "primary checkbox" }}
                      color={"primary"}
                    />
                    <label htmlFor="publishName" style={{ paddingLeft: "9px" }}>
                      {t("askPublishName")}
                    </label>
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
                showCC={showPaymentMethod({ paymentMethod: "card" })}
                showGiroPay={showPaymentMethod({
                  paymentMethod: "giropay",
                  countries: ["DE"],
                  currencies: ["EUR"],
                })}
                showSepa={showPaymentMethod({
                  paymentMethod: "sepa_debit",
                  currencies: ["EUR"],
                  authenticatedMethod:
                    projectDetails.purpose === "funds" ? false : true,
                })}
                showSofort={showPaymentMethod({
                  paymentMethod: "sofort",
                  currencies: ["EUR"],
                  countries: sofortCountries,
                })}
                showBankTransfer={
                  Object.keys(paymentSetup?.gateways).includes("offline") &&
                  frequency === "once"
                }
                showPaypal={
                  paypalCurrencies.includes(currency) &&
                  paymentSetup?.gateways.paypal
                  //  &&
                  // (frequency !== "once" ? false : true)
                }
                showNativePay={
                  paymentSetup?.gateways?.stripe?.account &&
                  currency &&
                  (frequency !== "once"
                    ? paymentSetup?.recurrency.methods.includes("card")
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
                    donorDetails={contactDetails}
                    totalCost={getFormatedCurrency(
                      i18n.language,
                      currency,
                      paymentSetup.unitBased
                        ? quantity * paymentSetup.unitCost
                        : quantity
                    )}
                    onPaymentFunction={(providerObject: any) =>
                      onSubmitPayment("stripe", "card", providerObject)
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
                    paypalPlan={paypalPlan}
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

              <div
                role="tabpanel"
                hidden={paymentType !== "Bank"}
                id={`payment-methods-tabpanel-${"Bank"}`}
                aria-labelledby={`scrollable-force-tab-${"Bank"}`}
              >
                {/* <Elements stripe={getStripe(paymentSetup)}> */}
                <BankTransfer onSubmitPayment={onSubmitPayment} />
                {/* </Elements> */}
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
