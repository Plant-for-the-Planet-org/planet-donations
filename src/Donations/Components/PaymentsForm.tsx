import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import PaymentMethodTabs from "./PaymentMethodTabs";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import BackButton from "../../../public/assets/icons/BackButton";

interface Props {}

function PaymentsForm({}: Props): ReactElement {
  const { t } = useTranslation("common");

  const { paymentSetup, country, currency, setdonationStep } = React.useContext(
    QueryParamContext
  );
  const [paymentType, setPaymentType] = React.useState("CARD");
  const sofortCountries = ["AT", "BE", "DE", "IT", "NL", "ES"];

  return (
    <div className={"donations-forms-container"}>
      <div className="donations-form">
        <button onClick={() => setdonationStep(2)} className="mb-10">
          <BackButton />
        </button>
        <p className="title-text">{t("paymentDetails")}</p>

        {paymentSetup && paymentSetup.gateways && (
          <PaymentMethodTabs
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            showCC={paymentSetup?.gateways.stripe.methods.includes("stripe_cc")}
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
      </div>
    </div>
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
