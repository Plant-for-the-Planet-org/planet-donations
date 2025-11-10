import React, { Dispatch, ReactElement, SetStateAction } from "react";
import { useTranslation } from "next-i18next";
import CreditCard from "../../../public/assets/icons/donation/CreditCard";
import PaypalIcon from "../../../public/assets/icons/donation/PaypalIcon";
import SepaIcon from "../../../public/assets/icons/donation/SepaIcon";
import BankIcon from "../../../public/assets/icons/donation/BankIcon";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import { formatAmountForStripe } from "../../Utils/stripe/stripeHelpers";
import { NativePay } from "./PaymentRequestCustomButton";
import getFormattedCurrency from "src/Utils/getFormattedCurrency";
import { PaymentMethod } from "@stripe/stripe-js/types/api/payment-methods";
import { PaymentRequest } from "@stripe/stripe-js/types/stripe-js/payment-request";

function a11yProps(index: string) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `payment-methods-tabpanel-${index}`,
  };
}

interface PaymentMethodTabsProps {
  paymentType: string;
  setPaymentType: Dispatch<SetStateAction<string>>;
  showPaypal?: boolean;
  showSepa?: boolean;
  showCC?: boolean;
  showNativePay?: boolean;
  onNativePaymentFunction: (
    paymentMethod: PaymentMethod,
    paymentRequest: PaymentRequest,
  ) => Promise<void>;
  showBankTransfer?: boolean;
}

export default function PaymentMethodTabs({
  paymentType,
  setPaymentType,
  showPaypal,
  showSepa,
  showCC,
  showNativePay,
  onNativePaymentFunction,
  showBankTransfer,
}: PaymentMethodTabsProps): ReactElement | null {
  const { t, i18n } = useTranslation(["common", "country"]);

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string,
  ) => {
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
    stripePromise,
  } = React.useContext(QueryParamContext);

  let paymentLabel = "";

  if (paymentSetup && currency) {
    switch (projectDetails && projectDetails.purpose) {
      case "trees":
        paymentLabel = t("treesInCountry", {
          treeCount: quantity,
        });
        break;
      case "funds":
        paymentLabel = t("fundingPaymentLabel", {
          amount: getFormattedCurrency(
            i18n.language,
            currency,
            paymentSetup.unitCost * quantity,
          ),
        });
        break;
      case "planet-cash":
        paymentLabel = t("pcashPaymentLabel", {
          amount: getFormattedCurrency(
            i18n.language,
            currency,
            paymentSetup.unitCost * quantity,
          ),
        });
        break;
      case "bouquet":
      case "conservation":
        paymentLabel = t("bouquetPaymentLabel", {
          amount: getFormattedCurrency(
            i18n.language,
            currency,
            paymentSetup.unitCost * quantity,
          ),
        });
        break;
      default:
        paymentLabel = t("treesInCountry", {
          treeCount: quantity,
        });
        break;
    }
  }

  return (
    paymentSetup && (
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
        {showBankTransfer && (
          <button
            className={`${"payment-method"} ${"bank"} ${
              paymentType === "Bank" ? "payment-method-selected" : ""
            }`}
            onClick={(e) => handleChange(e, "Bank")}
            {...a11yProps("Bank")}
          >
            <div
              style={{ display: "flex", alignItems: "center" }}
              data-test-id="bankTransfer"
            >
              <BankIcon />
              <span>&nbsp;{t("bankTransfer")}</span>
            </div>
            <CheckMark />
          </button>
        )}
        {/*9 May 2023 - Apple Pay / Google Pay is disabled currently as it is not working correctly*/}
        {showNativePay && stripePromise !== null && (
          <NativePay
            country={country}
            currency={currency}
            amount={formatAmountForStripe(
              paymentSetup.unitCost * quantity,
              currency.toLowerCase(),
            )}
            onPaymentFunction={onNativePaymentFunction}
            paymentSetup={paymentSetup}
            continueNext={() => {}}
            isPaymentPage
            paymentLabel={paymentLabel}
            frequency={frequency}
            stripePromise={stripePromise}
          />
        )}
      </div>
    )
  );
}
