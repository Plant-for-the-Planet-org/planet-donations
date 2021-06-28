import React from "react";
import CustomIcon from "../../../public/assets/icons/CustomIcon";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import GiftForm from "../Micros/GiftForm";
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
} from "../PaymentMethods/PaymentFunctions";
import PaymentProgress from "../../Common/ContentLoaders/Donations/PaymentProgress";
import { getFormattedNumber } from "../../Utils/getFormattedNumber";
import themeProperties from "../../../styles/themeProperties";
import SelectCurrencyModal from "./../Micros/SelectCurrencyModal";
import TaxDeductionOption from "./../Micros/TaxDeductionOption";
import TreeCostLoader from "../../Common/ContentLoaders/TreeCostLoader";
import Authentication from "./../Micros/Authentication";
import { useAuth0 } from "@auth0/auth0-react";
import { getCountryDataBy } from "../../Utils/countryUtils";

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
    setshowErrorCard,
  } = React.useContext(QueryParamContext);
  const { t, i18n } = useTranslation(["common", "country"]);

  const [minAmt, setMinAmt] = React.useState(0);
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  React.useEffect(() => {
    setMinAmt(getMinimumAmountForCurrency(currency));
  }, [currency]);

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);

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

    let token = null;
    if (!isLoading && isAuthenticated) {
      token = await getAccessTokenSilently();
    }

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
      token,
      setshowErrorCard,
    }).then(async (res) => {
      let token = null;
      if (!isLoading && isAuthenticated) {
        token = await getAccessTokenSilently();
      }
      payDonationFunction({
        gateway: "stripe",
        paymentMethod,
        setIsPaymentProcessing,
        setPaymentError,
        t,
        paymentSetup,
        donationID: res.id,
        setdonationStep,
        token,
        country,
        setshowErrorCard,
      });
    });
  };

  const [customTreeInputValue, setCustomTreeInputValue] = React.useState("");

  const [isCustomDonation, setisCustomDonation] = React.useState(false);

  const setCustomTreeValue = (e: any) => {
    if (e.target) {
      if (e.target.value === "" || e.target.value < 1) {
        // if input is '', default 1
        settreeCount(1);
      } else if (e.target.value.toString().length <= 12) {
        settreeCount(e.target.value);
      }
    }
  };

  React.useEffect(() => {
    if (![10, 20, 50, 150].includes(treeCount)) {
      setisCustomDonation(true);
      setCustomTreeValue(treeCount);
      setCustomTreeInputValue(treeCount);
    }
  }, [treeCount]);

  const [openCurrencyModal, setopenCurrencyModal] = React.useState(false);

  const customInputRef = React.useRef(null);

  return isPaymentProcessing ? (
    <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
  ) : (
    <div className="donations-forms-container">
      <div className="w-100">
        <Authentication />
        <div className="donations-tree-selection-step">
          <p className="title-text">{t("donate")}</p>
          <div className="donations-gift-container mt-10">
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
                    onClick={() => {
                      settreeCount(option.treeCount);
                      setisCustomDonation(false);
                      setCustomTreeInputValue("");
                    }}
                    key={key}
                    className={`tree-selection-option mt-20 ${
                      option.treeCount === treeCount && !isCustomDonation
                        ? "tree-selection-option-selected"
                        : ""
                    }`}
                  >
                    {option.iconFile}
                    <div className="tree-selection-option-text">
                      <p>{option.treeCount}</p>
                      <span>{t("trees")}</span>
                    </div>
                  </div>
                );
              })}

              <div
                className={`tree-selection-option mt-20 custom-selection ${
                  isCustomDonation ? "tree-selection-option-selected" : ""
                }`}
                onClick={() => {
                  setisCustomDonation(true);
                  customInputRef.current.focus();
                }}
              >
                <CustomIcon />
                <div className="tree-selection-option-text">
                  <input
                    className={"custom-tree-input"}
                    onInput={(e) => {
                      // replaces any character other than number to blank
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      //  if length of input more than 12, display only 12 digits
                      if (e.target.value.toString().length >= 12) {
                        e.target.value = e.target.value.toString().slice(0, 12);
                      }
                    }}
                    value={customTreeInputValue}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    onChange={(e) => {
                      setCustomTreeValue(e);
                      setCustomTreeInputValue(e.target.value);
                    }}
                    ref={customInputRef}
                  />
                  <span>{t("trees")}</span>
                </div>
              </div>
            </div>

            {paymentSetup && paymentSetup.treeCost ? (
              <p className="currency-selection mt-30">
                <button
                  onClick={() => {
                    setopenCurrencyModal(true);
                  }}
                  className="text-bold text-primary"
                  style={{ marginRight: "4px" }}
                >
                  {currency}{" "}
                  <DownArrowIcon color={themeProperties.primaryColor} />
                  {getFormatedCurrency(
                    i18n.language,
                    "",
                    Number(paymentSetup.treeCost)
                  )}{" "}
                </button>
                {t("perTree")}
              </p>
            ) : (
              <div className={"mt-20"}>
                <TreeCostLoader width={150} />
              </div>
            )}

            <TaxDeductionOption />

            <div className={"horizontal-line"} />
            {paymentSetup && paymentSetup.treeCost ? (
              <div className={"w-100 text-center text-bold mt-20"}>
                <span className={"text-primary"} style={{ marginRight: "4px" }}>
                  {getFormatedCurrency(
                    i18n.language,
                    currency,
                    paymentSetup.treeCost * treeCount
                  )}
                </span>
                {t("fortreeCountTrees", {
                  count: Number(treeCount),
                  treeCount: getFormattedNumber(
                    i18n.language,
                    Number(treeCount)
                  ),
                })}
              </div>
            ) : (
              <div className={"text-center mt-20"}>
                <TreeCostLoader width={150} />
              </div>
            )}

            {paymentSetup && projectDetails ? (
              minAmt && paymentSetup?.treeCost * treeCount >= minAmt ? (
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
                    isPaymentPage={false}
                    paymentLabel={t("treesInCountry", {
                      treeCount: treeCount,
                      country: t(
                        `country:${projectDetails.country.toLowerCase()}`
                      ),
                    })}
                  />
                ) : (
                  <div className="mt-20 w-100">
                    <ButtonLoader />
                  </div>
                )
              ) : (
                <p className={"text-danger mt-20 text-center"}>
                  {t("minDonate")}{" "}
                  <span>
                    {getFormatedCurrency(i18n.language, currency, minAmt)}
                  </span>
                </p>
              )
            ) : (
              <div className="mt-20 w-100">
                <ButtonLoader />
              </div>
            )}
          </div>
        </div>
      </div>

      <SelectCurrencyModal
        openModal={openCurrencyModal}
        handleModalClose={() => setopenCurrencyModal(false)}
      />
    </div>
  );
}

export default DonationsForm;
