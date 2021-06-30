import React, { ReactElement } from 'react'
import CustomIcon from '../../../../public/assets/icons/CustomIcon';
import { QueryParamContext } from '../../../Layout/QueryParamContext';
import DownArrowIcon from "../../../../public/assets/icons/DownArrowIcon";
import getFormatedCurrency from '../../../Utils/getFormattedCurrency';
import themeProperties from "../../../../styles/themeProperties";
import { useTranslation } from "next-i18next";
import TreeCostLoader from "../../../Common/ContentLoaders/TreeCostLoader";

interface Props {
    setopenCurrencyModal:any;
}

function TreeDonation({setopenCurrencyModal}: Props): ReactElement {
    const { t, i18n } = useTranslation(["common", "country"]);

    const {
        isGift,
        treeSelectionOptions,
        treeCount,
        settreeCount,
        currency,
        paymentSetup,
        giftDetails,
      } = React.useContext(QueryParamContext);

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


      const customInputRef = React.useRef(null);
    return (
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
          </div>
    )
}

export default TreeDonation
