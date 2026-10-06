import React, { ReactElement } from "react";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import getFormattedCurrency from "../../Utils/getFormattedCurrency";
import { getFormattedNumber } from "../../Utils/getFormattedNumber";
import TreeCostLoader from "../../Common/ContentLoaders/TreeCostLoader";
import { useTranslation } from "next-i18next";
import DonationInfoTooltip from "./DonationInfoTooltip";

function DonationAmount(): ReactElement {
  const { t, i18n } = useTranslation(["common", "country"]);
  const {
    quantity,
    currency,
    paymentSetup,
    isSupportedDonation,
    getDonationBreakdown,
  } = React.useContext(QueryParamContext);

  const { mainProjectAmount, supportAmount, totalAmount } =
    getDonationBreakdown();

  const formatCurrency = (amount: number) =>
    getFormattedCurrency(i18n.language, currency, amount);

  const getUnitDescription = () => {
    if (paymentSetup?.unitType === "tree") {
      return t("fortreeCountTrees", {
        count: Number(quantity),
        treeCount: getFormattedNumber(i18n.language, Number(quantity)),
      });
    }
    if (paymentSetup?.unitType === "m2") {
      return t("forQuantitym2", {
        quantity: getFormattedNumber(i18n.language, Number(quantity)),
      });
    }
    return "";
  };

  // Render loading state
  if (!paymentSetup?.unitCost) {
    return (
      <div className="text-center mt-20">
        <TreeCostLoader width={150} />
      </div>
    );
  }

  // Render supported donation breakdown
  if (isSupportedDonation) {
    return (
      <div className="w-100 mt-20">
        <div className="donation-breakdown-item">
          <span>{formatCurrency(mainProjectAmount)}</span>
          <span>{getUnitDescription()}</span>
        </div>
        <div className="donation-breakdown-item">
          <span>{formatCurrency(supportAmount)}</span>
          <span>{t("forEmpowerment")}</span>
          <DonationInfoTooltip />
        </div>
        <div className="donation-total">
          <span className="text-primary">
            {t("totalAmount", {
              formattedAmountWithCurrency: formatCurrency(totalAmount),
            })}
          </span>
        </div>
      </div>
    );
  }

  // Render regular donation
  return (
    <div className="w-100 text-center text-bold mt-20">
      <span className="text-primary" style={{ marginRight: "4px" }}>
        {formatCurrency(mainProjectAmount)}
      </span>
      {getUnitDescription()}
    </div>
  );
}

export default DonationAmount;
