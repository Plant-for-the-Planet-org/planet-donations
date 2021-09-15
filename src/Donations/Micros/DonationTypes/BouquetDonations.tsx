import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";
import getFormatedCurrency, {
  getFormatedCurrencySymbol,
} from "../../../Utils/getFormattedCurrency";
import DownArrowIcon from "../../../../public/assets/icons/DownArrowIcon";
import TreeCostLoader from "../../../Common/ContentLoaders/TreeCostLoader";
import LeafIcon from "../../../../public/assets/icons/LeafIcon";
import PlantPotIcon from "../../../../public/assets/icons/PlantPotIcon";
import TreeIcon from "../../../../public/assets/icons/TreeIcon";
import TwoLeafIcon from "../../../../public/assets/icons/TwoLeafIcon";
import CustomIcon from "../../../../public/assets/icons/CustomIcon";

interface Props {
  setopenCurrencyModal: any;
}

function FundingDonations({ setopenCurrencyModal }: Props): ReactElement {
  const { t, i18n } = useTranslation(["common", "country"]);

  const [customInputValue, setCustomInputValue] = React.useState("");

  const [isCustomDonation, setisCustomDonation] = React.useState(false);
  const AllIcons = [
    <LeafIcon />,
    <TwoLeafIcon />,
    <PlantPotIcon />,
    <TreeIcon />,
  ];
  const { paymentSetup, currency, quantity, setquantity, isGift, giftDetails } =
    React.useContext(QueryParamContext);

  const setCustomValue = (e: any) => {
    if (e.target) {
      if (e.target.value === "" || e.target.value < 1) {
        // if input is '', default 1
        setquantity(1 / paymentSetup.unitCost);
      } else if (e.target.value.toString().length <= 12) {
        setquantity(e.target.value / paymentSetup.unitCost);
      }
    }
  };

  const customInputRef = React.useRef(null);

  React.useEffect(() => {
    if (paymentSetup && paymentSetup.options) {
      if (paymentSetup.options.length > 2) {
        setquantity(paymentSetup.options[2].quantity);
      } else {
        setquantity(paymentSetup.options[1].quantity);
      }
    }
  }, [paymentSetup]);

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
                  <span style={{fontSize:'20px'}}>
                    {getFormatedCurrency(
                      i18n.language,
                      currency,
                      paymentSetup.unitCost * option.quantity
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
            <div
              className={"funding-icon"}
              style={{ height: "auto", width: "auto" }}
            >
              <CustomIcon />
            </div>

            <div className="funding-selection-option-text">
              <div
                className="d-flex row"
                style={{ alignItems: "flex-end", justifyContent: "center" }}
              >
                <p style={{ marginBottom: "0px", marginRight: "6px" }}>
                  {/* {getFormatedCurrencySymbol(currency)} */}
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
