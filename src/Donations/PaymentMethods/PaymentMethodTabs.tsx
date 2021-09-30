import React from "react";
import { useTranslation } from "next-i18next";
import CreditCard from "../../../public/assets/icons/donation/CreditCard";
import GiroPayIcon from "../../../public/assets/icons/donation/GiroPay";
import PaypalIcon from "../../../public/assets/icons/donation/PaypalIcon";
import SepaIcon from "../../../public/assets/icons/donation/SepaIcon";
import SofortIcon from "../../../public/assets/icons/donation/SofortIcon";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import { formatAmountForStripe } from "../../Utils/stripe/stripeHelpers";
import { NativePay } from "./PaymentRequestCustomButton";
import getFormatedCurrency from "src/Utils/getFormattedCurrency";

function a11yProps(index: any) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `payment-methods-tabpanel-${index}`,
  };
}

export default function PaymentMethodTabs({
  paymentType,
  setPaymentType,
  showPaypal,
  showGiroPay,
  showSepa,
  showSofort,
  showCC,
  showNativePay,
  onNativePaymentFunction,
}: any) {
  const { t, i18n } = useTranslation(["common", "country"]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setPaymentType(newValue);
  };

  function CheckMark() {
    return (
      <div className={"check-mark"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 30 30"
        >
          <g data-name="Group 3308">
            <path
              fill="#48aadd"
              d="M54 408a15 15 0 11-15 15 15 15 0 0115-15z"
              data-name="Path 2171"
              transform="translate(-39 -408)"
            ></path>
            <path
              fill="#fff"
              d="M51.1 428.948l-5.878-5.392a.782.782 0 010-1.173l1.279-1.173a.963.963 0 011.279 0l3.96 3.633 8.481-7.781a.963.963 0 011.279 0l1.279 1.173a.782.782 0 010 1.173l-10.4 9.541a.963.963 0 01-1.279 0z"
              transform="translate(-39 -408)"
            ></path>
          </g>
        </svg>
      </div>
    );
  }

  const {
    country,
    currency,
    projectDetails,
    paymentSetup,
    quantity,
    frequency,
    amount
  } = React.useContext(QueryParamContext);

  let paymentLabel;

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
              amount
            ),
        });
        break;
      case "bouquet":
        paymentLabel = t("bouquetPaymentLabel", {
          amount: getFormatedCurrency(
              i18n.language,
              currency,
              amount
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

  return (
    <div className={"payment-methods-tabs-container"}>
      {showCC && (
        <button
          className={`${"payment-method"} ${
            paymentType === "CARD" ? "payment-method-selected" : ""
          }`}
          onClick={(e) => handleChange(e, "CARD")}
          {...a11yProps("CARD")}
        >
          <CreditCard />
          <CheckMark />
        </button>
      )}

      {showSofort && (
        <button
          className={`${"payment-method"} ${
            paymentType === "Sofort" ? "payment-method-selected" : ""
          }`}
          onClick={(e) => handleChange(e, "Sofort")}
          {...a11yProps("Sofort")}
          data-test-id="sofortPayment"
        >
          <SofortIcon />
          <CheckMark />
        </button>
      )}

      {showPaypal ? (
        <button
          className={`${"payment-method"} ${
            paymentType === "Paypal" ? "payment-method-selected" : ""
          }`}
          onClick={(e) => handleChange(e, "Paypal")}
          {...a11yProps("Paypal")}
        >
          <PaypalIcon />
          <CheckMark />
        </button>
      ) : null}

      {showGiroPay && (
        <button
          className={`${"payment-method"} ${
            paymentType === "GiroPay" ? "payment-method-selected" : ""
          }`}
          onClick={(e) => handleChange(e, "GiroPay")}
          {...a11yProps("GiroPay")}
        >
          <GiroPayIcon />
          <CheckMark />
        </button>
      )}

      {showSepa && (
        <button
          className={`${"payment-method"} ${
            paymentType === "SEPA" ? "payment-method-selected" : ""
          }`}
          onClick={(e) => handleChange(e, "SEPA")}
          {...a11yProps("SEPA")}
        >
          <SepaIcon />
          <CheckMark />
        </button>
      )}

      {showNativePay && (
        <NativePay
          country={country}
          currency={currency}
          amount={formatAmountForStripe(
            amount,
            currency.toLowerCase()
          )}
          onPaymentFunction={onNativePaymentFunction}
          paymentSetup={paymentSetup}
          continueNext={() => {}}
          isPaymentPage
          paymentLabel={paymentLabel}
          frequency={frequency}
        />
      )}
    </div>
  );
}
