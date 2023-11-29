import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import getFormatedCurrency from "src/Utils/getFormattedCurrency";
import { getFormattedNumber } from "src/Utils/getFormattedNumber";
import { PaymentOptions, UnitType } from "src/Common/Types";
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
        {getFormatedCurrency(
          i18n.language,
          currency,
          paymentSetup.unitCost * quantity
        )}
      </strong>
      {getAdditionalInfo(
        paymentSetup.unitType,
        frequency,
        i18n.language,
        quantity
      )}
    </div>
  );
};

export default TransactionSummary;
