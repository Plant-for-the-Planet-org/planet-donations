import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";
import getFormatedCurrency, {
  getFormatedCurrencySymbol,
} from "../../../Utils/getFormattedCurrency";
import DownArrowIcon from "../../../../public/assets/icons/DownArrowIcon";
import TreeCostLoader from "../../../Common/ContentLoaders/TreeCostLoader";

interface Props {
  setopenCurrencyModal: any;
}

function FundingDonations({ setopenCurrencyModal }: Props): ReactElement {
  const { t, i18n } = useTranslation(["common", "country"]);

  const [customInputValue, setCustomInputValue] = React.useState("");

  const [isCustomDonation, setisCustomDonation] = React.useState(false);
  const { paymentSetup, currency, quantity, setquantity, isGift, giftDetails, amount,setamount } =
    React.useContext(QueryParamContext);

  const setCustomValue = (e: any) => {
    if (e.target) {
      if (e.target.value === "" || e.target.value < 1) {
        // if input is '', default 1
        setquantity(1 / paymentSetup.unitCost);
        setamount(1)
      } else if (e.target.value.toString().length <= 12) {
        setquantity(e.target.value / paymentSetup.unitCost);
        setamount(e.target.value)
      }
    }
  };

  const customInputRef = React.useRef(null);

  React.useEffect(() => {
    if (paymentSetup && paymentSetup.options) {
      // Set all quantities in the allOptionsArray
      const newallOptionsArray = [];
      for (const option of paymentSetup.options) {
        newallOptionsArray.push(option.quantity);
      }
      if (!newallOptionsArray.includes(quantity)) {
        setCustomInputValue(quantity * paymentSetup.unitCost);
        setCustomValue(quantity * paymentSetup.unitCost);
      }
    }
  }, [paymentSetup]);

  // IMP TO DO -> 
  // Due to new requirements of showing Rounded costs for Bouquet and in 
  // future for all we will now have to start passing the amount instead 
  // of quantity and unitCost, this demands a structural change in multiple 
  // files and hence should be done carefully

  const roundedCostCalculator=(unitCost,quantity)=>{
    const cost = unitCost  * quantity;
    return Math.trunc(Math.ceil(cost/5)*5);
  }

  React.useEffect(()=>{
    console.log(`running`, amount)
    setamount(roundedCostCalculator(paymentSetup.unitCost, quantity))
    console.log(`after`, amount)
    // TODO - ERROR After going to next screen and coming back the amount is being rounded off
  },[paymentSetup])

  return (
    <>
      <div
        className={`funding-selection-options-container ${
          isGift && giftDetails.recipientName === "" ? "display-none" : ""
        }`}
      >
        {paymentSetup.options &&
          paymentSetup.options.slice(0, 6).map((option, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setquantity(option.quantity);
                  setamount(roundedCostCalculator(paymentSetup.unitCost, option.quantity))
                  setisCustomDonation(false);
                  setCustomInputValue("");
                }}
                className={`funding-selection-option ${
                  option.quantity === quantity && !isCustomDonation
                    ? "funding-selection-option-selected"
                    : ""
                }`}
                style={{ maxWidth: "100px" }}
              >
                {/* <div
                  className={"funding-icon"}
                  style={{ height: "auto", width: "auto" }}
                >
                  {AllIcons[index]}
                </div> */}
                <div className="funding-selection-option-text">
                  <span style={{ fontSize: "20px" }}>
                    {getFormatedCurrency(
                      i18n.language,
                      currency,
                      roundedCostCalculator(paymentSetup.unitCost, option.quantity)
                    )}
                  </span>
                </div>
              </div>
            );
          })}

        {paymentSetup && paymentSetup.options && (
          <div
            className={`funding-selection-option ${
              isCustomDonation ? "funding-selection-option-selected" : ""
            }`}
            onClick={() => {
              setisCustomDonation(true);
              customInputRef.current.focus();
            }}
            style={{ flexGrow: 1 }}
          >
            {/* <div
              className={"funding-icon"}
              style={{ height: "auto", width: "auto" }}
            >
              <CustomIcon />
            </div> */}

            <div className="funding-selection-option-text">
              <div
                className="d-flex row"
                style={{ alignItems: "flex-end", justifyContent: "center" }}
              >
                <p
                  style={{
                    marginBottom: "0px",
                    marginRight: "6px",
                    fontSize: "20px",
                  }}
                >
                  {getFormatedCurrencySymbol(currency)}
                </p>
                <input
                  className={"funding-custom-tree-input"}
                  onInput={(e) => {
                    // replaces any character other than number to blank
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    //  if length of input more than 12, display only 12 digits
                    if (e.target.value.toString().length >= 12) {
                      e.target.value = e.target.value.toString().slice(0, 12);
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
                  style={{ fontSize: "20px" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {paymentSetup && paymentSetup.unitCost ? (
        <p className="currency-selection mt-30">
          <button
            onClick={() => {
              setopenCurrencyModal(true);
            }}
            className="text-bold text-primary"
            style={{ marginRight: "4px" }}
            data-test-id="currency"
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
