import { useStripe } from "@stripe/react-stripe-js";
import { useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useTranslation } from "next-i18next";
import getStripe from "../../Utils/stripe/getStripe";
import AppleIcon from "../../../public/assets/icons/donation/ApplePayIcon";
import GooglePayIcon from "../../../public/assets/icons/donation/GooglePayIcon";
import BrowserPayIcon from "../../../public/assets/icons/donation/BrowserPayIcon";
import themeProperties from "../../../styles/themeProperties";
import { stripeAllowedCountries } from "../../Utils/countryUtils";

interface PaymentButtonProps {
  country: string;
  currency: String;
  amount: number;
  onPaymentFunction: Function;
  continueNext: Function;
  isPaymentPage: boolean;
  paymentLabel:string;
}
export const PaymentRequestCustomButton = ({
  country,
  currency,
  amount,
  onPaymentFunction,
  continueNext,
  isPaymentPage,
  paymentLabel
}: PaymentButtonProps) => {
  const { t, ready } = useTranslation(["common"]);

  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (stripe && !paymentRequest && stripeAllowedCountries.includes(country)) {
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
      setPaymentRequest(pr);
    }
  }, [stripe, paymentRequest]);

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
      paymentRequest.canMakePayment().then((res: any) => {
        if (res && subscribed) {
          setCanMakePayment(true);
        }
      });
    }

    return () => {
      setCanMakePayment(false);
      subscribed = false;
    };
  }, [paymentRequest]);

  useEffect(() => {
    if (paymentRequest && !paymentLoading) {
      setPaymentLoading(true);
      paymentRequest.on(
        "paymentmethod",
        ({ complete, paymentMethod, ...data }: any) => {
          onPaymentFunction(paymentMethod, paymentRequest);
          complete("success");
          setPaymentLoading(false);
        }
      );
    }
    return () => {
      if (paymentRequest && !paymentLoading) {
        paymentRequest.off(
          "paymentmethod",
          ({ complete, paymentMethod, ...data }: any) => {
            onPaymentFunction(paymentMethod, paymentRequest);
            complete("success");
            setPaymentLoading(false);
          }
        );
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
      {stripeAllowedCountries.includes(country) &&
      canMakePayment &&
      paymentRequest &&
      paymentRequest._canMakePaymentAvailability ? (
        paymentRequest._canMakePaymentAvailability.APPLE_PAY ? (
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
              <AppleIcon textColor={isPaymentPage ? themeProperties.light.primaryFontColor : '#fff'} />
            </button>
            {!isPaymentPage && (
              <div className="separator-text mb-10">{t("or")}</div>
            )}
          </div>
        ) : paymentRequest._canMakePaymentAvailability.GOOGLE_PAY ? (
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
              <GooglePayIcon
                textColor={isPaymentPage ? themeProperties.light.primaryFontColor : '#fff'}
              />
            </button>
            {!isPaymentPage && (
              <div className="separator-text mb-10">{t("or")}</div>
            )}
          </div>
        ) : (
          <div className="w-100">
            <button
              onClick={() => paymentRequest.show()}
              className={`donate-now ${
                isPaymentPage ? "donate-small" : "primary-button mb-10 w-100"
              }`}
              style={{ border: "none" }}
            >
              {isPaymentPage ? "" : t("donateNow")} <BrowserPayIcon />
            </button>
            {!isPaymentPage && (
              <div className="separator-text mb-10">{t("or")}</div>
            )}
          </div>
        )
      ) : null}

      {!isPaymentPage && (
        <button onClick={() => continueNext()} className="primary-button">
          {canMakePayment ? t("payPalCard") : t("continue")}
        </button>
      )}
    </div>
  ) : null;
};

interface NativePayProps {
  country: string;
  currency: String;
  amount: number;
  onPaymentFunction: Function;
  paymentSetup: Object;
  continueNext: Function;
  isPaymentPage: boolean;
  paymentLabel: string;
}
export const NativePay = ({
  country,
  currency,
  amount,
  onPaymentFunction,
  paymentSetup,
  continueNext,
  isPaymentPage,
  paymentLabel
}: NativePayProps) => {
  const [stripePromise, setStripePromise] = useState(() =>
    getStripe(paymentSetup)
  );

  useEffect(() => {
    const fetchStripeObject = async () => {
      if (paymentSetup) {
        const res = () => getStripe(paymentSetup);
        // When we have got the Stripe object, pass it into our useState.
        setStripePromise(res);
      }
    };
    setStripePromise(null);
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
      />
    </Elements>
  );
};
