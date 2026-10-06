import { ReactElement, useContext, useMemo } from "react";
import { useTranslation } from "next-i18next";
import getFormattedCurrency from "src/Utils/getFormattedCurrency";
import { getFormattedNumber } from "src/Utils/getFormattedNumber";
import { PaymentOptions, UnitType } from "src/Common/Types";
import { QueryParamContext } from "src/Layout/QueryParamContext";
import styles from "./LeftPanel.module.scss";

interface Props {
  currency: string;
  quantity: number;
  frequency: string;
  paymentSetup: PaymentOptions;
}

const TransactionSummary = ({
  currency,
  quantity,
  frequency,
  paymentSetup,
}: Props): ReactElement => {
  const { t, i18n } = useTranslation("common");
  const { isSupportedDonation, getDonationBreakdown } =
    useContext(QueryParamContext);

  // Get the appropriate amount to display
  const displayAmount = useMemo(() => {
    if (isSupportedDonation) {
      const { totalAmount } = getDonationBreakdown();
      return totalAmount;
    }
    return paymentSetup.unitCost * quantity;
  }, [
    isSupportedDonation,
    getDonationBreakdown,
    paymentSetup.unitCost,
    quantity,
  ]);

  /** Generates unit/frequency info when needed */
  const getAdditionalInfo = (
    unitType: UnitType,
    frequency: string,
    language: string,
    quantity: number
  ): string => {
    let info = "";
    switch (unitType) {
      case "tree":
        info =
          info +
          " " +
          t("fortreeCountTrees", {
            count: Number(quantity),
            treeCount: getFormattedNumber(language, Number(quantity)),
          });
        break;
      case "m2":
        info =
          info +
          " " +
          t("forQuantitym2", {
            quantity: getFormattedNumber(language, Number(quantity)),
          });
        break;
      default:
        break;
    }

    switch (frequency) {
      case "monthly":
        info = info + " " + t("everyMonth");
        break;
      case "yearly":
        info = info + " " + t("everyYear");
        break;
      default:
        break;
    }

    return info;
  };

  return (
    <div className={styles["transaction-summary"]}>
      {t("donating")}{" "}
      <strong>
        {getFormattedCurrency(i18n.language, currency, displayAmount)}
      </strong>
      {!isSupportedDonation &&
        getAdditionalInfo(
          paymentSetup.unitType,
          frequency,
          i18n.language,
          quantity
        )}
    </div>
  );
};

export default TransactionSummary;
