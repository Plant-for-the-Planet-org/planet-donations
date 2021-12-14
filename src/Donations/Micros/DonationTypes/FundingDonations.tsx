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
}

function FundingDonations({ setopenCurrencyModal }: Props): ReactElement {
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

  const setCustomValue = (e: any) => {
    if (e.target) {
      if (e.target.value === "" || e.target.value < 1) {
        // if input is '', default 1
        setquantity(1);
      } else if (e.target.value.toString().length <= 12) {
        setquantity(e.target.value);
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
      const newQuantity = router.query.units
        ? Number(router.query.units)
        : paymentSetup.options[1].quantity;
      if (newQuantity && !newallOptionsArray.includes(newQuantity)) {
        setCustomInputValue(
          paymentSetup.unitBased ? quantity * paymentSetup.unitCost : quantity
        );
        setquantity(Number(router.query.units));
        setisCustomDonation(true);
      } else {
        setCustomInputValue("");
        setquantity(newQuantity);
        setisCustomDonation(false);
      }
    }
  }, [paymentSetup]);

  const customInputRef = React.useRef(null);
  console.log(`option.quantity , quantity `, paymentSetup.options, quantity);
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
                  <span>
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
                className={`funding-selection-option ${
                  isCustomDonation ? "funding-selection-option-selected" : ""
                }${paymentSetup.costIsMonthly ? "   full-width" : "flex-50"}`}
                onClick={() => {
                  setisCustomDonation(true);
                  customInputRef.current.focus();
                }}
              >
                <div className="funding-selection-option-text">
                  <p>{option.caption}</p>
                </div>
                {/* {paymentSetup.costIsMonthly ? (
                  <img className="funding-icon" src={AllIcons[index]} />
                ) : (
                  []
                )} */}
                <div className="funding-selection-option-text">
                  <div
                    className="d-flex row"
                    style={{ alignItems: "flex-end", justifyContent: "center" }}
                  >
                    <p style={{ marginBottom: "0px", marginRight: "6px" }}>
                      {getFormatedCurrencySymbol(currency)}
                    </p>
                    <input
                      className={"funding-custom-tree-input"}
                      onInput={(e) => {
                        // replaces any character other than number to blank
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
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
                </div>
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
