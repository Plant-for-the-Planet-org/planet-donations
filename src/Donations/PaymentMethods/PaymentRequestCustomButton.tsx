import { useStripe } from "@stripe/react-stripe-js";
import { ReactElement, useContext, useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useTranslation } from "next-i18next";
import getStripe from "../../Utils/stripe/getStripe";
import AppleIcon from "../../../public/assets/icons/donation/ApplePayIcon";
import GooglePayIcon from "../../../public/assets/icons/donation/GooglePayIcon";
import themeProperties from "../../../styles/themeProperties";
import { stripeAllowedCountries } from "../../Utils/countryUtils";
import { QueryParamContext } from "src/Layout/QueryParamContext";
import { PaymentOptions } from "src/Common/Types";
import {
  PaymentRequest,
  PaymentRequestPaymentMethodEvent,
} from "@stripe/stripe-js/types/stripe-js/payment-request";
import { PaymentMethod } from "@stripe/stripe-js/types/api/payment-methods";
import { Stripe } from "@stripe/stripe-js/types/stripe-js/stripe";

interface PaymentButtonProps {
  country: string;
  currency: string;
  amount: number;
  onPaymentFunction: (
    paymentMethod: PaymentMethod,
    paymentRequest: PaymentRequest
  ) => Promise<void>;
  continueNext: () => void;
  isPaymentPage: boolean;
  paymentLabel: string;
  frequency: string | null;
  paymentSetup: PaymentOptions;
}

export const PaymentRequestCustomButton = ({
  country,
  currency,
  amount,
  onPaymentFunction,
  continueNext,
  isPaymentPage,
  paymentLabel,
  frequency,
  paymentSetup,
}: PaymentButtonProps): ReactElement | null => {
  const isApplePayEnabled = process.env.ENABLE_APPLE_PAY === "true" || false;
  const isGooglePayEnabled = process.env.ENABLE_GOOGLE_PAY === "true" || false;
  const { t, ready } = useTranslation(["common"]);
  const { paymentRequest, setPaymentRequest } = useContext(QueryParamContext);

  const stripe = useStripe();
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    setPaymentRequest(null);
  }, []);

  useEffect(() => {
    if (
      stripe &&
      !paymentRequest &&
      stripeAllowedCountries?.includes(country)
    ) {
      const pr = stripe.paymentRequest({
        country: country,
        currency: currency.toLowerCase(),
        total: {
          label: paymentLabel,
          amount: amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, paymentRequest, country, currency, amount]);

  useEffect(() => {
    if (stripe && paymentRequest) {
      setPaymentRequest(null);
      setCanMakePayment(false);
      setPaymentLoading(false);
    }
  }, [country, currency, amount]);

  useEffect(() => {
    let subscribed = true;
    if (paymentRequest) {
      paymentRequest
        .canMakePayment()
        .then((res) => {
          if (res && subscribed) {
            setCanMakePayment(true);
          }
        })
        .catch((err) => console.log(err, "Err"));
    }

    return () => {
      setCanMakePayment(false);
      subscribed = false;
    };
  }, [paymentRequest]);

  useEffect(() => {
    if (paymentRequest && !paymentLoading) {
      setPaymentLoading(true);
      paymentRequest.off("paymentmethod");
      paymentRequest.on(
        "paymentmethod",
        ({ complete, paymentMethod }: PaymentRequestPaymentMethodEvent) => {
          onPaymentFunction(paymentMethod, paymentRequest);
          complete("success");
          setPaymentLoading(false);
        }
      );
    }
    return () => {
      if (paymentRequest && !paymentLoading) {
        paymentRequest.off("paymentmethod", () => {
          setPaymentLoading(false);
        });
      }
    };
  }, [paymentRequest, onPaymentFunction]);

  return ready ? (
    <div
      className="d-flex column"
      style={{
        alignItems: "center",
        marginTop: isPaymentPage ? "0px" : "20px",
      }}
    >
      {stripeAllowedCountries?.includes(country) &&
      canMakePayment &&
      paymentRequest &&
      paymentRequest._canMakePaymentAvailability && //TODOO - is _canMakePaymentAvailability a private variable?
      (frequency !== "once"
        ? paymentSetup?.recurrency?.methods?.includes("card")
        : true) ? (
        paymentRequest._canMakePaymentAvailability.APPLE_PAY &&
        isApplePayEnabled ? ( //TODOO - is _canMakePaymentAvailability a private variable?
          <div className="w-100">
            <button
              onClick={() => paymentRequest.show()}
              className={`${
                isPaymentPage
                  ? "donate-small"
                  : "primary-button dark-pay mb-10 w-100"
              }`}
            >
              {isPaymentPage ? "" : t("donateWith")}{" "}
              <AppleIcon
                textColor={
                  isPaymentPage
                    ? themeProperties.light.primaryFontColor
                    : "#fff"
                }
              />
            </button>
            {!isPaymentPage && (
              <div className="separator-text mb-10">{t("or")}</div>
            )}
          </div>
        ) : paymentRequest._canMakePaymentAvailability.GOOGLE_PAY &&
          isGooglePayEnabled ? ( //TODOO - is _canMakePaymentAvailability a private variable?
          <div className="w-100">
            <button
              onClick={() => {
                paymentRequest.show();
              }}
              className={`${
                isPaymentPage
                  ? "donate-small"
                  : "primary-button dark-pay mb-10 w-100"
              }`}
            >
              {isPaymentPage ? "" : t("donateWith")}{" "}
              <GooglePayIcon
                textColor={
                  isPaymentPage
                    ? themeProperties.light.primaryFontColor
                    : "#fff"
                }
              />
            </button>
            {!isPaymentPage && (
              <div className="separator-text mb-10">{t("or")}</div>
            )}
          </div>
        ) : null
      ) : null}

      {!isPaymentPage && (
        <button
          data-test-id="continue-next"
          onClick={() => continueNext()}
          className="primary-button"
        >
          {t("continue")}
        </button>
      )}
    </div>
  ) : null;
};

/* 9 May 2023 - Apple Pay / Google Pay is disabled currently as it is not working correctly*/

interface NativePayProps {
  country: string;
  currency: string;
  amount: number;
  onPaymentFunction: (
    paymentMethod: PaymentMethod,
    paymentRequest: PaymentRequest
  ) => Promise<void>;
  paymentSetup: PaymentOptions;
  continueNext: () => void;
  isPaymentPage: boolean;
  paymentLabel: string;
  frequency: string | null;
}
export const NativePay = ({
  country,
  currency,
  amount,
  onPaymentFunction,
  paymentSetup,
  continueNext,
  isPaymentPage,
  paymentLabel,
  frequency,
}: NativePayProps): ReactElement => {
  const { i18n } = useTranslation();
  const [stripePromise, setStripePromise] =
    useState<null | Promise<Stripe | null>>(() =>
      getStripe(paymentSetup, i18n.language)
    );

  useEffect(() => {
    const fetchStripeObject = async () => {
      if (!stripePromise && paymentSetup) {
        const res = () => getStripe(paymentSetup, i18n.language);
        // When we have got the Stripe object, pass it into our useState.
        setStripePromise(res);
      }
    };
    fetchStripeObject();
  }, [paymentSetup]);

  if (!stripePromise) {
    return <></>;
  }

  return (
    <Elements
      stripe={stripePromise}
      key={paymentSetup?.gateways?.stripe?.authorization.accountId}
    >
      <PaymentRequestCustomButton
        country={country}
        currency={currency}
        amount={amount}
        onPaymentFunction={onPaymentFunction}
        continueNext={continueNext}
        isPaymentPage={isPaymentPage}
        paymentLabel={paymentLabel}
        frequency={frequency}
        paymentSetup={paymentSetup}
      />
    </Elements>
  );
};
