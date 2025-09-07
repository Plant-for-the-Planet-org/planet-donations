import React, { ReactElement } from "react";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import getFormattedCurrency from "../../Utils/getFormattedCurrency";
import { getFormattedNumber } from "../../Utils/getFormattedNumber";
import TreeCostLoader from "../../Common/ContentLoaders/TreeCostLoader";
import { useTranslation } from "next-i18next";
import InfoIcon from "public/assets/icons/InfoIcon";

interface Props {
  isSupportedDonation?: boolean;
}

function DonationAmount({ isSupportedDonation = false }: Props): ReactElement {
  const { t, i18n } = useTranslation(["common", "country"]);
  const { quantity, currency, paymentSetup } =
    React.useContext(QueryParamContext);

  // Calculate amounts
  const unitAmount = paymentSetup?.unitCost
    ? paymentSetup.unitCost * quantity
    : 0;
  const empowermentAmount = isSupportedDonation ? unitAmount * 0.25 : 0;
  const totalAmount = unitAmount + empowermentAmount;

  // Format currency helper
  const formatCurrency = (amount: number) =>
    getFormattedCurrency(i18n.language, currency, amount);

  // Get unit description
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

  // Render regular donation
  if (!isSupportedDonation) {
    return (
      <div className="w-100 text-center text-bold mt-20">
        <span className="text-primary" style={{ marginRight: "4px" }}>
          {formatCurrency(unitAmount)}
        </span>
        {getUnitDescription()}
      </div>
    );
  }

  // Render supported donation breakdown
  return (
    <div className="w-100 mt-20 text-bold">
      <div>
        <span className="text-primary">{formatCurrency(unitAmount)}</span>
        <span style={{ marginLeft: "4px" }}>{getUnitDescription()}</span>
      </div>
      <div>
        <span className="text-primary">
          {formatCurrency(empowermentAmount)}
        </span>
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

export default DonationAmount;
