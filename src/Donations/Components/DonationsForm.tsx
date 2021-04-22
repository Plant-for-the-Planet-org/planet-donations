import React, { ReactElement } from "react";
import CustomIcon from "../../../public/assets/icons/CustomIcon";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import GiftForm from "./GiftForm";
import { useTranslation } from "next-i18next";
import getFormatedCurrency from "../../Utils/getFormattedCurrency";
import DownArrowIcon from "../../../public/assets/icons/DownArrowIcon";
import { getMinimumAmountForCurrency } from "../../Utils/getExchange";
import { formatAmountForStripe } from "../../Utils/stripe/stripeHelpers";
import { NativePay } from "../PaymentMethods/PaymentRequestCustomButton";
import ButtonLoader from "../../Common/ContentLoaders/ButtonLoader";
import {
  createDonationFunction,
  payDonationFunction,
} from "../PaymentFunctions";
import PaymentProgress from "../../Common/ContentLoaders/Donations/PaymentProgress";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {}

function DonationsForm() {
  const {
    isGift,
    treeSelectionOptions,
    setdonationStep,
    treeCount,
    settreeCount,
    currency,
    paymentSetup,
    projectDetails,
    country,
    giftDetails,
    setIsTaxDeductible,
    isPaymentOptionsLoading,
    setPaymentType,
    setdonationID,
    isTaxDeductible,
  } = React.useContext(QueryParamContext);
  const { t, i18n } = useTranslation(["common", "country"]);

  const [minAmt, setMinAmt] = React.useState(0);

  React.useEffect(() => {
    setMinAmt(getMinimumAmountForCurrency(currency));
  }, []);

  React.useEffect(() => {
    if (
      projectDetails &&
      projectDetails.taxDeductionCountries &&
      projectDetails.taxDeductionCountries.includes(country)
    ) {
      setIsTaxDeductible(true);
    } else {
      setIsTaxDeductible(false);
    }
  }, [country]);

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);

  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithPopup,
    logout,
  } = useAuth0();

  const [paymentError, setPaymentError] = React.useState("");

  const onPaymentFunction = async (paymentMethod: any, paymentRequest: any) => {
    // eslint-disable-next-line no-underscore-dangle
    setPaymentType(paymentRequest._activeBackingLibraryName);

    let fullName = paymentMethod.billing_details.name;
    fullName = String(fullName).split(" ");
    const firstName = fullName[0];
    fullName.shift();
    const lastName = String(fullName).replace(/,/g, " ");

    const contactDetails = {
      firstname: firstName,
      lastname: lastName,
      email: paymentMethod.billing_details.email,
      address: paymentMethod.billing_details.address.line1,
      zipCode: paymentMethod.billing_details.address.postal_code,
      city: paymentMethod.billing_details.address.city,
      country: paymentMethod.billing_details.address.country,
    };

    await createDonationFunction({
      isTaxDeductible,
      country,
      projectDetails,
      treeCost: paymentSetup.treeCost,
      treeCount,
      currency,
      contactDetails,
      isGift,
      giftDetails,
      setIsPaymentProcessing,
      setPaymentError,
      setdonationID,
    }).then((res) => {
      payDonationFunction({
        gateway: "stripe",
        paymentMethod,
        setIsPaymentProcessing,
        setPaymentError,
        t,
        paymentSetup,
        donationID: res.id,
        setdonationStep,
      });
    });
  };

  return isPaymentProcessing ? (
    <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
  ) : (
    <div className="donations-forms-container">
      <div className="donations-form">
        {!isLoading && !isAuthenticated && (
          <button
            className="login-continue"
            onClick={() => loginWithPopup()}
          >
            Login & Continue
          </button>
        )}

        <div className="donations-tree-selection-step">
          <p className="title-text">Donate</p>
          <div className="donations-gift-container">
            <GiftForm />
          </div>
          <div
            className={`donations-tree-selection ${
              isGift && giftDetails.recipientName === "" ? "display-none" : ""
            }`}
          >
            <div className="tree-selection-options-container">
              {treeSelectionOptions.map((option, key) => {
                return (
                  <div
                    onClick={() => settreeCount(option.treeCount)}
                    key={key}
                    className={`tree-selection-option mt-20 ${
                      option.treeCount === treeCount
                        ? "tree-selection-option-selected"
                        : ""
                    }`}
                  >
                    {option.iconFile}
                    <div className="tree-selection-option-text">
                      <p>{option.treeCount}</p>
                      <span>trees</span>
                    </div>
                  </div>
                );
              })}

              <div
                className="tree-selection-option mt-20"
                style={{ flexGrow: 1, marginLeft: "30px" }}
              >
                <CustomIcon />
                <div className="tree-selection-option-text">
                  <p style={{ letterSpacing: "-2px" }}>_________________</p>
                  <span>Custom trees</span>
                </div>
              </div>
            </div>
            <p className="currency-selection mt-20 mb-20">
              <button>
                {currency}{" "}
                {getFormatedCurrency(
                  i18n.language,
                  "",
                  Number(paymentSetup.treeCost)
                )}{" "}
                <DownArrowIcon />
              </button>
              {t("perTree")}
            </p>

            {projectDetails &&
            projectDetails.taxDeductionCountries &&
            projectDetails.taxDeductionCountries.length > 0 ? (
              <div className={"mt-20 d-inline"}>
                {projectDetails.taxDeductionCountries.includes(country)
                  ? t("youWillReceiveTaxDeduction")
                  : t("taxDeductionNotYetAvailable")}
                <button className={"tax-country-selection"}>
                  {t(`country:${country.toLowerCase()}`)}
                  <DownArrowIcon />
                </button>

                <div>
                  {projectDetails &&
                  projectDetails.taxDeductionCountries.includes(country)
                    ? t("inTimeOfTaxReturns")
                    : null}
                </div>
              </div>
            ) : (
              <div className={"isTaxDeductible"}>
                {t("taxDeductionNotAvailableForProject")}
              </div>
            )}

            {paymentSetup?.gateways?.stripe?.isLive === false ? (
              <div className={"text-danger mt-20"}>
                Test Mode: Your donations will not be charged
              </div>
            ) : null}

            {projectDetails.treeCost * treeCount >= minAmt ? (
              !isPaymentOptionsLoading &&
              paymentSetup?.gateways?.stripe?.account &&
              currency ? (
                <NativePay
                  country={country}
                  currency={currency}
                  amount={formatAmountForStripe(
                    projectDetails.treeCost * treeCount,
                    currency.toLowerCase()
                  )}
                  onPaymentFunction={onPaymentFunction}
                  paymentSetup={paymentSetup}
                  continueNext={() => setdonationStep(2)}
                />
              ) : (
                <ButtonLoader />
              )
            ) : (
              <p className={"text-danger mt-20"}>
                {t("minDonate")}
                <span>
                  {getFormatedCurrency(i18n.language, currency, minAmt)}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationsForm;
