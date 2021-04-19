import React, { ReactElement } from "react";
import CustomIcon from "../../../public/assets/icons/CustomIcon";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import GiftForm from "./GiftForm";
import { useTranslation } from "next-i18next";
import getFormatedCurrency from "../../Utils/getFormattedCurrency";
import DownArrowIcon from "../../../public/assets/icons/DownArrowIcon";

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
  } = React.useContext(QueryParamContext);
  const { t, i18n } = useTranslation(["common", "country"]);

  const [showGiftForm, setshowGiftForm] = React.useState(true);

  return (
    <div className="donations-forms-container">
      <div className="donations-form">
        <button className="login-continue">Login & Continue</button>
        <div className="donations-tree-selection-step">
          <p className="title-text">Donate</p>
          <div className="donations-gift-container">
            <GiftForm showGiftForm={showGiftForm} setshowGiftForm={setshowGiftForm}  />
          </div>
          <div
            className={`donations-tree-selection ${
              isGift && showGiftForm ? "display-none" : ""
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
                <button className={'tax-country-selection'}>
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
                <div className={"isTaxDeductibleText"}>
                  {t("taxDeductionNotAvailableForProject")}
                </div>
              </div>
            )}

            <button
              onClick={() => setdonationStep(2)}
              className="primary-button w-100 mt-30"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationsForm;
