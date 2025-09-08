import React, { ReactElement } from "react";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import getFormattedCurrency from "../../Utils/getFormattedCurrency";
import { getFormattedNumber } from "../../Utils/getFormattedNumber";
import TreeCostLoader from "../../Common/ContentLoaders/TreeCostLoader";
import { useTranslation } from "next-i18next";
import InfoIcon from "public/assets/icons/InfoIcon";

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
      <div className="w-100 mt-20 text-bold">
        <div>
          <span className="text-primary">
            {formatCurrency(mainProjectAmount)}
          </span>
          <span style={{ marginLeft: "4px" }}>{getUnitDescription()}</span>
        </div>
        <div>
          <span className="text-primary">{formatCurrency(supportAmount)}</span>
          <span style={{ marginLeft: "4px" }}>{t("forEmpowerment")}</span>
        </div>
        <div className="mt-10 d-flex align-items-center">
          <span className="text-primary">{formatCurrency(totalAmount)}</span>
          <span style={{ marginLeft: "4px" }}>{t("forClimateJustice")}</span>
          <span
            style={{
              marginLeft: "8px",
              width: "16px",
              height: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <InfoIcon />
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
