import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { Dispatch, ReactElement, SetStateAction } from "react";
import { useTranslation } from "next-i18next";
import themeProperties from "../../../styles/themeProperties";
import { ThemeContext } from "../../../styles/themeContext";
import { QueryParamContext } from "src/Layout/QueryParamContext";
import { ContactDetails } from "@planet-sdk/common";
import {
  PaymentMethod,
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElement,
  StripeCardNumberElementChangeEvent,
} from "@stripe/stripe-js";

const FormControlNew = styled(FormControl)({
  width: "100%",
  backgroundColor: "var(--background-color-dark)",
  border: "0px!important",
  borderRadius: "10px",
  fontFamily: themeProperties.fontFamily,
  padding: "14px",
});

const getInputOptions = (placeholder: string, theme: string) => {
  const ObjectM = {
    style: {
      base: {
        color:
          theme === "theme-light"
            ? themeProperties.light.primaryFontColor
            : themeProperties.dark.primaryFontColor,
        fontFamily: themeProperties.fontFamily,
        fontSize: "16px",
        "::placeholder": {
          color:
            theme === "theme-light"
              ? themeProperties.light.primaryFontColor
              : themeProperties.dark.primaryFontColor,
          fontFamily: themeProperties.fontFamily,
          fontSize: "16px",
        },
      },
      invalid: {
        color: themeProperties.light.dangerColor,
        iconColor: themeProperties.light.dangerColor,
      },
    },
    placeholder: placeholder,
  };
  return ObjectM;
};

interface CardPaymentsProps {
  totalCost: string;
  paymentType: string;
  setPaymentType: Dispatch<SetStateAction<string>>;
  onPaymentFunction: (providerObject: PaymentMethod) => Promise<void>;
  donorDetails: ContactDetails;
}

function CardPayments({
  totalCost,
  paymentType,
  setPaymentType,
  onPaymentFunction,
  donorDetails,
}: CardPaymentsProps): ReactElement {
  const { t, ready } = useTranslation("common");
  const stripe = useStripe();
  const elements = useElements();
  const [cardNumber, setCardNumber] = React.useState(false);
  const [cardCvv, setCardCvv] = React.useState(false);
  const [cardDate, setCardDate] = React.useState(false);

  React.useEffect(() => {
    setPaymentType("CARD");
  }, []);
  const { frequency, paymentError, setPaymentError } =
    React.useContext(QueryParamContext);
  // const [paymentError, setPaymentError] = React.useState("");
  const [showContinue, setShowContinue] = React.useState(false);
  // const [showBrand, setShowBrand] = React.useState("");
  React.useEffect(() => {
    if (elements) {
      const cardNumberElement = elements.getElement(CardNumberElement);
      cardNumberElement &&
        cardNumberElement.on("change", ({ error, complete /* , brand */ }) => {
          if (error) {
            setShowContinue(false);
          } else if (complete) {
            // setShowBrand(brand);
            const cardExpiryElement = elements.getElement(CardExpiryElement);
            cardExpiryElement?.on("change", ({ error, complete }) => {
              if (error) {
                setShowContinue(false);
              } else if (complete) {
                const cardCvcElement = elements.getElement(CardCvcElement);
                cardCvcElement?.on("change", ({ error, complete }) => {
                  if (error) {
                    setShowContinue(false);
                  } else if (complete) {
                    setShowContinue(true);
                  }
                });
              }
            });
          }
        });
    }
  }, [CardNumberElement, CardExpiryElement, CardCvcElement]);

  const createPaymentMethodCC = (cardElement: StripeCardNumberElement) => {
    if (donorDetails) {
      return stripe?.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: `${donorDetails.firstname} ${donorDetails.lastname}`,
          email: donorDetails.email,
          address: {
            city: donorDetails.city,
            country: donorDetails.country,
            line1: donorDetails.address,
            postal_code: donorDetails.zipCode,
          },
        },
      });
    } else {
      return;
      //return stripe.createPaymentMethod("card", cardElement); //Check with Shreyas
    }
  };
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    setShowContinue(false);
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    let paymentMethod;

    if (paymentType === "CARD") {
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) return;
      setCardCvv(false);
      setCardDate(false);
      setCardNumber(false);
      cardElement.on("change", ({ error }) => {
        if (error) {
          // setPaymentError(error.message);
          setPaymentError(t("noPaymentMethodError"));
          return;
        }
      });
      const payload = await createPaymentMethodCC(cardElement);
      paymentMethod = payload?.paymentMethod;
      // Add payload error if failed
    }
    if (paymentMethod) {
      onPaymentFunction(paymentMethod);
    } else {
      setPaymentError(t("noPaymentMethodError"));
      return;
    }
  };

  const handleChange = (change: StripeCardNumberElementChangeEvent) => {
    if (change.complete === true) {
      setCardNumber(true);
    } else {
      setCardNumber(false);
    }
  };
  const handleChangeCvv = (change: StripeCardCvcElementChangeEvent) => {
    if (change.complete === true) {
      setCardCvv(true);
    } else {
      setCardCvv(false);
    }
  };
  const handleChangeCardDate = (change: StripeCardExpiryElementChangeEvent) => {
    if (change.complete === true) {
      setCardDate(true);
    } else {
      setCardDate(false);
    }
  };

  const validateCard = () => {
    if (cardNumber && cardCvv && cardDate) {
      setShowContinue(true);
    } else {
      setShowContinue(false);
    }
  };

  React.useEffect(() => {
    validateCard();
  }, [cardDate, cardNumber, cardCvv]);

  const { theme } = React.useContext(ThemeContext);

  return ready ? (
    <div>
      {paymentError && <div className={"paymentError"}>{paymentError}</div>}

      {
        <div id="card-element">
          <FormControlNew variant="outlined">
            <CardNumberElement
              id="cardNumber"
              options={getInputOptions(t("cardNumber"), theme)}
              onChange={handleChange}
            />
          </FormControlNew>
          <div className="d-flex row mt-20">
            <FormControlNew variant="outlined">
              <CardExpiryElement
                id="expiry"
                options={getInputOptions(t("expDate"), theme)}
                onChange={handleChangeCardDate}
              />
            </FormControlNew>
            <div style={{ width: "20px" }}></div>
            <FormControlNew variant="outlined">
              <CardCvcElement
                id="cvc"
                options={getInputOptions("CVV", theme)}
                onChange={handleChangeCvv}
              />
            </FormControlNew>
          </div>
        </div>
      }

      {showContinue ? (
        <button
          onClick={handleSubmit}
          className="primary-button w-100 mt-30"
          id="donateContinueButton"
          data-test-id="test-donateButton"
        >
          {t("donate_button", {
            totalCost: totalCost,
            frequency: frequency === "once" ? "" : t(frequency).toLowerCase(),
          })}
        </button>
      ) : (
        <button
          className="secondary-button w-100 mt-30"
          id="donateContinueButton"
        >
          {t("donate_button", {
            totalCost: totalCost,
            frequency: frequency === "once" ? "" : t(frequency).toLowerCase(),
          })}
        </button>
      )}
    </div>
  ) : (
    <></>
  );
}

export default CardPayments;
