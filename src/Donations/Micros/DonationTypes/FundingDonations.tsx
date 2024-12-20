import React, {
  ChangeEvent,
  Dispatch,
  ReactElement,
  SetStateAction,
} from "react";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";
import getFormattedCurrency, {
  getFormattedCurrencySymbol,
} from "../../../Utils/getFormattedCurrency";
import DownArrowIcon from "../../../../public/assets/icons/DownArrowIcon";
import TreeCostLoader from "../../../Common/ContentLoaders/TreeCostLoader";
import { useRouter } from "next/router";
import { approximatelyEqual } from "src/Utils/common";

interface Props {
  setopenCurrencyModal: Dispatch<SetStateAction<boolean>>;
}

function FundingDonations({ setopenCurrencyModal }: Props): ReactElement {
  const { t, i18n } = useTranslation(["common", "country"]);

  const [customInputValue, setCustomInputValue] = React.useState("");

  const [isCustomDonation, setisCustomDonation] = React.useState(false);

  const {
    paymentSetup,
    currency,
    quantity,
    setquantity,
    isGift,
    giftDetails,
    frequency,
    retainQuantityValue,
    isPlanetCashActive,
    projectDetails,
  } = React.useContext(QueryParamContext);

  const router = useRouter();

  const setCustomValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (paymentSetup && e.target) {
      if (e.target.value === "" || Number(e.target.value) < 1) {
        // if input is '', default 1
        setquantity(1 / paymentSetup.unitCost);
      } else if (e.target.value.toString().length <= 12) {
        setquantity(Number(e.target.value) / paymentSetup.unitCost);
      }
    }
  };

  React.useEffect(() => {
    if (
      paymentSetup &&
      paymentSetup.frequencies &&
      paymentSetup.frequencies[`${frequency}`]
    ) {
      // Set all quantities in the allOptionsArray
      const newallOptionsArray = [];
      for (const option of paymentSetup.frequencies[`${frequency}`].options) {
        newallOptionsArray.push((option.quantity || 0) * paymentSetup.unitCost);
      }
      const defaultPaymentOption = paymentSetup.frequencies[
        `${frequency}`
      ].options.filter((option) => option.isDefault === true);

      let newQuantity = retainQuantityValue
        ? quantity * paymentSetup.unitCost
        : router.query.units
        ? Number(router.query.units)
        : defaultPaymentOption.length > 0
        ? (defaultPaymentOption[0].quantity || 0) * paymentSetup.unitCost
        : paymentSetup.frequencies[`${frequency}`].options[1] &&
          (paymentSetup.frequencies[`${frequency}`].options[1].quantity || 0) *
            paymentSetup.unitCost;
      newQuantity = newQuantity / paymentSetup.unitCost;
      setquantity(newQuantity);
      if (
        newQuantity &&
        newallOptionsArray.filter((option) =>
          approximatelyEqual(option, newQuantity * paymentSetup.unitCost)
        ).length == 0
      ) {
        setCustomInputValue((newQuantity * paymentSetup.unitCost).toString());
        setisCustomDonation(true);
      } else if (newQuantity == 0) {
        setisCustomDonation(true);
      } else {
        setCustomInputValue("");
        setisCustomDonation(false);
      }
    }
  }, [paymentSetup, frequency]);
  React.useEffect(() => {
    if (isCustomDonation) {
      customInputRef?.current?.focus();
    }
  }, [isCustomDonation]);

  const customInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div
      className={`funding-selection ${
        isGift && giftDetails.recipientName === "" ? "display-none" : ""
      }`}
    >
      <div className="funding-selection-options-container">
        {paymentSetup &&
          paymentSetup.frequencies &&
          paymentSetup.frequencies[`${frequency}`] &&
          paymentSetup.frequencies[`${frequency}`].options.map(
            (option, index) => {
              return option.quantity ? (
                <div
                  key={index}
                  onClick={() => {
                    setquantity(option.quantity as number);
                    setisCustomDonation(false);
                    setCustomInputValue("");
                  }}
                  className={`funding-selection-option ${
                    approximatelyEqual(option.quantity, quantity) &&
                    !isCustomDonation
                      ? "funding-selection-option-selected"
                      : ""
                  }${
                    Object.keys(paymentSetup.frequencies).length < 3
                      ? "   monthly-option"
                      : ""
                  }`}
                >
                  {option.caption ? (
                    <div className="funding-selection-option-text">
                      <p>{option.caption}</p>
                    </div>
                  ) : (
                    []
                  )}
                  {paymentSetup.frequencies[`${frequency}`].options[index].icon
                    ? // <img
                      //   className="funding-icon"
                      //   src={
                      //     getPaymentOptionIcons(
                      //     paymentSetup.options[index].icon
                      //   )
                      // }
                      // />
                      getPaymentOptionIcons(
                        paymentSetup.frequencies[`${frequency}`].options[index]
                          .icon as string
                      )
                    : []}
                  <div
                    className={`funding-selection-option-text ${
                      option.caption ? "mt-10" : "m-10"
                    }`}
                  >
                    <span
                      style={{
                        fontSize: option.caption ? "14px" : "18px",
                      }}
                    >
                      {getFormattedCurrency(
                        i18n.language,
                        currency,
                        option.quantity * paymentSetup.unitCost
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className={`funding-selection-option custom ${
                    isCustomDonation ? "funding-selection-option-selected" : ""
                  }${
                    Object.keys(paymentSetup.frequencies).length < 3
                      ? "   full-width"
                      : " flex-50"
                  }`}
                  onClick={() => {
                    setisCustomDonation(true);
                    customInputRef?.current?.focus();
                  }}
                >
                  {isCustomDonation ? (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <p
                        style={{
                          fontSize: "18px",
                          marginTop: "3px",
                        }}
                      >
                        {getFormattedCurrencySymbol(currency)}
                      </p>
                      <input
                        className={"funding-custom-tree-input"}
                        style={{
                          fontSize: "18px",
                          paddingBottom: "12px",
                        }}
                        onInput={(e: ChangeEvent<HTMLInputElement>) => {
                          // replaces any character other than number to blank
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          //  if length of input more than 12, display only 12 digits
                          if (e.target.value.toString().length >= 12) {
                            e.target.value = e.target.value
                              .toString()
                              .slice(0, 12);
                          }
                        }}
                        value={customInputValue}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        onChange={(e) => {
                          setCustomValue(e);
                          setCustomInputValue(e.target.value);
                        }}
                        ref={customInputRef}
                      />
                    </div>
                  ) : (
                    <>
                      <div className={`funding-selection-option-text m-10`}>
                        <span>
                          {option.caption ? option.caption : t("customAmount")}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            }
          )}
      </div>
      {paymentSetup && paymentSetup.unitCost ? (
        <p className="currency-selection mt-30">
          <button
            onClick={() => {
              // if the purpose is planet-cash (i.e Top-up PlanetCash) then lock the currency and country for transaction.
              // since transaction needs to happen in the same currency.

              projectDetails?.purpose !== "planet-cash" &&
                !isPlanetCashActive &&
                setopenCurrencyModal(true);
            }}
            className="text-bold text-primary"
            style={{
              marginRight: "4px",
              ...(isPlanetCashActive && { cursor: "text" }),
            }}
          >
            {projectDetails?.purpose !== "planet-cash" ? (
              <span style={{ marginRight: "4px" }} className={"text-normal"}>
                {t("selectCurrency")}
              </span>
            ) : (
              <span style={{ marginRight: "4px" }} className={"text-normal"}>
                {t("currency")}
              </span>
            )}

            {currency}
            {projectDetails?.purpose !== "planet-cash" &&
              !isPlanetCashActive && (
                <DownArrowIcon color={themeProperties.primaryColor} />
              )}
          </button>
        </p>
      ) : (
        <div className={"mt-20"}>
          <TreeCostLoader width={150} />
        </div>
      )}
    </div>
  );
}
function getPaymentOptionIcons(logoName: string) {
  return (
    <div
      className="funding-icon"
      dangerouslySetInnerHTML={createMarkup(logoName)}
    />
  );
}
function createMarkup(logoName: string) {
  return { __html: logoName };
}
export default FundingDonations;
