import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";
import getFormatedCurrency, {
  getFormatedCurrencySymbol,
} from "../../../Utils/getFormattedCurrency";
import DownArrowIcon from "../../../../public/assets/icons/DownArrowIcon";
import TreeCostLoader from "../../../Common/ContentLoaders/TreeCostLoader";
import { getCountryDataBy } from "../../../Utils/countryUtils";
import { getPaymentOptionIcons } from "src/Utils/getImageURL";
import { useRouter } from "next/router";

interface Props {
  setopenCurrencyModal: any;
  setInvalidAmount: any;
}

function FundingDonations({
  setopenCurrencyModal,
  setInvalidAmount,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(["common", "country"]);

  const [customInputValue, setCustomInputValue] = React.useState("");

  const [isCustomDonation, setisCustomDonation] = React.useState(false);

  const AllIcons = [
    "/assets/images/funding/shovel.png",
    "/assets/images/funding/collect.png",
    "/assets/images/funding/sunshine.png",
    "/assets/images/funding/sprout.png",
  ];

  const {
    paymentSetup,
    currency,
    quantity,
    setquantity,
    isGift,
    giftDetails,
    frequency,
  } = React.useContext(QueryParamContext);

  const router = useRouter();

  const setCustomValue = (value: any) => {
    if (value) {
      if (value === "" || value < 1) {
        // if input is '', default 1
        setquantity(1);
      } else if (value.toString().length <= 12) {
        setquantity(value);
      }
    }
  };
  React.useEffect(() => {
    if (paymentSetup && paymentSetup.options) {
      // Set all quantities in the allOptionsArray
      const newallOptionsArray = [];
      for (const option of paymentSetup.options) {
        newallOptionsArray.push(option.quantity);
      }
      const defaultPaymentOption = paymentSetup.options.filter(
        (option) => option.isDefault === true
      );
      const newQuantity = router.query.units
        ? Number(router.query.units)
        : defaultPaymentOption.length > 0
        ? defaultPaymentOption[0].quantity
        : paymentSetup.options[1].quantity;
      setquantity(newQuantity);

      if (newQuantity && !newallOptionsArray.includes(newQuantity)) {
        setCustomInputValue(
          paymentSetup.unitBased
            ? newQuantity * paymentSetup.unitCost
            : newQuantity
        );
        setisCustomDonation(true);
      } else if (newQuantity == 0) {
        setisCustomDonation(true);
      } else if (newQuantity == 0) {
        setisCustomDonation(true);
        customInputRef.current.focus();
      } else {
        setCustomInputValue("");
        setisCustomDonation(false);
      }
    }
  }, [paymentSetup]);
  React.useEffect(() => {
    if (isCustomDonation) {
      customInputRef?.current?.focus();
    }
  }, [isCustomDonation]);

  const customInputRef = React.useRef(null);

  const amountRegex1 = /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/;
  const amountRegex2 = /^(\d+(\,\d{0,2})?|\,?\d{1,2})$/;

  return (
    <>
      <div
        className={`funding-selection-options-container ${
          isGift && giftDetails.recipientName === "" ? "display-none" : ""
        }`}
      >
        {paymentSetup.options &&
          paymentSetup.options.map((option, index) => {
            return option.quantity ? (
              <div
                key={index}
                onClick={() => {
                  setquantity(option.quantity);
                  setisCustomDonation(false);
                  setCustomInputValue("");
                }}
                className={`funding-selection-option ${
                  option.quantity === quantity && !isCustomDonation
                    ? "funding-selection-option-selected"
                    : ""
                }${paymentSetup.costIsMonthly ? "   monthly-option" : ""}`}
              >
                {option.caption ? (
                  <div className="funding-selection-option-text">
                    <p>{option.caption}</p>
                  </div>
                ) : (
                  []
                )}
                {paymentSetup.options[index].icon ? (
                  <img
                    className="funding-icon"
                    src={getPaymentOptionIcons(
                      paymentSetup.options[index].icon
                    )}
                  />
                ) : (
                  []
                )}
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
                    {getFormatedCurrency(
                      i18n.language,
                      currency,
                      paymentSetup.costIsMonthly && frequency == "yearly"
                        ? option.quantity * 12
                        : option.quantity
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div
                key={index}
                className={`funding-selection-option custom ${
                  isCustomDonation ? "funding-selection-option-selected" : ""
                }${paymentSetup.costIsMonthly ? "   full-width" : " flex-50"}`}
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
                      {getFormatedCurrencySymbol(currency)}
                    </p>
                    <input
                      className={"funding-custom-tree-input"}
                      style={{
                        fontSize: "18px",
                        paddingBottom: "12px",
                      }}
                      onInput={(e) => {
                        // ^\d{0,5}(\.,\d{1,3})?$
                        // replaces any character other than number to blank
                        e.target.value = e.target.value.replace(
                          /[^0-9,.]/g,
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
                      inputMode="decimal"
                      // pattern="/^(\d+)(\,\d{1,2}|\.\d{1,2})?$/"
                      onChange={(e) => {
                        setCustomInputValue(e.target.value);
                        if (
                          !amountRegex1.test(e.target.value) &&
                          !amountRegex2.test(e.target.value)
                        ) {
                          setInvalidAmount(true);
                        } else {
                          setCustomValue(
                            Number(e.target.value.replace(/[,]/g, "."))
                          );
                          setInvalidAmount(false);
                        }
                      }}
                      ref={customInputRef}
                    />
                  </div>
                ) : (
                  <>
                    <div className={`funding-selection-option-text m-10`}>
                      <span>{option.caption}</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
      {paymentSetup && paymentSetup.unitCost ? (
        <p className="currency-selection mt-30">
          <button
            onClick={() => {
              setopenCurrencyModal(true);
            }}
            className="text-bold text-primary"
            style={{ marginRight: "4px" }}
          >
            <span style={{ marginRight: "4px" }} className={"text-normal"}>
              {t("selectCurrency")}
            </span>
            {currency} <DownArrowIcon color={themeProperties.primaryColor} />
          </button>
        </p>
      ) : (
        <div className={"mt-20"}>
          <TreeCostLoader width={150} />
        </div>
      )}
    </>
  );
}

export default FundingDonations;
