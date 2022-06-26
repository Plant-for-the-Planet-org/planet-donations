import { FormControl } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { IbanElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import InfoIcon from "../../../public/assets/icons/InfoIcon";
import themeProperties from "../../../styles/themeProperties";
import { ThemeContext } from "../../../styles/themeContext";
import { ContactDetails } from "../../../src/Donations/PaymentMethods/Interfaces";

interface SepaPayments {
  paymentType: string;
  onPaymentFunction: (...args: unknown[]) => unknown;
  contactDetails: ContactDetails;
}

const FormControlNew = withStyles({
  root: {
    width: "100%",
    backgroundColor: "var(--background-color-dark)",
    border: "0px!important",
    borderRadius: "10px",
    fontFamily: themeProperties.fontFamily,
    padding: "14px",
  },
})(FormControl);

function SepaPayments({
  paymentType,
  onPaymentFunction,
  contactDetails,
}: SepaPayments): ReactElement {
  const { t, ready } = useTranslation("common");
  const stripe = useStripe();
  const elements = useElements();

  const [paymentError, setPaymentError] = React.useState("");
  const [showContinue, setShowContinue] = React.useState(false);

  const { theme } = React.useContext(ThemeContext);
  const SEPA_OPTIONS = {
    supportedCountries: ["SEPA"],
    style: {
      base: {
        fontSize: "14px",
        color:
          theme === "theme-light"
            ? themeProperties.light.primaryFontColor
            : themeProperties.dark.primaryFontColor,
        fontFamily: themeProperties.fontFamily,
        "::placeholder": {
          color:
            theme === "theme-light"
              ? themeProperties.light.primaryFontColor
              : themeProperties.dark.primaryFontColor,
          fontFamily: themeProperties.fontFamily,
        },
      },
      invalid: {
        color: themeProperties.light.dangerColor,
      },
    },
  };

  const validateChange = () => {
    const sepaElement = elements.getElement(IbanElement)!;
    sepaElement.on("change", ({ error }) => {
      if (error) {
        setShowContinue(false);
      } else {
        setShowContinue(true);
      }
    });
  };

  const createPaymentMethodSepa = (
    sepaElement: any,
    contactDetails: ContactDetails
  ) => {
    console.log(sepaElement);
    return stripe?.createPaymentMethod({
      type: "sepa_debit",
      sepa_debit: sepaElement,
      billing_details: {
        name: contactDetails.firstname,
        email: contactDetails.email,
      },
    });
  };
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    setShowContinue(false);
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    let paymentMethod: any;

    if (paymentType === "SEPA") {
      const sepaElement = elements.getElement(IbanElement)!;
      const payload = await createPaymentMethodSepa(
        sepaElement,
        contactDetails
      );
      paymentMethod = payload.paymentMethod;
      // Add payload error if failed
    }
    if (paymentMethod) {
      onPaymentFunction("stripe", "sepa_debit", paymentMethod);
    } else {
      setPaymentError(t("noPaymentMethodError"));
      return;
    }
  };

  return ready ? (
    <div>
      {paymentError && <div className={paymentError}>{paymentError}</div>}

      <div className={"disclaimer-container"}>
        <InfoIcon />
        <p>{t("sepaDisclaimer")}</p>
      </div>
      <div className="mt-20">
        <FormControlNew variant="outlined">
          <IbanElement
            id="iban"
            options={SEPA_OPTIONS}
            onChange={validateChange}
          />
        </FormControlNew>
      </div>

      {showContinue ? (
        <button
          onClick={handleSubmit}
          className="primary-button w-100 mt-30"
          id="donateContinueButton"
        >
          {t("donate")}
        </button>
      ) : (
        <button
          className="secondary-button w-100 mt-30"
          id="donateContinueButton"
        >
          {t("donate")}
        </button>
      )}

      <div className={"mandate-acceptance"}>{t("sepaMessage")}</div>
    </div>
  ) : (
    <></>
  );
}

export default SepaPayments;
