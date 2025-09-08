import React, { ReactElement, useMemo } from "react";
import { useTranslation } from "next-i18next";
import PaymentMethodTabs from "../PaymentMethods/PaymentMethodTabs";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import BackButtonIcon from "../../../public/assets/icons/BackButtonIcon";
import { apiRequest } from "../../Utils/api";
import PaymentProgress from "../../Common/ContentLoaders/Donations/PaymentProgress";
import { Elements } from "@stripe/react-stripe-js";
import getStripe from "../../Utils/stripe/getStripe";
import getFormattedCurrency from "../../Utils/getFormattedCurrency";
import {
  createDonationFunction,
  payDonationFunction,
} from "../PaymentMethods/PaymentFunctions";
import CardPayments from "../PaymentMethods/CardPayments";
import SepaPayments from "../PaymentMethods/SepaPayments";
import TaxDeductionOption from "../Micros/TaxDeductionOption";
import ButtonLoader from "../../Common/ContentLoaders/ButtonLoader";
import { useAuth0 } from "@auth0/auth0-react";
import NewPaypal from "../PaymentMethods/NewPaypal";
import InfoIcon from "../../../public/assets/icons/InfoIcon";
import themeProperties from "../../../styles/themeProperties";
import { ThemeContext } from "../../../styles/themeContext";
import CheckBox from "../../Common/InputTypes/CheckBox";
import { useRouter } from "next/router";
import { CONTACT, PAYMENT } from "src/Utils/donationStepConstants";
import BankTransfer from "../PaymentMethods/BankTransfer";
import { APIError, PaymentGateway, handleError } from "@planet-sdk/common";
import {
  PaypalApproveData,
  PaypalErrorData,
  ShowPaymentMethodParams,
} from "src/Common/Types";
import { PaymentMethod } from "@stripe/stripe-js/types/api/payment-methods";
import { PaymentRequest } from "@stripe/stripe-js/types/stripe-js/payment-request";
import { Stripe } from "@stripe/stripe-js/types/stripe-js/stripe";

function PaymentsForm(): ReactElement {
  const { t, ready, i18n } = useTranslation("common");

  const router = useRouter();

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);
  const [isCreatingDonation, setisCreatingDonation] = React.useState(false);

  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const {
    paymentSetup,
    country,
    currency,
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
    callbackUrl,
    callbackMethod,
    setErrors,
    utmCampaign,
    utmMedium,
    utmSource,
    isPackageWanted,
    setPaymentRequest,
    isSupportedDonation,
    getDonationBreakdown,
  } = React.useContext(QueryParamContext);

  const [stripePromise, setStripePromise] =
    React.useState<null | Promise<Stripe | null>>(() => null);

  React.useEffect(() => {
    const fetchStripeObject = async () => {
      if (!stripePromise && paymentSetup) {
        const res = () => getStripe(paymentSetup, i18n.language);
        // When we have got the Stripe object, pass it into our useState.
        setStripePromise(res);
      }
    };
    fetchStripeObject();
  }, [paymentSetup]);

  React.useEffect(() => {
    setPaymentType("CARD");
    setPaymentRequest(null);
  }, []);

  const onSubmitPayment = async (
    gateway: PaymentGateway,
    method: string,
    providerObject?:
      | string
      | PaymentMethod
      | PaypalApproveData
      | PaypalErrorData
  ) => {
    if (!paymentSetup || !donationID) {
      console.log("Missing payment options"); //TODOO - better error handling
      return;
    }
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
      contactDetails,
      token,
      country,
      setshowErrorCard,
      router,
      tenant,
      locale: i18n.language,
      setTransferDetails,
    });
  };

  // Seems to work only for native pay. Should this be removed?
  const onPaymentFunction = async (
    paymentMethod: PaymentMethod,
    paymentRequest: PaymentRequest
  ) => {
    setPaymentType(paymentRequest._activeBackingLibraryName); //TODOO --_activeBackingLibraryName is a private variable?
    const gateway = "stripe";
    onSubmitPayment(gateway, "card", paymentMethod);
  };

  async function getDonation() {
    if (!projectDetails || !paymentSetup) return;

    let token = null;
    if (
      (((!isLoading && isAuthenticated) || queryToken) && profile?.address) ||
      projectDetails.purpose === "planet-cash"
    ) {
      token = queryToken ? queryToken : await getAccessTokenSilently();
    }
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
      callbackUrl,
      callbackMethod,
      utmCampaign,
      utmMedium,
      utmSource,
      isPackageWanted,
      tenant,
      locale: i18n.language,
    });
    if (router.query.to) {
      router.replace({
        query: { ...router.query, step: PAYMENT },
      });
    }
    if (router.query.context) {
      router.replace({
        query: { context: donation?.id, step: PAYMENT },
      });
    }
    if (donation) {
      setCanAskPublishPermission(!donation.hasPublicProfile);
      setdonationID(donation.id);
      setshouldCreateDonation(false);
      setisCreatingDonation(false);
      setDonationUid(donation.uid);
    }
  }

  // This feature allows the user to show or hide their names in the leaderboard
  const [isPublishPermitted, setIsPublishPermitted] = React.useState<
    boolean | null
  >(null);
  const [canAskPublishPermission, setCanAskPublishPermission] =
    React.useState(false);

  const publish = async () => {
    try {
      const requestParams = {
        url: `/app/donations/${donationID}/publish`,
        data: { publish: isPublishPermitted },
        method: "PUT" as const,
        setshowErrorCard,
        tenant,
        locale: i18n.language,
      };
      await apiRequest(requestParams);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  React.useEffect(() => {
    if (donationID && isPublishPermitted !== null) {
      publish();
    }
  }, [isPublishPermitted, donationID]);

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

  const showPaymentMethod = ({
    paymentMethod,
    countries,
    currencies,
    authenticatedMethod,
  }: ShowPaymentMethodParams): boolean | undefined => {
    const isAvailableInCountry = countries ? countries.includes(country) : true;
    const isAvailableForCurrency = currencies
      ? currencies.includes(currency)
      : true;
    const isAuthenticatedMethod = authenticatedMethod ? isAuthenticated : true;

    return (
      isAvailableInCountry &&
      isAvailableForCurrency &&
      isAuthenticatedMethod &&
      paymentSetup?.gateways.stripe.methods?.includes(paymentMethod) &&
      (frequency !== "once"
        ? paymentSetup?.recurrency.methods?.includes(paymentMethod)
        : true)
    );
  };

  const displayAmount = useMemo(() => {
    if (!paymentSetup) return 0;

    if (isSupportedDonation) {
      const { totalAmount } = getDonationBreakdown();
      return totalAmount;
    }
    return paymentSetup.unitCost * quantity;
  }, [isSupportedDonation, getDonationBreakdown, paymentSetup, quantity]);

  return ready ? (
    isPaymentProcessing ? (
      <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
    ) : (
      <div className="right-panel-container">
        <div
          className="donations-form"
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div className="d-flex w-100 align-items-center">
            {!isDirectDonation ? (
              <button
                onClick={() => {
                  router.push(
                    {
                      query: { ...router.query, step: CONTACT },
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
                className="d-flex"
                style={{ marginRight: "12px" }}
              >
                <BackButtonIcon
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

          {projectDetails && projectDetails.purpose !== "funds" ? (
            <div className={"mt-20"}>
              {!Object.keys(contactDetails).includes("companyname") ? (
                canAskPublishPermission ? (
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <CheckBox
                      id="publishName"
                      name="checkedB"
                      checked={isPublishPermitted ? true : false}
                      onChange={() => {
                        setIsPublishPermitted(!isPublishPermitted);
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
                    {projectDetails.purpose !== "planet-cash" && (
                      <div /* style={{ textAlign: "center" }} */>
                        {t("nameAlreadyPublished")}
                      </div>
                    )}
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
                showSepa={showPaymentMethod({
                  paymentMethod: "sepa_debit",
                  currencies: ["EUR"],
                  authenticatedMethod:
                    projectDetails && projectDetails.purpose === "funds"
                      ? false
                      : true,
                })}
                showBankTransfer={
                  Object.keys(paymentSetup?.gateways).includes("offline") &&
                  (frequency === "once" ||
                    paymentSetup?.recurrency.methods?.includes("offline"))
                }
                showPaypal={
                  paypalCurrencies.includes(currency) &&
                  paymentSetup?.gateways.paypal &&
                  (frequency !== "once" ? false : true)
                }
                showNativePay={
                  (paymentSetup?.gateways?.stripe?.account && currency
                    ? true
                    : false) &&
                  (frequency !== "once"
                    ? paymentSetup?.recurrency.methods?.includes("card") ||
                      false
                    : true)
                }
                onNativePaymentFunction={onPaymentFunction}
              />
            )}

          {!isCreatingDonation && donationID && paymentSetup ? (
            <div className="mt-30">
              <div
                role="tabpanel"
                hidden={paymentType !== "CARD"}
                id={`payment-methods-tabpanel-${"CARD"}`}
                aria-labelledby={`scrollable-force-tab-${"CARD"}`}
              >
                <Elements stripe={stripePromise}>
                  <CardPayments
                    donorDetails={contactDetails}
                    totalCost={getFormattedCurrency(
                      i18n.language,
                      currency,
                      displayAmount
                    )}
                    onPaymentFunction={(providerObject: PaymentMethod) =>
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
                <Elements stripe={stripePromise}>
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
                    totalAmount={displayAmount}
                    currency={currency}
                    donationID={donationID}
                    payDonationFunction={onSubmitPayment}
                    setPaymentError={setPaymentError}
                  />
                )}
              </div>
              <div
                role="tabpanel"
                hidden={paymentType !== "Bank"}
                id={`payment-methods-tabpanel-${"Bank"}`}
                aria-labelledby={`scrollable-force-tab-${"Bank"}`}
              >
                <BankTransfer onSubmitPayment={onSubmitPayment} />
              </div>
            </div>
          ) : (
            <div className="mt-20">
              <ButtonLoader />
            </div>
          )}
          <br />
          <a
            href="https://www.plant-for-the-planet.org/"
            target="_blank"
            rel="noreferrer"
            className="text-center nolink"
            style={{
              marginTop: "auto",
              alignSelf: "center",
              fontStyle: "italic",
            }}
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
