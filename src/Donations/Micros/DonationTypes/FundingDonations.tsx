import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";
import getFormatedCurrency from "../../../Utils/getFormattedCurrency";

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

  const { paymentSetup, currency } = React.useContext(QueryParamContext);

  const [quantity, setquantity] = React.useState(50);

  const setCustomValue = (e: any) => {
    if (e.target) {
      // if (e.target.value === "" || e.target.value < 1) {
      //   // if input is '', default 1
      //   settreeCount(1);
      // } else if (e.target.value.toString().length <= 12) {
      //   settreeCount(e.target.value);
      // }
    }
  };
  // React.useEffect(() => {
  //     if (![10, 20, 50, 150].includes(treeCount)) {
  //       setisCustomDonation(true);
  //       setCustomValue(treeCount);
  //       setCustomInputValue(treeCount);
  //     }
  //   }, [treeCount]);
  const customInputRef = React.useRef(null);

  return (
    <div>
      <div className="funding-selection-options-container">
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
                }`}
              >
                <img className="funding-icon" src={AllIcons[index]} />
                <div className="funding-selection-option-text">
                  <p>{option.caption}</p>
                  <span>
                    {getFormatedCurrency(
                      i18n.language,
                      currency,
                      paymentSetup.cost * option.quantity
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div
                key={index}
                className={`funding-selection-option ${
                  isCustomDonation ? "funding-selection-option-selected" : ""
                }`}
                onClick={() => {
                  setisCustomDonation(true);
                  customInputRef.current.focus();
                }}
              >
                <img className="funding-icon" src={AllIcons[index]} />
                <div className="funding-selection-option-text">
                  <p>{option.caption}</p>
                  <div className="d-flex row text-align-center justify-content-center">
                    <p>{currency}</p>
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
      {/* <Image src={ShovelIcon} />
      <Image src={SunshineIcon} />
      <Image src={SproutIcon} /> */}
    </div>
  );
}

export default FundingDonations;
